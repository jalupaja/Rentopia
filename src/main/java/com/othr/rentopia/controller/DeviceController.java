package com.othr.rentopia.controller;

// import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.DeviceImage;
import com.othr.rentopia.model.Bookmark;
// import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.service.*;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private FinanceService financeService;

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
		deviceData.put("isBookmarked", bookmarkService.checkBookmark(device.getOwnerId(), device.getId()));

		return deviceData;
	}

	private Map<String, Object> parseDevice(Device device) {
		Map<String, Object> deviceData = new HashMap<>();

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

		deviceData.put("id", device.getId());
		deviceData.put("title", device.getTitle());
		deviceData.put("description", device.getDescription());
		deviceData.put("price", device.getPrice());
		deviceData.put("categories", device.getCategories());
		deviceData.put("owner", accountService.getAccountName(device.getOwnerId()));
		deviceData.put("location", device.getLocation());
		deviceData.put("isPublic", device.getIsPublic());
		deviceData.put("images", deviceImageService.getAllDeviceImages(device.getId()));
		deviceData.put("isBookmarked", bookmarkService.checkBookmark(device.getOwnerId(), device.getId()));
		deviceData.put("rating", rating);
		deviceData.put("amountRatings", amountRatings);

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

	@GetMapping("/short/all")
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

	@PostMapping("/add")
	public @ResponseBody String addDevice(@RequestBody String deviceInfo) {
		JSONObject request = new JSONObject(deviceInfo);
		JSONObject response = new JSONObject();

		Device newDevice = new Device();
		newDevice.setTitle((String) request.get("title"));
		newDevice.setDescription((String) request.get("description"));
		newDevice.setPrice((Double) request.get("price"));
		newDevice.setOwnerId((Long) request.get("ownerId"));
		//newDevice.setCategories((String) request.get("categorie"));
		newDevice.setIsPublic((Boolean) request.get("public"));

		Location newLocation = new Location();
		newLocation.setCity((String) request.get("city"));
		newLocation.setPostalCode((String) request.get("postalCode"));
		newLocation.setStreet((String) request.get("street"));
		newLocation.setCountry((String) request.get("country"));
		newDevice.setLocation(newLocation);

		deviceService.saveDevice(newDevice);

		response.put("Device added successfully", true);
		return response.toString();
	}

	@PostMapping("/remove/{id}")
	public ResponseEntity<String> removeDevice(@PathVariable("id") Long id) {
		Device device = deviceService.getDevice(id);

		if (checkAllowed(device)) {
			deviceService.removeDevice(id);
		} else {
			return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
		}
		return new ResponseEntity<>(null, HttpStatus.NOT_IMPLEMENTED);
	}

	@GetMapping("/all/{ownerId}")
	public ResponseEntity<List<Map<String, Object>>> getYourDevices(@PathVariable("ownerId") Long ownerId) {
		List<Map<String, Object>> deviceData = new ArrayList<>();
		List<Device> devices = deviceService.getDevicesByOwner(ownerId);

		for (Device device : devices) {
			if (checkAllowed(device)) {
				deviceData.add(parseDevice(device));
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
				deviceData.add(parseDeviceShort(device));
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
				deviceData.add(parseDevice(device));
			}
		}

		return new ResponseEntity<>(deviceData, HttpStatus.OK);
	}

	@PostMapping("/bookmarks/remove/{deviceId}")
	public ResponseEntity<List<Map<String, Object>>> removeBookmark(Authentication authentication,
			@PathVariable("deviceId") Long deviceId) {
		// ResponseEntity<>(HttpStatus.FORBIDDEN);
		List<Map<String, Object>> deviceData = new ArrayList<>();
		Long ownerId = 1L;
		// TODO Principal is currently user email
		// ownerId = authentication.getPrincipal();

		if (bookmarkService.removeBookmark(ownerId, deviceId)) {
			List<Device> devices = bookmarkService.getBookmarkedDevices(ownerId);
			for (Device device : devices) {
				if (checkAllowed(device)) {
					deviceData.add(parseDeviceShort(device));
				}
			}

			return new ResponseEntity<>(deviceData, HttpStatus.OK);
		} else {
			System.out.println("Failed removing Bookmark from " + ownerId + " for " + deviceId);
			return new ResponseEntity<>(null, HttpStatus.OK);
		}
	}

	@PostMapping("/bookmarks/add/{deviceId}")
	public ResponseEntity<String> addBookmark(@PathVariable("deviceId") Long deviceId) {
		// TODO ownerId from current user: return new
		// ResponseEntity<>(HttpStatus.FORBIDDEN);
		Long ownerId = 1L;

		Bookmark bookmark = new Bookmark();
		bookmark.setOwnerId(ownerId);
		bookmark.setDeviceId(deviceId);

		bookmarkService.saveBookmark(bookmark);
		return new ResponseEntity<>(null, HttpStatus.OK);
	}

	@PostMapping("{id}/image")
	public ResponseEntity<String> uploadImage(
			@RequestParam("file") MultipartFile file,
			@PathVariable("id") Long deviceId) {
		// TODO check if user is owner of device -> allowed to upload images, also if
		// device exists...

		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("No file uploaded.");
		}

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
