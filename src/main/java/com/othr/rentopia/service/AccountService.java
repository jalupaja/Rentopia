package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Location;

public interface AccountService {
    public void saveAccount(Account account);

    public Account getAccount(String email);

    public Account getAccountWithPassword(String email);

    public String getAccountName(Long accountId);

    public Location getLocation(Long accountId);

    public String getEmail(Long accountId);

    public Long getId(String email);

    public boolean isAdmin(Long accountId);

    public boolean emailExists(String email);

    public void removeAccount(Long accountId);
    public Account getAccountById(Long userId);
}
