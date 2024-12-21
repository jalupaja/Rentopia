package com.othr.rentopia.controller;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Rating;
import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.model.DeviceImage;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceService;
import com.othr.rentopia.service.BookmarkService;
import com.othr.rentopia.service.RatingService;
import com.othr.rentopia.service.DeviceImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.othr.rentopia.api.EmailService;

import java.util.List;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin
public class DebugController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private DeviceImageService deviceImageService;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "db")
    public void dbFiller() {
        System.out.println("filling up the database");

        Location location = new Location();
        location.setStreet("123 Elm Street");
        location.setCity("Springfield");
        location.setState("Illinois");
        location.setCountry("USA");
        location.setPostalCode("62704");

        Account account = new Account();
        account.setEmail("test@xample.com");
        account.setPassword("password");
        account.setName("John Doe");
        account.setRole(Account.Role.USER);
        account.setLocation(location);
        accountService.saveAccount(account);

        String[] titles = { "Screw Drivers", "Laptop", "Portable Speaker", "3D Printer", "Projector",
                "Drones with Camera",
                "GoPro Camera", "Electric Guitar", "Laser Cutter", "Smartphone", "Tablet", "Smartwatch",
                "Bluetooth Headphones", "Digital Camera", "VR Headset", "Gaming Console", "Microwave Oven",
                "Electric Scooter", "Hoverboard", "Air Purifier", "Coffee Maker", "Electric Kettle", "Smart Home Hub",
                "Electric Bike", "Portable Charger", "Handheld Vacuum Cleaner" };
        String[] descriptions = { "Just better. Trust me. Text text text text text text text text.",
                "A powerful gaming laptop.", "Take your music anywhere with this high-quality portable speaker.",
                "Bring your ideas to life with this professional-grade 3D printer.",
                "Turn any space into a home theater with this portable, high-definition projector.",
                "Capture stunning aerial footage with this drone equipped with a 4K camera.",
                "Document your adventures with this rugged, waterproof GoPro camera.",
                "Learn or practice guitar with this high-quality electric guitar.",
                "Cut and engrave materials with this industrial-grade laser cutter." };
        double[] prices = {
                0.0, 0.0, 15.99, 45.00, 0.0, 30.50, 0.0, 80.25, 55.99, 0.0,
                25.00, 70.00, 0.0, 10.99, 60.00, 0.0, 50.00, 95.00, 0.0, 40.00,
                20.00, 0.0, 85.99, 75.50, 0.0, 65.00, 0.0
        };

        boolean free_price = true;
        for (int i = 1; i <= 25; i++) {
            String title = titles[i - 1];
            String description = descriptions[i % descriptions.length];
            Double price = prices[i % prices.length];
            Long ownerId = 1L;
            boolean isPublic = (i < 5) ? false : true;

            Device device = new Device();
            device.setTitle(title);
            device.setDescription(description);
            device.setPrice(price);
            device.setOwnerId(ownerId);
            device.setLocation(location);
            device.setIsPublic(isPublic);
            deviceService.saveDevice(device);

            // add images
            DeviceImage deviceImage = new DeviceImage();
            deviceImage.setDeviceId((long) i);
            deviceImage.setName("d-" + i + ".png");
            deviceImageService.saveDeviceImage(deviceImage);

            // add extra images
            if (i == 1 || i == 3) {
                for (int j = 1; j <= 8; j++) {
                    DeviceImage d = new DeviceImage();
                    d.setDeviceId((long) i);
                    d.setName("d" + i + "-" + j + ".png");
                    deviceImageService.saveDeviceImage(d);
                }
            }
        }

        // Bookmarks
        Bookmark bookmark = new Bookmark();
        bookmark.setOwnerId(account.getId());
        bookmark.setDeviceId(1L);
        bookmarkService.saveBookmark(bookmark);

        Bookmark bookmark2 = new Bookmark();
        bookmark2.setOwnerId(account.getId());
        bookmark2.setDeviceId(3L);
        bookmarkService.saveBookmark(bookmark2);

        Rating r1 = new Rating();
        r1.setAccountId(1L);
        r1.setDeviceId(1L);
        r1.setRating(5);
        ratingService.saveRating(r1);

        Rating r2 = new Rating();
        r2.setAccountId(1L);
        r2.setDeviceId(2L);
        r2.setRating(5);
        ratingService.saveRating(r2);

        Rating r3 = new Rating();
        r3.setAccountId(2L);
        r3.setDeviceId(2L);
        r3.setRating(4);
        ratingService.saveRating(r3);
    }
}
