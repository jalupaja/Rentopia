package com.othr.rentopia.controller;

import com.othr.rentopia.api.EmailService;
import com.othr.rentopia.config.AuthResponse;
import com.othr.rentopia.config.JwtProvider;
import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.model.ResetPasswordToken;
import com.othr.rentopia.model.TwoFAToken;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.api.GoogleOAuthService;
import com.othr.rentopia.service.AccountServiceImpl;
import com.othr.rentopia.service.ResetPasswordService;
import com.othr.rentopia.service.TwoFATokenService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController()
@RequestMapping("api")
public class UserController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GoogleOAuthService googleOAuthService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ResetPasswordService resetPasswordService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AccountServiceImpl customUserDetails;

    @Autowired
    private TwoFATokenService twoFATokenService;

    @Autowired
    private Environment environment;

    @PostMapping(value = "login", produces = "application/json")
    public @ResponseBody ResponseEntity<String> processLoginRequest(@RequestBody String loginRequest) {
        JSONObject request = new JSONObject(loginRequest);
        JSONObject response = new JSONObject();
        response.put("success", false);

        String email = (String) request.get("useremail");
        String password = (String) request.get("userpassword");

        Account userDetails = accountService.getAccountWithPassword(email);

        if (userDetails == null || !passwordEncoder.matches(password, userDetails.getPassword())) {
            return new ResponseEntity<>(response.toString(), HttpStatus.UNAUTHORIZED);
        } else {
            return returnLoginResponse(response, userDetails);
        }
    }

    @PostMapping(value="loginOAuth", produces="application/json")
    public ResponseEntity<String> loginSuccess(@RequestBody String loginRequest) {
        // login via Google OAuth
        JSONObject request = new JSONObject(loginRequest);
        JSONObject response = new JSONObject();
        response.put("success", false);

        String googleToken = (String) request.get("token");

        String email;
        try {
            // verify token with google
            email = googleOAuthService.getEmail(googleToken);
            System.out.println("Google Authenticated: " + email);
        } catch (Exception e) {
            System.out.println("Invalid token: " + e.getMessage());
            return new ResponseEntity<>(response.toString(), HttpStatus.UNAUTHORIZED);
        }

        Account account = accountService.getAccountWithPassword(email);
        if(account == null){
            // Account doesn't exist -> create new account

            account = new Account();
            account.setEmail(email);
            account.setName(email.substring(0, email.indexOf('@')));
            account.setPassword("");
            account.setRole(Account.Role.USER);

            Location location = new Location();
            location.setCity("");
            location.setPostalCode("");
            location.setStreet("");
            location.setCountry("");
            account.setLocation(location);

            accountService.saveAccount(account);
        }

        if ("".equals(account.getPassword())) {
            // Account existed (or was just created) and was created using Google Login (Password == "") -> login
            return returnLoginResponse(response, account);
        } else {
            // Account exists but wasn't created using Google Login -> ERROR
            response.put("message", "Account wasn't created using Google");
            return new ResponseEntity<>(response.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    private ResponseEntity<String> returnLoginResponse(JSONObject response, Account account) {

        boolean twoFAEnabled = Boolean.parseBoolean(environment.getProperty("rentopia.twofa"));

        if(twoFAEnabled){
            TwoFAToken loginToken = sendAuthCode(account);
            response.put("loginToken", loginToken.getToken());
        }
        else{
            AuthResponse authResponse = getAuthResponse(account);
            response.put("jwt", authResponse.getJwt());
        }
        response.put("success", true);

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    private TwoFAToken sendAuthCode(Account account){
        TwoFAToken loginToken = twoFATokenService.createToken(account);
        String subject = "Your authentication code for your Rentopia login";
        String body = "<h1>Hello, " + account.getName() + "!</h1>\n"
                + "<p>This authenication code expires in 15 minutes</p>\n"
                + "<p><b>"+ loginToken.getAuthCode()+"</b></p>";
        EmailService.Email mail = new EmailService.Email(EmailService.GmailUsername, account.getEmail(), subject, body);
        mail.loadTemplate(subject, body);

        emailService.sendEmail(mail);

        return loginToken;
    }

    @PostMapping(path="login/confirm", produces="application/json")
    public @ResponseBody ResponseEntity<AuthResponse> ConfirmAccount(@RequestBody String requestBody){
        JSONObject request = new JSONObject(requestBody);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setSuccess(false);

        String tokenValue = request.getString("token");
        String authCode = request.optString("authCode", null);

        if(authCode == null || tokenValue == null){
            authResponse.setMessage("invalid_request");
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }

        //validate token and code
        TwoFAToken token = twoFATokenService.getTokenByValue(tokenValue);
        if(token == null){
            authResponse.setMessage("no_token");
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }

        if(token.getExpiration().isBefore(LocalDateTime.now())){
            authResponse.setMessage("token_expired");
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }

        if(!token.getAuthCode().equals(authCode)){
            authResponse.setMessage("token_invalid");
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }

        twoFATokenService.removeTokenById(token.getId());

        //return jwt
        Account user = accountService.getAccountWithPassword(token.getUserEmail());
        if(user == null){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        AuthResponse response  = getAuthResponse(user);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private AuthResponse getAuthResponse(Account user){
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, user.getPassword(),
                user.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication, user.getId());
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Confirmed");
        authResponse.setJwt(jwt);
        authResponse.setSuccess(true);

        return authResponse;
    }

    @PostMapping(path="login/confirm/email", produces="application/json")
    public @ResponseBody ResponseEntity<String>  SendAuthCodeEmail(@RequestBody String requestData){
        JSONObject request = new JSONObject(requestData);
        JSONObject response = new JSONObject();
        response.put("success", false);

        String tokenValue = request.optString("token", null);
        if(tokenValue != null){
            TwoFAToken token = twoFATokenService.getTokenByValue(tokenValue);
            if (token == null) {
                response.put("reason","no_token");
                return new ResponseEntity<>(response.toString(), HttpStatus.OK);
            }

            Account user = accountService.getAccount(token.getUserEmail());
            token = sendAuthCode(user);

            response.put("success", true);
            response.put("token", token.getToken());
        }

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @GetMapping(path="user/me", produces="application/json")
    public @ResponseBody ResponseEntity<Account> GetAuthUser(Authentication authentication){
        String email = (String) authentication.getPrincipal();
        Account account = accountService.getAccount(email);
        if(account == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        account.setPassword(null);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @PostMapping(path = "resetPasswordMail", produces = "application/json")
    public @ResponseBody ResponseEntity<String> SendResetPasswordMail(@RequestBody String userMail) {
        JSONObject request = new JSONObject(userMail);
        JSONObject response = new JSONObject();
        response.put("success", false);

        Account user = accountService.getAccount(request.getString("mail"));
        if(user == null){
            response.put("reason", "no_existent_user");
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        resetPasswordService.removeTokenIfExists(user.getEmail());

        String token = UUID.randomUUID().toString();
        ResetPasswordToken newToken = new ResetPasswordToken();
        newToken.setToken(token);
        newToken.setUserEmail(user.getEmail());
        newToken.setExpiration(LocalDateTime.now().plusMinutes(ResetPasswordToken.EXPIRATION));

        try{
            resetPasswordService.saveToken(newToken);
        } catch(Exception e){
            System.out.println("Storing resetpasswordtoken threw exception: "+e.getMessage());
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        String subject = "Reset your password of your Rentopia Account";
        String body = "<h1>Hello, " + user.getName() + "!</h1>\n"
                + "<p>Click on this button to reset your password</p>\n"
                + "<a href=\"http://localhost:3000/newPassword/" + token + "\" class=\"button\">Reset Password</a>\n";
        EmailService.Email mail = new EmailService.Email(EmailService.GmailUsername, user.getEmail(), subject, body);
        mail.loadTemplate(subject, body);

        emailService.sendEmail(mail);

        response.put("success", true);
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @PostMapping(path="user/update", produces = "application/json")
    public @ResponseBody ResponseEntity<Account> UpdateUser(@RequestBody String account) {
        JSONObject request = new JSONObject(account);

        if(account != null) {
            Account updAccount = new Account();
            updAccount.setId(Long.valueOf((Integer) request.get("id")));
            updAccount.setName((String) request.get("name"));
            updAccount.setEmail((String) request.get("email"));
            updAccount.setDescription((String) request.get("description"));
            updAccount.setCompany((String) request.get("company"));

            Location oldlocation = new Location();
            oldlocation.setPostalCode((String) request.get("postCode"));
            oldlocation.setCity((String) request.get("city"));
            oldlocation.setStreet((String) request.get("street"));
            oldlocation.setCountry((String) request.get("country"));
            updAccount.setLocation(oldlocation);

            updAccount = customUserDetails.updateAccount(updAccount);
            return new ResponseEntity<>(updAccount, HttpStatus.OK);
        }


        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "register", produces = "application/json")
    public @ResponseBody ResponseEntity<AuthResponse> RegisterUser(@RequestBody String userInfo) {
        JSONObject request = new JSONObject(userInfo);
        AuthResponse authResponse = new AuthResponse();

        String email = (String) request.get("email");
        if (accountService.emailExists(email)) {
            authResponse.setSuccess(false);
            authResponse.setMessage("There is already an account for this email");
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.UNAUTHORIZED);
        }

        Account newAccount = new Account();
        newAccount.setName((String) request.get("name"));
        newAccount.setEmail((String) request.get("email"));

        Location location = new Location();
        location.setCity((String) request.get("city"));
        location.setPostalCode((String) request.get("postalCode"));
        location.setStreet((String) request.get("street"));
        location.setCountry((String) request.get("country"));
        newAccount.setLocation(location);

        String password = (String) request.get("password1");
        newAccount.setPassword(passwordEncoder.encode(password));

        String usageReason = (String) request.get("usage");
        if (usageReason.equals("private")) {
            newAccount.setRole(Account.Role.USER);
        } else if (usageReason.equals("commercial")) {
            newAccount.setRole(Account.Role.COMPANY);
            String companyName = (String) request.get("company");
            newAccount.setCompany(companyName);
        }

        accountService.saveAccount(newAccount);

        authResponse.setSuccess(true);

        Authentication authentication = new UsernamePasswordAuthenticationToken(newAccount, null,
                newAccount.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = JwtProvider.generateToken(authentication, newAccount.getId());

        authResponse.setMessage("Registration successful");
        authResponse.setJwt(token);
        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }

    @PostMapping(path = "user/password")
    public @ResponseBody ResponseEntity<String> UpdatePassword(@RequestBody String newPasswordInfo){
        JSONObject request = new JSONObject(newPasswordInfo);
        JSONObject response = new JSONObject();
        response.put("success", false);

        String token = request.getString("token");
        String newPassword = request.getString("password");

        //check if token is valid
        ResetPasswordToken userToken = resetPasswordService.getTokenByValue(token);
        if(userToken == null || userToken.getExpiration().isBefore(LocalDateTime.now())){
            response.put("reason", "invalid_token");
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        //get user from token
        Account user = accountService.getAccountWithPassword(userToken.getUserEmail());

        if(!setUpdatedPassword(user, newPassword)){
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        try{
            resetPasswordService.removeTokenIfExists(user.getEmail());
        } catch(Exception e){
            System.out.println("Removing consumed token after updating password threw exception : "+ e.getMessage());
        }

        response.put("success", true);
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @PostMapping(path = "user/changePassword")
    public @ResponseBody ResponseEntity<String> changePassword(@RequestBody String newPasswordInfo,
                                                               Authentication authentication) {
        JSONObject request = new JSONObject(newPasswordInfo);
        JSONObject response = new JSONObject();
        response.put("success", false);

        String oldPassword = request.getString("oldPassword");
        String newPassword = request.getString("newPassword");

        if(!authentication.isAuthenticated()){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String principalEmail = (String) authentication.getPrincipal();
        Account account = accountService.getAccount(principalEmail);

        if(!passwordEncoder.matches(oldPassword, account.getPassword())){
            response.put("reason", "password_invalid");
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        }

        boolean success = setUpdatedPassword(account, newPassword);

        response.put("success", success);
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    private boolean setUpdatedPassword(Account user, String newPassword){
        user.setPassword(passwordEncoder.encode(newPassword));

        try{
            accountService.saveAccount(user);
        } catch(Exception e){
            System.out.println("Changing PAssword threw Exception: "+e.getMessage());
            return false;
        }

        return true;
    }
}
