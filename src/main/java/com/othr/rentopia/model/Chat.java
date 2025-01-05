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
    @JoinColumn(referencedColumnName = "id")
    private Account firstAccount;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private Account secondAccount;

}
