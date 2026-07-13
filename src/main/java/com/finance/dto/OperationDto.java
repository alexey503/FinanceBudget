package com.finance.dto;

import com.finance.domain.Account;
import com.finance.domain.Receipt;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;

@Data
public class OperationDto {

    private Long id;

    @NotNull
    private LocalDateTime dateTime;

    @NotNull
    private Double totalAmount;

    @NotNull
    private String comment; // Имя операции, описание

    @NotNull
    private Long accountId;

    @Nullable
    private Long marketplaceId;  // Может быть null, если маркетплейс не выбран при сохранении операции
    private String marketplaceName;

    private Long operationTypeId;
    private Long specialTypeId;
    private Long categoryId;
    private String categoryName;
    private Long receiptId;

    private Receipt receipt;
    private Account account;
}
