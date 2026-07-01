package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Элемент операции (позиция в чеке)
 * Детализирует составные части общей операции
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperationItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор элемента
    @ManyToOne
    @JoinColumn(name = "operation_id")
    private BudgetMainOperation budgetMainOperation;  // Родительская операция

    @ManyToOne
    @JoinColumn(name = "category_id")
    private BudgetCategory budgetCategory;           // Категория этого элемента

    private double amount;    // Сумма по этому элементу
    private String comment;   // Комментарий к элементу (название товара и т.д.)
}