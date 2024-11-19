package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Account owner;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;
}
