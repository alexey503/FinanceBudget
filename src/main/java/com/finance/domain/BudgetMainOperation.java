package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

/**
 * Таблица BudgetMainOperation содержит операции проводимые в нашем бюджете:
 * покупки, переводы, платежи, поступления, траты, будущие платежи, отменненые
 * это ОСНОВНАЯ и самая большая таблица. Остальные вспомогательные
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class BudgetMainOperation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор операции

    private LocalDateTime dateTime;      // Дата и время операции
    private double totalAmount;          // Общая сумма операции
    private String comment;              // Комментарий к операции
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;             // Счет, с которым связана операция
    @ManyToOne
    @JoinColumn(name = "marketplace_id")
    private Marketplace marketplace;     // Магазин/место совершения операции
    @ManyToOne
    @JoinColumn(name = "operation_type_id")
    private OperationType operationType; // Тип операции (доход/расход)

    @ManyToOne
    @JoinColumn(name = "special_type_id")
    private SpecialType specialType;     // Специальный тип (если есть)
    @ManyToMany
    @JoinTable(
        name = "operation_special_categories",
        joinColumns = @JoinColumn(name = "operation_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<BudgetCategory> specialCategories = new HashSet<>();  // Доп. категории операции
}