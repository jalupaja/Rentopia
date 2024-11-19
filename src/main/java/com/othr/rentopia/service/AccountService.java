package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Account;

public interface AccountService {
    public void saveAccount(Account account);
    public Account getAccount(String email);
    public boolean checkPassword(String email, String password);
    public void removeAccount(Long accountId);
}
