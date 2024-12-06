package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Objects;

@Entity
@Data
public class DeviceCategory {

    @Id
    @Column
    private String name;
}
