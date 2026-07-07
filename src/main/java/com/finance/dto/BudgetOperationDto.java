package com.finance.dto;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BudgetOperationDto {

    @NotNull
    private LocalDateTime dateTime;

    @NotNull
    private Double totalAmount;

    @NotNull
    private String comment; // Имя операции, описание

    @NotNull
    private Long accountId;

    private Long marketplaceId;

    private Long operationTypeId;

    private Long specialTypeId;
    private Set<Long> categoryIds;
    private Long receiptId;
}
