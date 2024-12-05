package com.othr.rentopia.controller;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceService;
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

        Device device = new Device();
        device.setTitle("Maschiene");
        device.setDescription("Just better. trust me\ntext text text text text text text text text\ntext text text\ntext text text text text text text text text text text text text text text text text text text text");
        device.setPrice(0.0);
        device.setOwnerId(account.getId());
        device.setLocation(location);
        device.setIsPublic(true);
        deviceService.saveDevice(device);

        device.setTitle("Laptop");
        device.setDescription("A powerful gaming laptop");
        device.setPrice(1200.00);
        deviceService.saveDevice(device);

        device.setTitle("Portable Speaker");
        device.setDescription("Take your music anywhere with this powerful, high-quality portable speaker.\nWith crystal-clear sound, deep bass, and a rugged, waterproof design, it's perfect for outdoor adventures.\nEnjoy up to 10 hours of continuous playback on a single charge.");
        device.setPrice(15.00);
        deviceService.saveDevice(device);

        device.setTitle("3D Printer");
        device.setDescription("Bring your ideas to life with this professional-grade 3D printer.\nCapable of printing high-quality models in various materials, it’s perfect for prototyping, creating custom designs, or even producing small items for sale.\nRent it for short-term projects or experimentation.");
        device.setPrice(50.00);
        deviceService.saveDevice(device);

        device.setTitle("Projector");
        device.setDescription("Turn any space into a home theater with this portable, high-definition projector.\nPerfect for movie nights, presentations, or projecting large images for events.\nCompatible with most devices and comes with built-in speakers.");
        device.setPrice(25.00);
        device.setIsPublic(true);
        deviceService.saveDevice(device);

        device.setTitle("Drones with Camera");
        device.setDescription("Capture stunning aerial footage with this drone equipped with a 4K camera.\nPerfect for outdoor photography, videography, or just exploring from above.\nGreat for travelers, photographers, and hobbyists who want to try drone flying without buying one.");
        device.setPrice(40.00);
        deviceService.saveDevice(device);

        device.setTitle("GoPro Camera");
        device.setDescription("Document your adventures with this rugged, waterproof GoPro camera.\nPerfect for sports enthusiasts, travelers, and vloggers who need a high-quality action camera that can withstand tough conditions.\nCapture 4K video and share your experiences with ease.");
        device.setPrice(20.00);
        deviceService.saveDevice(device);

        device.setTitle("Electric Guitar");
        device.setDescription("Learn or practice guitar with this high-quality electric guitar.\nComes with an amplifier and all the necessary accessories.\nGreat for beginners who want to try playing or musicians who need a temporary instrument for a gig.");
        device.setPrice(30.00);
        deviceService.saveDevice(device);

        device.setTitle("Laser Cutter");
        device.setDescription("Cut and engrave materials like wood, acrylic, and metal with this industrial-grade laser cutter.\nPerfect for makers, designers, or small business owners who need precision cutting for their projects.\nRent it for a few days to complete your next big idea.");
        device.setPrice(75.00);
        deviceService.saveDevice(device);

    }
}
