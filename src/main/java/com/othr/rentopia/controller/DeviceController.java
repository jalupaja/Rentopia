package com.othr.rentopia.controller;

// import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.DeviceImage;
// import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceService;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.persistence.PersistenceException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/device")
@CrossOrigin
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private DeviceImageService deviceImageService;

    // save to Frontend...
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/Frontend/public/images/";
    private static final String DEVICE_IMAGE_UPLOAD_DIR = UPLOAD_DIR + "devices/";

    @GetMapping("{id}")
    public ResponseEntity<Map<String, Object>> getDevice(@PathVariable("id") Long id) {
        // TODO check NULL, if (! device.hidden || device.owner == logged_in_acc)
        Device device = deviceService.getDevice(id);

        Map<String, Object> deviceData = new HashMap<>();
        // deviceData.put("id", device.id);
        deviceData.put("title", device.getTitle());
        deviceData.put("description", device.getDescription());
        deviceData.put("price", device.getPrice());
        deviceData.put("categories", device.getCategories());
        deviceData.put("owner", accountService.getAccountName(device.getOwnerId()));
        deviceData.put("location", device.getLocation());
        deviceData.put("isPublic", device.getIsPublic());

        return new ResponseEntity<>(deviceData, HttpStatus.OK);
    }

    @GetMapping("/short/{id}")
    public ResponseEntity<Map<String, Object>> getDeviceShort(@PathVariable("id") Long id) {
        // TODO check NULL, if (! device.hidden || device.owner == logged_in_acc)
        Device device = deviceService.getDevice(id);
        Map<String, Object> deviceData = new HashMap<>();
        // deviceData.put("id", device.id);
        deviceData.put("title", device.getTitle());
        deviceData.put("price", device.getPrice());
        deviceData.put("categories", device.getCategories());
        deviceData.put("owner", accountService.getAccountName(device.getOwnerId()));
        deviceData.put("price", device.getPrice());
        deviceData.put("location", device.getLocation());

        return new ResponseEntity<>(deviceData, HttpStatus.OK);
    }

    @GetMapping("{id}/images")
    public ResponseEntity<List<String>> getDeviceImages(@PathVariable("id") Long deviceId) {
        // TODO check if (! device.hidden || device.owner == logged_in_acc)
        List<String> deviceImages = deviceImageService.getAllDeviceImages(deviceId);
        System.out.println("deviceId: " + deviceId);
        System.out.println("deviceImages: " + deviceImages);

        return new ResponseEntity<>(deviceImages, HttpStatus.OK);
    }
}
