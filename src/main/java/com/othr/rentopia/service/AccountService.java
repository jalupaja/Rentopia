package com.othr.rentopia.service;

import com.othr.rentopia.model.Account;

import java.util.List;

public interface AccountService {
    public void saveAccount(Account account);
    public Account getAccount(String email);
    public boolean checkPassword(String email, String password);
}
