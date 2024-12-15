package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Objects;

@Entity
@Data
public class DeviceImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false) // TODO use @Id here and remove above if actual images are used
    private String name;

    @Column(nullable = false)
    private Long deviceId;

}
