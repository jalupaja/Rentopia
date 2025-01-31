package com.othr.rentopia.controller;

// import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.*;
// import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.*;
import org.json.JSONObject;
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
import com.othr.rentopia.api.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

import java.util.*;
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

    @Autowired
    private FinanceService financeService;

    @Autowired
    private EmailService emailService;

    // save to Frontend...
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/Frontend/public/images/";
    private static final String DEVICE_IMAGE_UPLOAD_DIR = UPLOAD_DIR + "devices/";

    private Boolean checkAllowed(Device device) {
	// TODO check NULL, if (! device.getHidden || device.owner == logged_in_acc)
	return device != null;
    }

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
        //TODO: If smth doesnt work remove !account.... and Test again pls
        if (device_ownerId == null || (device_ownerId != principalId && !accountService.isAdmin(principalId))) 
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

    @GetMapping("/short/search")
    public ResponseEntity<List<Map<String, Object>>> getDeviceShortSorted(
            Authentication authentication, @RequestParam Map<String, String> filterOptions) {

        List<Device> devices = deviceService.getDevicesSorted(filterOptions);
        List<Map<String, Object>> deviceData = new ArrayList<>();

        for (Device device : devices) {
            if (checkDeviceAccess_R(authentication, device)) {
                deviceData.add(parseDeviceShort(device, getCurrentId(authentication)));
            }
        }

        return new ResponseEntity<>(deviceData, HttpStatus.OK);
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
	public ResponseEntity<List<Map<String, Object>>> addDevice(Authentication authentication, @RequestBody String device) {
        if (authentication == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

		JSONObject request = new JSONObject(device);
		JSONObject response = new JSONObject();

        try {
            String email = (String) authentication.getPrincipal();
            Long ownerId = accountService.getId(email);

			Device newDevice = new Device();
			newDevice.setTitle((String) request.get("title"));
			newDevice.setDescription((String) request.get("description"));
			newDevice.setPrice(priceToDouble(request.get("price")));
			newDevice.setIsPublic((Boolean) request.get("isPublic"));
			newDevice.setOwnerId(ownerId);
			newDevice.setLocation(accountService.getLocation(ownerId));
			//TODO: add Category

	    	deviceService.saveDevice(newDevice);

	    	response.put("Device added successfully", true);
	    	return getYourDevices(Long.valueOf((Integer) request.get("ownerId")));

        } catch (Exception e) {
            System.out.println("Error parsing values for device creation: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/remove/{id}")
	public ResponseEntity<List<Map<String, Object>>> removeDevice(Authentication authentication, @PathVariable("id") Long id) {
        if (!checkDeviceAccess_W(authentication, id))
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

	    Device device = deviceService.getDevice(id);

        try {
            List<String> deviceImages = deviceImageService.getAllDeviceImages(id);
            for(String deviceImage : deviceImages) {
                File imageFile = new File(DEVICE_IMAGE_UPLOAD_DIR + deviceImage);
                if(!imageFile.delete()) {
                    System.out.println("Error deleting File: " + imageFile);
                }
            }

            deviceImageService.removeAllDeviceImages(id);

        } catch (Exception e) {
            System.out.println("Error parsing values for device deletion: " + e.getMessage());
        }

        if (deviceService.removeDevice(id)) {
            return getYourDevices(device.getOwnerId());
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

	
	@GetMapping("/all/{ownerId}")
	public ResponseEntity<List<Map<String, Object>>> getYourDevices(@PathVariable("ownerId") Long ownerId) {
		List<Map<String, Object>> deviceData = new ArrayList<>();
		List<Device> devices = deviceService.getDevicesByOwner(ownerId);

		for (Device device : devices) {
			if (checkAllowed(device)) {
				deviceData.add(parseDevice(device, ownerId));
			}
		}

		return new ResponseEntity<>(deviceData, HttpStatus.OK);
	}

	@GetMapping("/bookmarks/all/{ownerId}")
	public ResponseEntity<List<Map<String, Object>>> getBookmarks(@PathVariable("ownerId") Long ownerId) {
		// TODO maybe move to AccountService. but need parseDeviceShort...
		List<Map<String, Object>> deviceData = new ArrayList<>();

		List<Device> devices = bookmarkService.getBookmarkedDevices(ownerId);
		for (Device device : devices) {
			if (checkAllowed(device)) {
				deviceData.add(parseDeviceShort(device, ownerId));
			}
		}

		return new ResponseEntity<>(deviceData, HttpStatus.OK);
	}

    @GetMapping("/rentHistory/all/{ownerId}")
	public ResponseEntity<List<Map<String, Object>>> getRentHistory(@PathVariable("ownerId") Long ownerId) {
		List<Map<String, Object>> deviceData = new ArrayList<>();

		List<Device> devices = financeService.getRentHistory(ownerId);
		for (Device device : devices) {
			if (checkAllowed(device)) {
				deviceData.add(parseDevice(device, ownerId));
			}
		}

		return new ResponseEntity<>(deviceData, HttpStatus.OK);
	}

    @PostMapping("/bookmarks/remove/{deviceId}")
	public ResponseEntity<List<Map<String, Object>>> removeBookmark(Authentication authentication,
            @PathVariable("deviceId") Long deviceId) {
        if (authentication == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

	List<Map<String, Object>> deviceData = new ArrayList<>();
        String email = (String) authentication.getPrincipal();
        Long ownerId = accountService.getId(email);

		if (bookmarkService.removeBookmark(ownerId, deviceId)) {
			List<Device> devices = bookmarkService.getBookmarkedDevices(ownerId);
			for (Device device : devices) {
				if (checkAllowed(device)) {
					deviceData.add(parseDeviceShort(device, ownerId));
				}
			}

			return new ResponseEntity<>(deviceData, HttpStatus.OK);
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

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadImage(
            Authentication authentication,
            @RequestParam("files") List<MultipartFile> files,
            @PathVariable("id") Long deviceId) {

        if (!checkDeviceAccess_W(authentication, deviceId))
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);

        if (files.isEmpty())
            return new ResponseEntity<>("No file uploaded.", HttpStatus.BAD_REQUEST);

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
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    return new ResponseEntity<>("One or more files are empty.", HttpStatus.BAD_REQUEST);
                }

                String originalFileName = file.getOriginalFilename();
                String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf("."))
                        : "";

                // Check for allowed file extensions
                String lowerExtension = fileExtension.toLowerCase();
                if (!(lowerExtension.equals(".png") || lowerExtension.equals(".jpg") || lowerExtension.equals(".jpeg"))) {
                    return ResponseEntity.status(500).body("Invalid file extension. Only PNG, JPG, JPEG are allowed.");
                }

                // Generate a random file name using UUID and retain the original file extension
                String fileName = "";
                while (true) {
                    try {

                        fileName = UUID.randomUUID().toString() + fileExtension;

                        DeviceImage deviceImage = new DeviceImage();
                        deviceImage.setName(fileName);
                        deviceImage.setDeviceId(deviceId);
                        deviceImageService.saveDeviceImage(deviceImage);
                    } catch (PersistenceException e) {
                        // If a random UUID already exists, retry
                        continue;
                    }

                    break;
                }

                File destinationFile = new File(DEVICE_IMAGE_UPLOAD_DIR + fileName);
                file.transferTo(destinationFile);  // Save the file to disk
            }

            return ResponseEntity.ok("Files uploaded successfully.");
        } catch (IOException e) {
            System.out.println("Error while uploading file: " + e.getMessage());
            return ResponseEntity.status(500).body("Error while uploading file.");
        }
	}

    @DeleteMapping("/delete/image")
    public ResponseEntity<String> deleteImagesByFilenames(
            Authentication authentication,
            @RequestBody List<String> filenames) {

        if (filenames == null || filenames.isEmpty()) {
            return new ResponseEntity<>("No filenames provided.", HttpStatus.BAD_REQUEST);
        }

        try {
            for (String filename : filenames) {

                Long deviceId = deviceImageService.getDeviceId(filename);

                if (!checkDeviceAccess_W(authentication, deviceId)) {
                    return new ResponseEntity<>("Access denied to delete image: " + filename, HttpStatus.FORBIDDEN);
                }

                File imageFile = new File(DEVICE_IMAGE_UPLOAD_DIR + filename);
                if (imageFile.exists() && !imageFile.delete()) {
                    return new ResponseEntity<>("Failed to delete file: " + filename, HttpStatus.INTERNAL_SERVER_ERROR);
                }

                deviceImageService.removeDeviceImage(filename);
            }

            return ResponseEntity.ok("Images deleted successfully.");
        } catch (Exception e) {
            System.out.println("Error while deleting images: " + e.getMessage());
            return ResponseEntity.status(500).body("Error while deleting images.");
        }
    }

	@PostMapping(path="update", produces = "application/json")
	public ResponseEntity<List<Map<String, Object>>> updateDevice(@RequestBody String device) {
		JSONObject request = new JSONObject(device);

		if(device != null) {
			Device updDevcie = new Device();
			updDevcie.setTitle((String) request.get("title"));
			updDevcie.setDescription((String) request.get("description"));
			updDevcie.setPrice(priceToDouble(request.get("price")));
			updDevcie.setOwnerId(Long.valueOf((Integer) request.get("ownerId")));
			updDevcie.setId(Long.valueOf((Integer) request.get("id")));
			updDevcie.setIsPublic((Boolean) request.get("isPublic"));
			//TODO: add Category

			JSONObject locationJSON = (JSONObject) request.get("location");

			Location location = new Location();
			location.setPostalCode((String) locationJSON.get("postalCode"));
			location.setCity((String) locationJSON.get("city"));
			location.setStreet((String) locationJSON.get("street"));
			location.setCountry((String) locationJSON.get("country"));
			updDevcie.setLocation(location);
			updDevcie = deviceService.updateDevice(updDevcie);

            // Send mails to all users who bookmarked this device
            List<Bookmark> bookmarks = bookmarkService.getUserBookmarksByDevice(Long.valueOf((Integer) request.get("id")));

            Device tmp_device;
            Account user;
            for (Bookmark b : bookmarks) {
                tmp_device = deviceService.getDevice(b.getDeviceId());
                user = accountService.getAccount(b.getOwnerId());

                String subject = "🚀 Your Bookmarked Device Just Got Better! Check Out the Latest Update!";
                String body = "<h1>Good news, " + user.getName() + "!</h1>\n"
                    + "<p>One of your bookmarked devices has just been updated! 🎉</p>\n"
                    + "<p><strong>Device:</strong> " + tmp_device.getTitle() + "</p>\n"
                    + "<p>We think you'll love these new improvements! Click the button below to see all the details and make the most of the update.</p>\n"
                    + "<a href=\"http://localhost:3000/device/" + tmp_device.getId() + "\" class=\"button\">View Update</a>\n";

                EmailService.Email mail = new EmailService.Email(null, user.getEmail(), null, null);
                mail.loadTemplate(subject, body);

                emailService.sendEmail(mail);
            }

			return getYourDevices(Long.valueOf((Integer) request.get("ownerId")));
		}

		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}

    @GetMapping(path = "/bookedDates/{deviceId}")
    public ResponseEntity<List<Map<String, Object>>> getBookedDates(@PathVariable("deviceId") Long deviceId) {
        List<Map<String, Object>> bookedDates = new ArrayList<>();

        List<Finance> finances = financeService.getBookedDates(deviceId);
        for (Finance finance : finances) {
            if(finance.getStartDate() != null && finance.getEndDate() != null) {
                Map<String, Object> dateMap = new HashMap<>();
                dateMap.put("startDate", finance.getStartDate());
                dateMap.put("endDate", finance.getEndDate());
                dateMap.put("key", "selection");
                bookedDates.add(dateMap);
            }
        }

        return new ResponseEntity<>(bookedDates, HttpStatus.OK);
    }

	private double priceToDouble(Object priceObj) {

		if (priceObj instanceof String) {
			return(Double.parseDouble((String) priceObj));
		}
		else if (priceObj instanceof Integer || priceObj instanceof Long) {
			return((Number) priceObj).doubleValue();
		}
		else if (priceObj instanceof Float) {
			return((Float) priceObj).doubleValue();
		}
		else {
			return((Double) priceObj);
        }
    }
}
