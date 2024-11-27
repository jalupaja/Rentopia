package com.othr.rentopia.controller;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/home")
@CrossOrigin
public class HomeController {

    @Autowired
    private DeviceService deviceService;

    @GetMapping("/home")
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }
}
