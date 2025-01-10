package com.othr.rentopia.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private Chat chat;

    @Column(nullable = false, length = 1024)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean isRead = false;

    @ManyToOne
    @JoinColumn(name="sender", referencedColumnName = "id")
    private Account sender;
}
