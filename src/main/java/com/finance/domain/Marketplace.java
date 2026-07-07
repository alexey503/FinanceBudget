package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Магазины и места совершения операций (статья расхода, траты)
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Marketplace {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор

    private String name;       // Название магазина (например: "Пятерочка", "DNS")
    private String comment;    // Произвольный комментарий
    private String web;        // Сайт/ссылка на магазин
    private String type;       // Тип магазина (продукты, электроника и т.д.)
    private String discountCardId;  // Номер дисконтной карты
}


