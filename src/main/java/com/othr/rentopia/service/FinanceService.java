package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Finance;

public interface FinanceService {
    public void saveFinance(Finance finance);
    public List<Finance> getFinancesByAccount(Long accountId);
}
