package com.othr.rentopia.controller;

import com.othr.rentopia.api.EmailService;
import com.othr.rentopia.config.AuthResponse;
import com.othr.rentopia.config.DotenvHelper;
import com.othr.rentopia.config.JwtProvider;
import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.model.ResetPasswordToken;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.api.GoogleOAuthService;
import com.othr.rentopia.service.ResetPasswordService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping(value = "login", produces = "application/json")
    public @ResponseBody ResponseEntity<AuthResponse> processLoginRequest(@RequestBody String loginRequest) {
        JSONObject request = new JSONObject(loginRequest);

        String email = (String) request.get("useremail");
        String password = (String) request.get("userpassword");

        Account userDetails = accountService.getAccountWithPassword(email);

        AuthResponse authResponse = new AuthResponse();
        if (userDetails == null || !passwordEncoder.matches(password, userDetails.getPassword())) {
            authResponse.setStatus(false);
            authResponse.setMessage("Invalid username or password");
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.UNAUTHORIZED);
        } else {
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = JwtProvider.generateToken(authentication, userDetails.getId());

            authResponse.setMessage("Login success");
            authResponse.setJwt(token);
            authResponse.setStatus(true);
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
        }
    }

    @PostMapping(value="loginOAuth", produces="application/json")
    public ResponseEntity<AuthResponse> loginSuccess(@RequestBody String loginRequest) {
        // login via Google OAuth
        JSONObject request = new JSONObject(loginRequest);

        String googleToken = (String) request.get("token");

        AuthResponse authResponse = new AuthResponse();
        String email;
        try {
            // verify token with google
            email = googleOAuthService.getEmail(googleToken);
            System.out.println("Google Authenticated: " + email);
        } catch (Exception e) {
            authResponse.setStatus(false);
            authResponse.setMessage("Invalid Login");
            System.out.println("Invalid token: " + e.getMessage());
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.UNAUTHORIZED);
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
            Authentication authentication = new UsernamePasswordAuthenticationToken(account, null,
                    account.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = JwtProvider.generateToken(authentication, account.getId());

            authResponse.setMessage("Login success");
            authResponse.setJwt(token);
            authResponse.setStatus(true);

            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
        } else {
            // Account exists but wasn't created using Google Login -> ERROR
            authResponse.setStatus(false);
            authResponse.setMessage("Account wasn't created using Google");
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping(path="user/me", produces="application/json")
    public @ResponseBody ResponseEntity<Account> GetAuthUser(Authentication authentication){
        String email = (String) authentication.getPrincipal();

        Account account = accountService.getAccount(email);
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
        EmailService.Email mail = new EmailService.Email(DotenvHelper.get("GoogleEmail"), user.getEmail(), subject, body);
        mail.loadTemplate(subject, body);

        emailService.sendEmail(mail);

        response.put("success", true);
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @PostMapping(path = "register", produces = "application/json")
    public @ResponseBody ResponseEntity<AuthResponse> RegisterUser(@RequestBody String userInfo) {
        JSONObject request = new JSONObject(userInfo);
        AuthResponse authResponse = new AuthResponse();

        String email = (String) request.get("email");
        if (accountService.emailExists(email)) {
            authResponse.setStatus(false);
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

        authResponse.setStatus(true);

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
