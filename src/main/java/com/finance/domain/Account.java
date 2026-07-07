package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 *
 * Один из платежных счетов пользователя:
 * платежные карты, наличные, кредитный счет и др
 *
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор счета

    private Long ownerId;

    private String name;  // Название счета (например: "Основной счет", "Кредитная карта Сбербанк")
    @Enumerated(EnumType.STRING)
    private AccountType type;  // Тип счета: кредитный, дебетовый и т.д.

    private String accountNumber;  // Номер счета/карты (может быть замаскирован)
    // можно добавить два метода получения, например *****3279 и полный номер
    private Double balance;  // Текущий баланс счета

    /**
     * Типы счетов в системе
     */
    public enum AccountType {
        CREDIT_CARD,    // Кредитный счет/карта
        DEBIT_CARD,     // Дебетовый счет
        CASH,           // Наличные деньги
        INVESTMENT,     // Инвестиционный счет
        OTHER           // Прочие счета
    }
}