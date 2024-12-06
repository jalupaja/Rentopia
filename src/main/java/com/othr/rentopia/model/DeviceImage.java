package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Objects;

@Entity
@Data
public class DeviceImage {

    @Id
    private String name;

    @Column(nullable = false)
    private Long deviceId;

}
