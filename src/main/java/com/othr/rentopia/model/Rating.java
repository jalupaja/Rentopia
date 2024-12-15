package com.othr.rentopia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class Rating {

    @Id
    @Column(nullable = false)
    private Long accountId;

    @Id
    @Column(nullable = false)
    private Long deviceId;

    @Column(nullable = false)
    private int rating;
}

