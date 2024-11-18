package com.othr.rentopia.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Location {

    private String street;

    private String city;

    private String state;

    private String country;

    private String postalCode;
}
