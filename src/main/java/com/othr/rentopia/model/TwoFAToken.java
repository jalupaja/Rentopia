package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class TwoFAToken {
    public static final int EXPIRATION = 15;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private String token;

    @Column
    private String authCode;

    @Column
    private String userEmail;

    @Column(nullable = false)
    private LocalDateTime expiration;
}
