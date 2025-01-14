package com.othr.rentopia.service;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.TwoFAToken;
import org.springframework.stereotype.Service;

@Service
public interface TwoFATokenService {
    TwoFAToken createToken(Account user);
    TwoFAToken getTokenByValue(String tokenValue);
    void removeTokenById(Long tokenId);
}
