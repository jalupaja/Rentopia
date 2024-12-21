package com.othr.rentopia.controller;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Rating;
import com.othr.rentopia.model.Finance;
import com.othr.rentopia.model.Bookmark;
import com.othr.rentopia.model.Location;
import com.othr.rentopia.model.DeviceImage;
import com.othr.rentopia.service.AccountService;
import com.othr.rentopia.service.DeviceService;
import com.othr.rentopia.service.BookmarkService;
import com.othr.rentopia.service.RatingService;
import com.othr.rentopia.service.FinanceService;
import com.othr.rentopia.service.DeviceImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;

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
    private FinanceService financeService;

    @Autowired
    private DeviceImageService deviceImageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping(value = "db")
    public void dbFiller() {
        // This function will fill the database for testing and showcasing purposes
        System.out.println("filling up the database");

        // normal user
        Location l1 = new Location();
        l1.setStreet("Bismarckplatz 1");
        l1.setCity("Regensburg");
        l1.setState("Bavaria");
        l1.setCountry("Germany");
        l1.setPostalCode("93047");

        Account u1 = new Account();
        u1.setEmail("u");
        u1.setPassword(passwordEncoder.encode("u"));
        u1.setName("Lukas Müller");
        u1.setRole(Account.Role.USER);
        u1.setLocation(l1);
        accountService.saveAccount(u1);

        // Admin
        Location l2 = new Location();
        l2.setStreet("Domplatz 5");
        l2.setCity("Regensburg");
        l2.setState("Bavaria");
        l2.setCountry("Germany");
        l2.setPostalCode("93047");

        Account u2 = new Account();
        u2.setEmail("a");
        u2.setPassword(passwordEncoder.encode("a"));
        u2.setName("Anna Schneider");
        u2.setRole(Account.Role.ADMIN);
        u2.setLocation(l2);
        accountService.saveAccount(u2);

        // Company user
        Location l3 = new Location();
        l3.setStreet("Seybothstraße 2");
        l3.setCity("Regensburg");
        l3.setState("Bavaria");
        l3.setCountry("Germany");
        l3.setPostalCode("93053");

        Account u3 = new Account();
        u3.setEmail("c");
        u3.setPassword(passwordEncoder.encode("c"));
        u3.setName("OTH Regensburg");
        u3.setRole(Account.Role.COMPANY);
        u3.setLocation(l3);
        accountService.saveAccount(u3);

        // normal user: device owner
        Location l4 = new Location();
        l4.setStreet("Galgenbergstraße 30");
        l4.setCity("Regensburg");
        l4.setState("Bavaria");
        l4.setCountry("Germany");
        l4.setPostalCode("93053");

        Account u4 = new Account();
        u4.setEmail("u2");
        u4.setPassword(passwordEncoder.encode("u2"));
        u4.setName("Maximilian Weber");
        u4.setRole(Account.Role.USER);
        u4.setLocation(l4);
        accountService.saveAccount(u4);

        String[] titles = { "Screw Drivers", "Laptop", "Portable Speaker", "3D Printer", "Projector",
                "Drones with Camera",
                "GoPro Camera", "Electric Guitar", "Laser Cutter", "Smartphone", "Tablet", "Smartwatch",
                "Bluetooth Headphones", "Digital Camera", "VR Headset", "Gaming Console", "Microwave Oven",
                "Electric Scooter", "Hoverboard", "Air Purifier", "Coffee Maker", "Electric Kettle", "Smart Home Hub",
                "Electric Bike", "Portable Charger", "Handheld Vacuum Cleaner" };

        String[] descriptions = {
            "Erleben Sie die Vielseitigkeit unserer Schraubendreher-Sets. \nPerfekt für Heimwerker und Profis gleichermaßen. \nJetzt mieten und jedes Projekt mühelos abschließen!",
            "Leihen Sie einen hochwertigen Laptop für Arbeit, Studium oder Unterhaltung. \nModernste Technik und leistungsstarke Performance – genau das, was Sie brauchen.",
            "Genießen Sie erstklassigen Sound mit unserem tragbaren Lautsprecher. \nIdeal für Partys, Outdoor-Aktivitäten oder entspannte Stunden zu Hause. \nJetzt mieten und Musik überallhin mitnehmen!",
            "Unsere 3D-Drucker eröffnen Ihnen unbegrenzte kreative Möglichkeiten. \nPerfekt für Prototyping, Design oder einfach zum Experimentieren. \nLeihen Sie sich Ihr Modell noch heute aus!",
            "Beeindrucken Sie mit einem leistungsstarken Projektor. \nPerfekt für Präsentationen, Heimkino-Abende oder Events. \nJetzt mieten und Ihr Erlebnis auf die große Leinwand bringen!",
            "Entdecken Sie die Welt aus einer neuen Perspektive mit unseren Kameradrohnen. \nPerfekt für atemberaubende Luftaufnahmen oder Hobby-Piloten. \nJetzt mieten und abheben!",
            "Machen Sie Ihre Abenteuer unvergesslich mit einer GoPro-Kamera. \nRobust, wasserdicht und ideal für jede Action. \nJetzt leihen und jedes Detail festhalten!",
            "Tauchen Sie ein in die Welt der Musik mit unserer elektrischen Gitarre. \nPerfekt für Anfänger oder erfahrene Musiker. \nJetzt mieten und rocken Sie los!",
            "Unsere Laserschneider sind ideal für präzise Schnitte und Gravuren. \nPerfekt für Bastler, Künstler oder Profis. \nMieten Sie jetzt und realisieren Sie Ihre Projekte mit Perfektion!",
            "Bleiben Sie verbunden mit einem modernen Smartphone. \nIdeal für Reisen, Ersatz oder kurzfristige Nutzung. \nLeihen Sie sich ein Gerät, das Ihren Bedürfnissen entspricht.",
            "Mieten Sie ein Tablet für Arbeit, Unterhaltung oder kreative Projekte. \nLeicht, praktisch und leistungsstark – perfekt für jede Gelegenheit.",
            "Behalten Sie den Überblick mit einer schicken Smartwatch. \nPerfekt für Fitness, Benachrichtigungen und Stil. \nJetzt mieten und Ihr Leben smarter gestalten!",
            "Tauchen Sie ein in kristallklaren Sound mit unseren Bluetooth-Kopfhörern. \nIdeal für Musik, Podcasts oder Spiele. \nJetzt leihen und den Unterschied hören!",
            "Machen Sie mit einer digitalen Kamera perfekte Fotos. \nIdeal für Hochzeiten, Reisen oder Projekte. \nJetzt mieten und unvergessliche Momente festhalten!",
            "Erleben Sie die Zukunft mit einem VR-Headset. \nIdeal für Gaming, Simulationen oder einfach nur Spaß. \nJetzt leihen und in virtuelle Welten eintauchen!",
            "Spielen Sie Ihre Lieblingsspiele mit unserer modernen Spielekonsole. \nPerfekt für Gaming-Partys oder entspannte Abende. \nJetzt mieten und das Spielerlebnis verbessern!",
            "Mieten Sie eine Mikrowelle für schnelles und einfaches Kochen. \nPerfekt für Events, Reisen oder kurzfristige Nutzung. \nJetzt ausprobieren und bequem genießen!",
            "Erleben Sie die Stadt mit einem Elektroroller. \nSchnell, umweltfreundlich und ideal für kurze Strecken. \nJetzt mieten und losfahren!",
            "Gleiten Sie mit Stil auf einem Hoverboard. \nPerfekt für Spaß und Abenteuer im Freien. \nJetzt mieten und das Fahren neu entdecken!",
            "Atmen Sie auf mit einem modernen Luftreiniger. \nIdeal für Allergiker oder einfach für saubere Luft. \nJetzt leihen und durchatmen!",
            "Genießen Sie perfekten Kaffee mit einer hochwertigen Kaffeemaschine. \nIdeal für Zuhause, Büro oder Veranstaltungen. \nJetzt mieten und den Unterschied schmecken!",
            "Bereiten Sie heißes Wasser in Sekundenschnelle mit einem elektrischen Wasserkocher zu. \nPraktisch, schnell und effizient. \nJetzt mieten und Komfort genießen!",
            "Verwalten Sie Ihr Zuhause smart mit einem Smart Home Hub. \nIdeal für Sprachsteuerung, Automatisierung und mehr. \nJetzt leihen und Ihr Zuhause intelligenter machen!",
            "Erleben Sie die Freiheit mit einem E-Bike. \nPerfekt für Abenteuer, Pendeln oder Freizeit. \nJetzt mieten und die Straße erobern!",
            "Bleiben Sie unterwegs verbunden mit einem tragbaren Ladegerät. \nIdeal für Reisen, Camping oder Notfälle. \nJetzt leihen und niemals ohne Strom sein!",
            "Halten Sie Ihr Zuhause sauber mit einem tragbaren Staubsauger. \nKompakt, leistungsstark und praktisch. \nJetzt mieten und Sauberkeit genießen!"
        };

        double[] prices = {
            0.0, 0.0, 15.99, 45.00, 0.0, 30.50, 0.0, 80.25, 55.99, 0.0,
            25.00, 70.00, 0.0, 10.99, 60.00, 0.0, 50.00, 95.00, 0.0, 40.00,
            20.00, 0.0, 85.99, 75.50, 0.0, 65.00, 0.0
        };

        Long ownerId = u4.getId();
        Location location = u4.getLocation();
        for (int i = 1; i <= 25; i++) {
            String title = titles[i - 1];
            String description = descriptions[i - 1];
            Double price = prices[i % prices.length];
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
        bookmark.setOwnerId(u1.getId());
        bookmark.setDeviceId(5L);
        bookmarkService.saveBookmark(bookmark);

        Bookmark bookmark2 = new Bookmark();
        bookmark2.setOwnerId(u1.getId());
        bookmark2.setDeviceId(6L);
        bookmarkService.saveBookmark(bookmark2);

        Bookmark bookmark3 = new Bookmark();
        bookmark3.setOwnerId(u1.getId());
        bookmark3.setDeviceId(7L);
        bookmarkService.saveBookmark(bookmark3);

        // Ratings
        Rating r1 = new Rating();
        r1.setAccountId(u1.getId());
        r1.setDeviceId(5L);
        r1.setRating(5);
        ratingService.saveRating(r1);

        Rating r2 = new Rating();
        r2.setAccountId(u2.getId());
        r2.setDeviceId(7L);
        r2.setRating(4);
        ratingService.saveRating(r2);

        Rating r3 = new Rating();
        r3.setAccountId(u3.getId());
        r3.setDeviceId(9L);
        r3.setRating(3);
        ratingService.saveRating(r3);

        Rating r4 = new Rating();
        r4.setAccountId(u4.getId());
        r4.setDeviceId(6L);
        r4.setRating(5);
        ratingService.saveRating(r4);

        Rating r5 = new Rating();
        r5.setAccountId(u1.getId());
        r5.setDeviceId(8L);
        r5.setRating(4);
        ratingService.saveRating(r5);

        Rating r6 = new Rating();
        r6.setAccountId(u2.getId());
        r6.setDeviceId(11L);
        r6.setRating(3);
        ratingService.saveRating(r6);

        Rating r7 = new Rating();
        r7.setAccountId(u3.getId());
        r7.setDeviceId(13L);
        r7.setRating(2);
        ratingService.saveRating(r7);

        Rating r8 = new Rating();
        r8.setAccountId(u4.getId());
        r8.setDeviceId(15L);
        r8.setRating(4);
        ratingService.saveRating(r8);

        Rating r9 = new Rating();
        r9.setAccountId(u1.getId());
        r9.setDeviceId(10L);
        r9.setRating(5);
        ratingService.saveRating(r9);

        Rating r10 = new Rating();
        r10.setAccountId(u2.getId());
        r10.setDeviceId(12L);
        r10.setRating(4);
        ratingService.saveRating(r10);

        Rating r11 = new Rating();
        r11.setAccountId(u1.getId());
        r11.setDeviceId(5L);
        r11.setRating(4);
        ratingService.saveRating(r11);

        Rating r12 = new Rating();
        r12.setAccountId(u2.getId());
        r12.setDeviceId(5L);
        r12.setRating(3);
        ratingService.saveRating(r12);

        Rating r13 = new Rating();
        r13.setAccountId(u3.getId());
        r13.setDeviceId(6L);
        r13.setRating(5);
        ratingService.saveRating(r13);

        Rating r14 = new Rating();
        r14.setAccountId(u4.getId());
        r14.setDeviceId(6L);
        r14.setRating(4);
        ratingService.saveRating(r14);

        Rating r15 = new Rating();
        r15.setAccountId(u1.getId());
        r15.setDeviceId(7L);
        r15.setRating(3);
        ratingService.saveRating(r15);

        Rating r16 = new Rating();
        r16.setAccountId(u3.getId());
        r16.setDeviceId(7L);
        r16.setRating(5);
        ratingService.saveRating(r16);

        Rating r17 = new Rating();
        r17.setAccountId(u2.getId());
        r17.setDeviceId(8L);
        r17.setRating(4);
        ratingService.saveRating(r17);

        Rating r18 = new Rating();
        r18.setAccountId(u4.getId());
        r18.setDeviceId(8L);
        r18.setRating(3);
        ratingService.saveRating(r18);

        Rating r19 = new Rating();
        r19.setAccountId(u1.getId());
        r19.setDeviceId(9L);
        r19.setRating(2);
        ratingService.saveRating(r19);

        Rating r20 = new Rating();
        r20.setAccountId(u4.getId());
        r20.setDeviceId(9L);
        r20.setRating(4);
        ratingService.saveRating(r20);

        Rating r21 = new Rating();
        r21.setAccountId(u2.getId());
        r21.setDeviceId(10L);
        r21.setRating(5);
        ratingService.saveRating(r21);

        Rating r22 = new Rating();
        r22.setAccountId(u3.getId());
        r22.setDeviceId(10L);
        r22.setRating(4);
        ratingService.saveRating(r22);

        Rating r23 = new Rating();
        r23.setAccountId(u1.getId());
        r23.setDeviceId(11L);
        r23.setRating(2);
        ratingService.saveRating(r23);

        Rating r24 = new Rating();
        r24.setAccountId(u3.getId());
        r24.setDeviceId(11L);
        r24.setRating(4);
        ratingService.saveRating(r24);

        Rating r25 = new Rating();
        r25.setAccountId(u2.getId());
        r25.setDeviceId(12L);
        r25.setRating(5);
        ratingService.saveRating(r25);

        Rating r26 = new Rating();
        r26.setAccountId(u4.getId());
        r26.setDeviceId(12L);
        r26.setRating(3);
        ratingService.saveRating(r26);

        Rating r27 = new Rating();
        r27.setAccountId(u1.getId());
        r27.setDeviceId(13L);
        r27.setRating(4);
        ratingService.saveRating(r27);

        Rating r28 = new Rating();
        r28.setAccountId(u2.getId());
        r28.setDeviceId(13L);
        r28.setRating(3);
        ratingService.saveRating(r28);

        Rating r29 = new Rating();
        r29.setAccountId(u3.getId());
        r29.setDeviceId(14L);
        r29.setRating(4);
        ratingService.saveRating(r29);

        Rating r30 = new Rating();
        r30.setAccountId(u4.getId());
        r30.setDeviceId(14L);
        r30.setRating(5);
        ratingService.saveRating(r30);

        Rating r31 = new Rating();
        r31.setAccountId(u1.getId());
        r31.setDeviceId(15L);
        r31.setRating(5);
        ratingService.saveRating(r31);

        Rating r32 = new Rating();
        r32.setAccountId(u2.getId());
        r32.setDeviceId(15L);
        r32.setRating(4);
        ratingService.saveRating(r32);

        // Finance
        Finance f1 = new Finance();
        f1.setAccountId(u1.getId());
        f1.setDeviceId(5L);
        f1.setAmount(0.0);
        f1.setProcessed(false);
        financeService.saveFinance(f1);

        Finance f2 = new Finance();
        f2.setAccountId(u1.getId());
        f2.setDeviceId(6L);
        f2.setAmount(20.0);
        f2.setProcessed(true);
        financeService.saveFinance(f2);

        Finance f3 = new Finance();
        f3.setAccountId(u1.getId());
        f3.setDeviceId(7L);
        f3.setAmount(0.0);
        f3.setProcessed(true);
        financeService.saveFinance(f3);

        Finance f4 = new Finance();
        f4.setAccountId(u1.getId());
        f4.setDeviceId(9L);
        f4.setAmount(20.5);
        f4.setProcessed(true);
        financeService.saveFinance(f4);

        Finance f5 = new Finance();
        f5.setAccountId(u1.getId());
        f5.setDeviceId(11L);
        f5.setAmount(30.0);
        f5.setProcessed(false);
        financeService.saveFinance(f5);

    }
}
