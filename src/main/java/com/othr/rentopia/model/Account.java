package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(length = 500)
    private String description;

    @Column
    private Location location;

    @Column
    private String language;

    public enum Role {
        USER,
        COMPANY,
        ADMIN
    }
}
