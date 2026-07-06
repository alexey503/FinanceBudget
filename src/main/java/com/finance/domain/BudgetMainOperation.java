package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

/**
 * Таблица BudgetMainOperation содержит операции проводимые в нашем бюджете:
 * покупки, переводы, платежи, поступления, траты, будущие платежи, отмененные
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
    private String comment;              // Комментарий, примечание на что потрачено: купил роутер, продукты

    // чек, ссылка на чек. В таблице может содержаться фото, ссылка, текстовое описание чека по операции
    @ManyToOne
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    @ManyToOne
    @JoinColumn(name = "account_id")
    // Счет, с которым связана операция (Сбер *1719, кредитная *5057, ткс *1688 или нал User1)
    // Каждый счет связан с аккаунтом в программе, поэтому указание пользователя не требуется
    private Account account;

    @ManyToOne
    @JoinColumn(name = "marketplace_id")
    // Магазин/место совершения операции(Светофор, азбука вкуса, петрович)
    private Marketplace marketplace;

    private OperationType operationType; // Тип операции (доход/расход, оплата счета, кредита?)

    @ManyToOne
    @JoinColumn(name = "special_type_id")
    // специальный тип/категория для отнесения операции как некоей деятельности,
    // например, покупки на али с перепродажей на авито
    private SpecialType specialType;

    @ManyToMany
    @JoinTable(
        name = "operation_special_categories",
        joinColumns = @JoinColumn(name = "operation_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )

    // Категория расхода: Проодукты, авто, дача, хозяйство, кот, здоровье
    private Set<Category> specialCategories = new HashSet<>();
}