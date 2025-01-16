package com.othr.rentopia.controller;

import com.othr.rentopia.model.Rating;
import com.othr.rentopia.service.*;
import jakarta.persistence.PersistenceException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rating")
@CrossOrigin
public class RatingController {

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

    @PostMapping(path = "/rate/{deviceId}")
    public ResponseEntity<String> rateDevice(Authentication authentication, @PathVariable("deviceId") Long deviceId,  @RequestBody String rating) {
        Rating newRating = new Rating();
        try {
            String email = (String) authentication.getPrincipal();
            Long ownerId = accountService.getId(email);

            newRating.setDeviceId(deviceId);
            newRating.setRating(Integer.parseInt((rating)));
            newRating.setAccountId(ownerId);

            ratingService.saveRating(newRating);
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (PersistenceException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/{deviceId}")
    public ResponseEntity<Integer> getRating(Authentication authentication,@PathVariable("deviceId") Long deviceId) {
        try {
            String email = (String) authentication.getPrincipal();
            Long ownerId = accountService.getId(email);

            if (ratingService.hasRating(ownerId, deviceId)) {
                Integer rating = ratingService.getRating(ownerId, deviceId);
                return new ResponseEntity<>(rating, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.OK);
            }

        } catch (PersistenceException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
