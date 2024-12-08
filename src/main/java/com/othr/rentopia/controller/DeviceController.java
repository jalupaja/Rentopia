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
import java.util.ArrayList;
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

    private Boolean checkAllowed(Device device) {
        // TODO check NULL, if (! device.getHidden || device.owner == logged_in_acc)
        return device != null;
    }

    private Map<String, Object> parseDeviceShort(Device device) {
        Map<String, Object> deviceData = new HashMap<>();

        deviceData.put("id", device.getId());
        deviceData.put("title", device.getTitle());
        deviceData.put("price", device.getPrice());
        deviceData.put("categories", device.getCategories());
        deviceData.put("owner", accountService.getAccountName(device.getOwnerId()));
        deviceData.put("price", device.getPrice());
        deviceData.put("location", device.getLocation());
        deviceData.put("image", deviceImageService.getFirstDeviceImage(device.getId()));

        return deviceData;
    }

    private Map<String, Object> parseDevice(Device device) {
        Map<String, Object> deviceData = new HashMap<>();

        deviceData.put("id", device.getId());
        deviceData.put("title", device.getTitle());
        deviceData.put("description", device.getDescription());
        deviceData.put("price", device.getPrice());
        deviceData.put("categories", device.getCategories());
        deviceData.put("owner", accountService.getAccountName(device.getOwnerId()));
        deviceData.put("location", device.getLocation());
        deviceData.put("isPublic", device.getIsPublic());
        deviceData.put("images", deviceImageService.getAllDeviceImages(device.getId()));

        return deviceData;
    }

    @GetMapping("{id}")
    public ResponseEntity<Map<String, Object>> getDevice(@PathVariable("id") Long id) {
        Device device = deviceService.getDevice(id);

        if (checkAllowed(device)) {
            return new ResponseEntity<>(parseDevice(device), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/short/{id}")
    public ResponseEntity<Map<String, Object>> getDeviceShort(@PathVariable("id") Long id) {
        Device device = deviceService.getDevice(id);

        if (checkAllowed(device)) {
            return new ResponseEntity<>(parseDeviceShort(device), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("short/all")
    public ResponseEntity<List<Map<String, Object>>> getDevice() {
        List<Map<String, Object>> deviceData = new ArrayList<>();

        List<Device> devices = deviceService.getAllDevices();
        for (Device device : devices) {
            if (checkAllowed(device)) {
                deviceData.add(parseDeviceShort(device));
            }
        }

        return new ResponseEntity<>(deviceData, HttpStatus.OK);
    }

    @PostMapping("{id}/image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @PathVariable("id") Long deviceId) {
        // TODO check if user is owner of device -> allowed to upload images, also if device exists...

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded.");
        }

        String fileName;
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";

        // check for allowed file extensions
        String lowerExtension = fileExtension.toLowerCase();
        if (!(lowerExtension.equals(".png") || lowerExtension.equals(".jpg") || lowerExtension.equals(".jpeg"))) {
            return ResponseEntity.status(500).body("Error while uploading file!\nInvalid file extension");
        }

        // check if dir exists
        File directory = new File(DEVICE_IMAGE_UPLOAD_DIR);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (created) {
                System.out.println("device image directory created");
            } else {
                System.out.println("Failed to create device image directory");
                return ResponseEntity.status(500).body("Error while uploading file!");
            }
        }

        try {
            while (true) {

                // Generate a random file name using UUID and keep the original file extension
                fileName = UUID.randomUUID().toString() + fileExtension;

                try {
                    DeviceImage deviceImage = new DeviceImage();
                    deviceImage.setName(fileName);
                    deviceImage.setDeviceId(deviceId);

                    deviceImageService.saveDeviceImage(deviceImage);
                } catch (PersistenceException e) {
                    // "random" UUID already exists
                    continue;
                }

                // file saved
                break;
            }

            File destinationFile = new File(DEVICE_IMAGE_UPLOAD_DIR + fileName);

            file.transferTo(destinationFile);

            return ResponseEntity.ok("File uploaded successfully.");
        } catch (IOException e) {
            System.out.println("Error while uploading file!" + e.getMessage());
            return ResponseEntity.status(500).body("Error while uploading file!");
        }
    }
}
