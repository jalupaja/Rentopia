package com.othr.rentopia.controller;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.DeviceImage;
import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.model.Account;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceService;
import com.othr.rentopia.service.BookmarkService;
import com.othr.rentopia.service.RatingService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;

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
    private BookmarkService bookmarkService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private DeviceImageService deviceImageService;

    // save to Frontend...
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/Frontend/public/images/";
    private static final String DEVICE_IMAGE_UPLOAD_DIR = UPLOAD_DIR + "devices/";

    private Boolean checkDeviceAccess_R(Authentication authentication, Device device) {
        if (device == null)
            return false;

        // if device is hidden and if current logged in person is not its owner
        if (device.getIsPublic())
            return true;

        if (authentication != null) {
            String principalEmail = (String) authentication.getPrincipal();
            Long principalId = accountService.getId(principalEmail);
            if (device.getOwnerId() == principalId || accountService.isAdmin(principalId))
                return true;
        }
        return false;
    }

    private Boolean checkDeviceAccess_W(Authentication authentication, Long deviceId) {
        if (authentication == null)
            return false;

        Long device_ownerId = deviceService.getDeviceOwnerId(deviceId);
        String principalEmail = (String) authentication.getPrincipal();
        Long principalId = accountService.getId(principalEmail);

        // if device does not exist or if current logged in person is not its owner
        if (device_ownerId == null || device_ownerId != principalId || !accountService.isAdmin(principalId))
            return false;

        return true;
    }

    private Long getCurrentId(Authentication authentication) {
        Long id = -1L; // invalid id

        if (authentication != null) {
            String principalEmail = (String) authentication.getPrincipal();
            id = accountService.getId(principalEmail);
        }
        return id;
    }

    private Map<String, Object> parseDeviceShort(Device device, Long currentId) {
        Map<String, Object> deviceData = new HashMap<>();

        deviceData.put("id", device.getId());
        deviceData.put("title", device.getTitle());
        deviceData.put("price", device.getPrice());
        deviceData.put("categories", device.getCategories());
        deviceData.put("owner", accountService.getAccountName(device.getOwnerId()));
        deviceData.put("price", device.getPrice());
        deviceData.put("location", device.getLocation());
        deviceData.put("image", deviceImageService.getFirstDeviceImage(device.getId()));
        // TODO current user ID!!!
        deviceData.put("isBookmarked", bookmarkService.checkBookmark(currentId, device.getId()));

        return deviceData;
    }

    private Map<String, Object> parseDevice(Device device, Long currentId) {
        Map<String, Object> deviceData = parseDeviceShort(device, currentId);
        deviceData.remove("image");

        List<Integer> ratings = ratingService.getRatings(device.getId());
        int amountRatings = ratings.size();
        double rating = 0;

        // calculate mean(ratings)
        if (amountRatings > 0) {
            for (int num : ratings) {
                rating += num;
            }
            rating = rating / amountRatings;
        }

        deviceData.put("description", device.getDescription());
        deviceData.put("isPublic", device.getIsPublic());
        deviceData.put("images", deviceImageService.getAllDeviceImages(device.getId()));
        deviceData.put("rating", rating);
        deviceData.put("amountRatings", amountRatings);

        return deviceData;
    }

    @GetMapping("{id}")
    public ResponseEntity<Map<String, Object>> getDevice(Authentication authentication, @PathVariable("id") Long id) {
        Device device = deviceService.getDevice(id);

        if (checkDeviceAccess_R(authentication, device)) {
            return new ResponseEntity<>(parseDevice(device, getCurrentId(authentication)), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/short/{id}")
    public ResponseEntity<Map<String, Object>> getDeviceShort(Authentication authentication,
            @PathVariable("id") Long id) {
        Device device = deviceService.getDevice(id);

        if (checkDeviceAccess_R(authentication, device)) {
            return new ResponseEntity<>(parseDeviceShort(device, getCurrentId(authentication)), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/short/all")
    public ResponseEntity<List<Map<String, Object>>> getDevice(Authentication authentication) {
        List<Map<String, Object>> deviceData = new ArrayList<>();

        List<Device> devices = deviceService.getAllDevices();
        for (Device device : devices) {
            if (checkDeviceAccess_R(authentication, device)) {
                deviceData.add(parseDeviceShort(device, getCurrentId(authentication)));
            }
        }

        return new ResponseEntity<>(deviceData, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDevice(Authentication authentication, @RequestBody Map<String, Object> data) {
        // TODO untested
        if (authentication == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        try {
            String title = (String) data.get("title");
            String description = (String) data.get("description");
            Double price = (Double) data.get("price");
            boolean isPublic = (boolean) data.get("isPublic");
            // TODO add categories

            String email = (String) authentication.getPrincipal();
            Long ownerId = accountService.getId(email);

            Device device = new Device();
            device.setTitle(title);
            device.setDescription(description);
            device.setPrice(price);
            device.setOwnerId(ownerId);
            device.setLocation(accountService.getLocation(ownerId));
            device.setIsPublic(isPublic);
            deviceService.saveDevice(device);

            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error parsing values for device creation: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/remove/{id}")
    public ResponseEntity<String> removeDevice(Authentication authentication, @PathVariable("id") Long id) {
        if (!checkDeviceAccess_W(authentication, id))
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        if (deviceService.removeDevice(id)) {
            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            System.out.println("Failed removing Device " + id);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bookmarks/all")
    public ResponseEntity<List<Map<String, Object>>> getBookmarks(Authentication authentication) {

        if (authentication == null) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        List<Map<String, Object>> deviceData = new ArrayList<>();
        String email = (String) authentication.getPrincipal();
        Long ownerId = accountService.getId(email);

        List<Device> devices = bookmarkService.getBookmarkedDevices(ownerId);
        for (Device device : devices) {
            deviceData.add(parseDeviceShort(device, getCurrentId(authentication)));
        }

        return new ResponseEntity<>(deviceData, HttpStatus.OK);
    }

    @PostMapping("/bookmarks/remove/{deviceId}")
    public ResponseEntity<String> removeBookmark(Authentication authentication,
            @PathVariable("deviceId") Long deviceId) {
        if (authentication == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        String email = (String) authentication.getPrincipal();
        Long ownerId = accountService.getId(email);

        if (bookmarkService.removeBookmark(ownerId, deviceId)) {
            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            System.out.println("Failed removing Bookmark from " + ownerId + " for " + deviceId);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/bookmarks/add/{deviceId}")
    public ResponseEntity<String> addBookmark(Authentication authentication, @PathVariable("deviceId") Long deviceId) {
        if (authentication == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        String email = (String) authentication.getPrincipal();
        Long ownerId = accountService.getId(email);

        Bookmark bookmark = new Bookmark();
        bookmark.setOwnerId(ownerId);
        bookmark.setDeviceId(deviceId);

        bookmarkService.saveBookmark(bookmark);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("{id}/image")
    public ResponseEntity<String> uploadImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @PathVariable("id") Long deviceId) {

        if (!checkDeviceAccess_W(authentication, deviceId))
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        if (file.isEmpty())
            return new ResponseEntity<>("No file uploaded.", HttpStatus.BAD_REQUEST);

        String fileName;
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : "";

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
