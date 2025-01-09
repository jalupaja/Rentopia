package com.othr.rentopia.controller;

import com.othr.rentopia.config.AuthResponse;
import com.othr.rentopia.config.JwtProvider;
import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.AccountServiceImpl;
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
    private AccountServiceImpl customUserDetails;

    @Autowired
    private AccountService userService;

    @PostMapping(value="login", produces="application/json")
    public @ResponseBody ResponseEntity<AuthResponse> processLoginRequest(@RequestBody String loginRequest) {
        JSONObject request = new JSONObject(loginRequest);

        String email = (String) request.get("useremail");
        String password = (String) request.get("userpassword");

        Account userDetails = customUserDetails.getAccount(email);

        AuthResponse authResponse = new AuthResponse();
        if(userDetails == null) {
            authResponse.setStatus(false);
            authResponse.setMessage("Invalid username and password");
        }
        else if(!passwordEncoder.matches(password,userDetails.getPassword())) {
            authResponse.setStatus(false);
            authResponse.setMessage("Invalid password");
        }
        else{
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = JwtProvider.generateToken(authentication, userDetails.getId());

            authResponse.setMessage("Login success");
            authResponse.setJwt(token);
            authResponse.setStatus(true);
        }

        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }

    @GetMapping(path="user/me", produces="application/json")
    public @ResponseBody ResponseEntity<Account> GetAuthUser(Authentication authentication){
        String username = (String) authentication.getPrincipal();

        Account account = customUserDetails.loadUserByUsername(username);
        account.removeNonPublicProperties();
        return new ResponseEntity<>( account, HttpStatus.OK);
    }

    @PostMapping(path="resetPasswordMail",  produces="application/json")
    public @ResponseBody boolean SendResetPasswordMail(@RequestBody String userMail){
        //todo:

        return true;
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

    @PostMapping(path="register", produces="application/json")
    public @ResponseBody String RegisterUser(@RequestBody String userInfo){
        JSONObject request = new JSONObject(userInfo);
        JSONObject response = new JSONObject();

        String email = (String) request.get("email");
        Account account = customUserDetails.getAccount(email);
        if(account != null){
            response.put("registrationSuccess",false);
            response.put("reason","There is already an account for this email");
            return response.toString();
        }

        Account newAccount = new Account();
        newAccount.setEmail((String) request.get("email"));
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
        if(usageReason.equals("private")){
            newAccount.setRole(Account.Role.USER);
        }
        else if(usageReason.equals("commercial")){
            newAccount.setRole(Account.Role.COMPANY);
            String companyName = (String) request.get("company");
            newAccount.setCompany(companyName);
        }

        customUserDetails.saveAccount(newAccount);

        response.put("registrationSuccess",true);
        return response.toString();
    }
}
