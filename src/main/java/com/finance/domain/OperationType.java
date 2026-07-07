package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "operation_types")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperationType {

    public enum Type { INCOME, EXPENSE, INVESTMENT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false, length = 20)
    private Type type;

    @Column(length = 500)
    private String description;
}
