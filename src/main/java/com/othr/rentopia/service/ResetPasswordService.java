package com.othr.rentopia.service;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.ResetPasswordToken;
import org.springframework.stereotype.Service;

@Service
public interface ResetPasswordService {
    void saveToken(ResetPasswordToken token);
    ResetPasswordToken getToken(Account user);
    void removeTokenIfExists(String userMail);
}
