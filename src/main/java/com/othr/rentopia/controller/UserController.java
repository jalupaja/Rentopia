package com.othr.rentopia.controller;

import com.othr.rentopia.config.AuthResponse;
import com.othr.rentopia.config.JwtProvider;
import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.AccountServiceImpl;
import com.othr.rentopia.api.GoogleOAuthService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("api")
public class UserController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GoogleOAuthService googleOAuthService;

    @Autowired
    private AccountService accountService;

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
        } else {
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = JwtProvider.generateToken(authentication, userDetails.getId());

            authResponse.setMessage("Login success");
            authResponse.setJwt(token);
            authResponse.setStatus(true);
        }

        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
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
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.BAD_REQUEST);
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
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(path="user/me", produces="application/json")
    public @ResponseBody ResponseEntity<Account> GetAuthUser(Authentication authentication){
        String email = (String) authentication.getPrincipal();

        Account account = accountService.getAccount(email);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @PostMapping(path = "resetPasswordMail", produces = "application/json")
    public @ResponseBody boolean SendResetPasswordMail(@RequestBody String userMail) {
        // todo:

        return true;
    }

    @PostMapping(path = "register", produces = "application/json")
    public @ResponseBody String RegisterUser(@RequestBody String userInfo) {
        JSONObject request = new JSONObject(userInfo);
        JSONObject response = new JSONObject();

        String email = (String) request.get("email");
        if (accountService.emailExists(email)) {
            response.put("registrationSuccess", false);
            response.put("reason", "There is already an account for this email");
            return response.toString();
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

        response.put("registrationSuccess", true);
        return response.toString();
    }
}
