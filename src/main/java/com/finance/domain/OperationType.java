package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Типы операций (Доход/Расход/Инвестиции)
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperationType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор типа операции

    private String name;     // Название типа (например: "Доход", "Расход")
    private String comment;  // Описание типа операции
}