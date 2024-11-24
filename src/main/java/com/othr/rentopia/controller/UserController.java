package com.othr.rentopia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {

    @PostMapping("/login")
    @ResponseBody
    public String processLoginRequest(@RequestBody String loginData) {
        // todo
        System.out.println(loginData);
        return "yes";
    }
}
