package com.othr.rentopia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_account_id", nullable = false)
    private Account from;

    @ManyToOne
    @JoinColumn(name = "to_account_id", nullable = false)
    private Account to;

    @Column(nullable = false, length = 1024)
    private String msg;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Boolean read;
}
