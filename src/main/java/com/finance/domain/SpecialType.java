package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Специальный тип операции, дополнителные виды деятельности виды деятельности
 * (например, перепродажа товаров)
 * Позволяет помечать операции специальными тегами
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpecialType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор

    private String name;     // Название вида деятельности ("Перепродажа", "Фриланс")
    private String comment;  // Пояснение к специальному типу
}