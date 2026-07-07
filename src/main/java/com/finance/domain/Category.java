package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

/**
 * Категории для классификации операций (продукты, транспорт, здоровье и т.д.)
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор категории
    
    private String name;  // Название категории (\"Продукты\", \"Транспорт\", \"Здоровье\")

    private String comment;
}