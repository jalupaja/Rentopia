package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="owner", referencedColumnName = "id")
    private Account owner;

    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private Category category;

    @Column(nullable = false, length = 1024)
    private String title;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column
    private Long targetDeviceId; //meaning depends on category

    @Column(length = 1024)
    private String details;

    @Column(length = 1024)
    private String adminResponse;
    public enum Category {
        general, owndevices, renteddevices
    }

    public enum Status {
        NEW, OPEN, CLOSED
    }
}
