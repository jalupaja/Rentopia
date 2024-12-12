package com.othr.rentopia.controller;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.model.DeviceImage;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceService;
import com.othr.rentopia.service.DeviceImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    private DeviceImageService deviceImageService;

    @GetMapping(value="db")
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

        // get id
        account = accountService.getAccount("test@xample.com");

        Device d0 = new Device();
        d0.setTitle("Maschiene");
        d0.setDescription("Just better. trust me\ntext text text text text text text text text\ntext text text\ntext text text text text text text text text text text text text text text text text text text text");
        d0.setPrice(0.0);
        d0.setOwnerId(account.getId());
        d0.setLocation(location);
        d0.setIsPublic(true);
        deviceService.saveDevice(d0);

        Device d1 = new Device();
        d1.setOwnerId(account.getId());
        d1.setLocation(location);
        d1.setIsPublic(false);
        d1.setTitle("Laptop");
        d1.setDescription("A powerful gaming laptop");
        d1.setPrice(1200.00);
        deviceService.saveDevice(d1);

        Device d2 = new Device();
        d2.setOwnerId(account.getId());
        d2.setLocation(location);
        d2.setIsPublic(true);
        d2.setTitle("Portable Speaker");
        d2.setDescription("Take your music anywhere with this powerful, high-quality portable speaker.\nWith crystal-clear sound, deep bass, and a rugged, waterproof design, it's perfect for outdoor adventures.\nEnjoy up to 10 hours of continuous playback on a single charge.");
        d2.setPrice(15.00);
        deviceService.saveDevice(d2);

        Device d3 = new Device();
        d3.setOwnerId(account.getId());
        d3.setLocation(location);
        d3.setIsPublic(true);
        d3.setTitle("3D Printer");
        d3.setDescription("Bring your ideas to life with this professional-grade 3D printer.\nCapable of printing high-quality models in various materials, it’s perfect for prototyping, creating custom designs, or even producing small items for sale.\nRent it for short-term projects or experimentation.");
        d3.setPrice(50.00);
        deviceService.saveDevice(d3);

        Device d4 = new Device();
        d4.setOwnerId(account.getId());
        d4.setLocation(location);
        d4.setIsPublic(true);
        d4.setTitle("Projector");
        d4.setDescription("Turn any space into a home theater with this portable, high-definition projector.\nPerfect for movie nights, presentations, or projecting large images for events.\nCompatible with most devices and comes with built-in speakers.");
        d4.setPrice(25.00);
        d4.setIsPublic(true);
        deviceService.saveDevice(d4);

        Device d5 = new Device();
        d5.setOwnerId(account.getId());
        d5.setLocation(location);
        d5.setIsPublic(true);
        d5.setTitle("Drones with Camera");
        d5.setDescription("Capture stunning aerial footage with this drone equipped with a 4K camera.\nPerfect for outdoor photography, videography, or just exploring from above.\nGreat for travelers, photographers, and hobbyists who want to try drone flying without buying one.");
        d5.setPrice(40.00);
        deviceService.saveDevice(d5);

        Device d6 = new Device();
        d6.setOwnerId(account.getId());
        d6.setLocation(location);
        d6.setIsPublic(true);
        d6.setTitle("GoPro Camera");
        d6.setDescription("Document your adventures with this rugged, waterproof GoPro camera.\nPerfect for sports enthusiasts, travelers, and vloggers who need a high-quality action camera that can withstand tough conditions.\nCapture 4K video and share your experiences with ease.");
        d6.setPrice(20.00);
        deviceService.saveDevice(d6);

        Device d7 = new Device();
        d7.setOwnerId(account.getId());
        d7.setLocation(location);
        d7.setIsPublic(true);
        d7.setTitle("Electric Guitar");
        d7.setDescription("Learn or practice guitar with this high-quality electric guitar.\nComes with an amplifier and all the necessary accessories.\nGreat for beginners who want to try playing or musicians who need a temporary instrument for a gig.");
        d7.setPrice(30.00);
        deviceService.saveDevice(d7);

        Device d8 = new Device();
        d8.setOwnerId(account.getId());
        d8.setLocation(location);
        d8.setIsPublic(true);
        d8.setTitle("Laser Cutter");
        d8.setDescription("Cut and engrave materials like wood, acrylic, and metal with this industrial-grade laser cutter.\nPerfect for makers, designers, or small business owners who need precision cutting for their projects.\nRent it for a few days to complete your next big idea.");
        d8.setPrice(75.00);
        deviceService.saveDevice(d8);

	// Device Images
        for (long i = 1; i <= 9; i++) {
                DeviceImage deviceImage = new DeviceImage();
                deviceImage.setDeviceId(i);
                deviceImage.setName("afccebc1-db63-40ec-a5f7-2421b8f48ec8.jpg");
                deviceImageService.saveDeviceImage(deviceImage);
        }

        for (long i = 1; i <= 9; i++) {
                DeviceImage deviceImage = new DeviceImage();
                deviceImage.setDeviceId(i);
                deviceImage.setName("fe7f047f-1227-4b88-b620-ba1c878eb346.jpg");
                deviceImageService.saveDeviceImage(deviceImage);
        }

	// Bookmarks
	Bookmark bookmark = new Bookmark();
	bookmark.setOwnerId(account.getId());
	bookmark.setDeviceId(1L);
	deviceService.saveBookmark(bookmark);

	Bookmark bookmark2 = new Bookmark();
	bookmark.setOwnerId(account.getId());
	bookmark.setDeviceId(3L);
	deviceService.saveBookmark(bookmark);
    }
}
