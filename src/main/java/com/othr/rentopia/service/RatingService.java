package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.Tuple;

import com.othr.rentopia.model.Rating;

public interface RatingService {
    public void saveRating(Rating rating);
    public boolean removeRating(Long accountId, Long deviceId);
    public boolean hasRating(Long accountId, Long deviceId);
    public List<Integer> getRatings(Long deviceId);
}

