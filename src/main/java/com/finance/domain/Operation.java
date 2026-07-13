package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Таблица BudgetMainOperation содержит операции проводимые в нашем бюджете:
 * покупки, переводы, платежи, поступления, траты, будущие платежи, отмененные
 * это ОСНОВНАЯ и самая большая таблица. Остальные вспомогательные
 */
@Entity
@Table(name = "budget_main_operation")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Operation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор операции

    private Long nextId;                 // Служебное поле для отслеживания версий операций
                                         // При создании = id, при коррекции старая запись получает nextId = id новой
                                         // null означает удаленную операцию

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

    @ManyToOne
    @JoinColumn(name = "operation_type_id")
    private OperationType operationType; // Тип операции (доход/расход, оплата счета, кредита?)
    @ManyToOne
    @JoinColumn(name = "special_type_id")
    // специальный тип/категория для отнесения операции как некоей деятельности,
    // например, покупки на али с перепродажей на авито
    private SpecialType specialType;

    // Категория расхода: Продукты, авто, дача, хозяйство, кот, здоровье
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}