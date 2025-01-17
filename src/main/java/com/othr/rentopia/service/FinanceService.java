package com.othr.rentopia.service;

import java.util.List;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Finance;

public interface FinanceService {
    public void saveFinance(Finance finance);
    public List<Finance> getFinancesByAccount(Long accountId);
    public List<Device> getRentHistory(Long accountId);
    public List<Finance> getBookedDates(Long deviceId);
}
