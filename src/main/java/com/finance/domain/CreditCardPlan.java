package com.finance.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditCardPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
    
    private String bankName;
    private double creditLimit;
    private double currentDebt;
    private double monthlyPayment;
    private LocalDate dueDate;
    private int gracePeriodDays;
}