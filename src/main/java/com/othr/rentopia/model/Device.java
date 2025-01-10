package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Objects;
import java.util.Set;
import java.util.HashSet;

@Entity
@Data
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price = 0.0;

    @Column(nullable = false)
    private Long ownerId;

    @ManyToMany
    @JoinTable(
        name = "devicecategory",
        joinColumns = @JoinColumn(name = "device_id")
    )
    private Set<DeviceCategory> categories = new HashSet<>();

    @Embedded
    private Location location;

    @Column(nullable = false)
    private Boolean isPublic = true;

    /*
        @OneToMany(mappedBy = "device")
        private Set<Finance> finances = new HashSet<>();
     */
}
