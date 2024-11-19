package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Objects;

@Entity
@Data
public class DeviceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
