package com.finance.dto;

import com.finance.domain.Account;
import lombok.Data;

@Data
public class AccountDto {
    private String name;
    private String description;
    private Double balance;
    private String currency;
    private String accountNumber;
    private Account.AccountType type;
    private Long ownerId;
}
