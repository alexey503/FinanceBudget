package com.finance.dto;

import com.finance.domain.Account;
import lombok.Data;

@Data
public class AccountDto {
    private Long id;
    private String name;
    private String description;
    private Double balance;
    private String currency;
    private String accountNumber;
    private String accountType;
    private Account.AccountType type;
    private Long ownerId;
    private boolean deleted = false;
}
