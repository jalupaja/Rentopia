package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ResetPasswordToken {

    public static final Long EXPIRATION = 60 * 24L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private String token;

    @Column
    private String userEmail;

    @Column(nullable = false)
    private LocalDateTime expiration;
}
