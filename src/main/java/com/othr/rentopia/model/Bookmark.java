package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private Long deviceId;
}
