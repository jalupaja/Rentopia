package com.othr.rentopia.controller;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Finance;
import com.othr.rentopia.service.FinanceService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/finance")
@CrossOrigin
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    @GetMapping("/add")
    public ResponseEntity<String> addFinance(Authentication authentication, @RequestBody String finance) {
        if (authentication == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        JSONObject request = new JSONObject(finance);
        JSONObject response = new JSONObject();

        try {
            Finance newFinance = new Finance();
            newFinance.setDeviceId(Long.valueOf((Integer) request.get("DeviceId")));
            newFinance.setAmount(request.getDouble("amount"));
            newFinance.setAccountId(Long.valueOf((Integer) request.get("AccountId")));
            newFinance.setEndDate(LocalDateTime.parse((String) request.get("endDate")));
            newFinance.setStartDate(LocalDateTime.parse((String) request.get("startDate")));
            newFinance.setProcessed(true);

            financeService.saveFinance(newFinance);

            response.put("Finance added successfully", true);
            return new ResponseEntity<>(response.toString(), HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("Error parsing values for finance creation: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}