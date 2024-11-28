package com.othr.rentopia.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.othr.rentopia.config.AuthResponse;
import com.othr.rentopia.config.JwtProvider;
import com.othr.rentopia.model.Account;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.AccountServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController {
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private AccountServiceImpl customUserDetails;

    @Autowired
    private AccountService userService;

    @PostMapping(value="api/login", produces="application/json")
    public @ResponseBody ResponseEntity<AuthResponse> processLoginRequest(@RequestBody String loginRequest) {
        //todo get email from request body

        // todo remove
        String username = "user";
        String password = "user";

        UserDetails userDetails;// = customUserDetails.getAccount(email);

        //todo only for testing
        Account account = new Account();
        account.setEmail("user");
        account.setPassword(passwordEncoder.encode("user"));
        account.setId(12L);
        account.setName("huan");

        userDetails = account;

        if(userDetails == null) {
            throw new BadCredentialsException("Invalid username and password");
        }

        if(!passwordEncoder.matches(password,userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();

        authResponse.setMessage("Login success");
        authResponse.setJwt(token);
        authResponse.setStatus(true);
        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }

    @GetMapping(path="api/user/me", produces="application/json")
    public @ResponseBody ResponseEntity<Account> GetAuthUser(Authentication authentication){
        String username = (String) authentication.getPrincipal();

        //todo only for testing
        Account account = new Account();//customUserDetails.getAccountByUsername(username);
        account.setName("Christian");
        account.setId(1312L);

        return new ResponseEntity<>( account, HttpStatus.OK);
    }
}
