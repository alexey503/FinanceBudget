package com.finance.service;

import com.finance.domain.Operation;
import com.finance.domain.OperationType;
import com.finance.dto.OperationDto;
import com.finance.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OperationService {

    private final OperationRepository operationRepository;
    private final AccountRepository accountRepository;
    private final MarketplaceRepository marketplaceRepository;
    private final OperationTypeRepository operationTypeRepository;
    private final SpecialTypeRepository specialTypeRepository;
    private final CategoryRepository categoryRepository;
    private final ReceiptRepository receiptRepository;

    @Transactional
    public Operation createOperation(OperationDto dto) {
        Operation operation = new Operation();
        operation.setDateTime(dto.getDateTime() != null ? dto.getDateTime() : LocalDateTime.now());
        operation.setTotalAmount(dto.getTotalAmount());
        operation.setComment(dto.getComment());
        
        operation.setAccount(accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found")));
        
        // Устанавливаем marketplace только если ID не null (если выбран какой-то маркетплейс)
        if (dto.getMarketplaceName() != null) {
            operation.setMarketplace(marketplaceRepository.findById(dto.getMarketplaceId())
                    .orElseThrow(() -> new RuntimeException("Marketplace not found")));
        }

        operation.setOperationType(operationTypeRepository.findById(dto.getOperationTypeId())
                .orElseThrow(() -> new RuntimeException("OperationType not found")));

        if (dto.getSpecialTypeId() != null) {
            operation.setSpecialType(specialTypeRepository.findById(dto.getSpecialTypeId())
                    .orElseThrow(() -> new RuntimeException("SpecialType not found")));
        }
        
        if (dto.getCategoryId() != null) {
            operation.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }
        
        if (dto.getReceiptId() != null) {
            operation.setReceipt(receiptRepository.findById(dto.getReceiptId())
                    .orElseThrow(() -> new RuntimeException("Receipt not found")));
        }

        return operationRepository.save(operation);
    }

    public List<OperationDto> getAllOperations() {
        return operationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OperationDto getOperationById(@NotNull Long id) {
        return convertToDto(operationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Operation not found")));
    }

    private OperationDto convertToDto(Operation operation) {
        OperationDto dto = new OperationDto();
        dto.setId(operation.getId());
        dto.setDateTime(operation.getDateTime());
        dto.setTotalAmount(operation.getTotalAmount());
        dto.setComment(operation.getComment());
        dto.setAccountId(operation.getAccount().getId());

        if (operation.getMarketplace() != null) {
            dto.setMarketplaceId(operation.getMarketplace().getId());
            dto.setMarketplaceName(operation.getMarketplace().getName());
        }

        dto.setOperationTypeId(operation.getOperationType().getId());

        if (operation.getSpecialType() != null) {
            dto.setSpecialTypeId(operation.getSpecialType().getId());
        }

        if (operation.getCategory() != null) {
            dto.setCategoryId(operation.getCategory().getId());
            dto.setCategoryName(operation.getCategory().getName());
        }

        if (operation.getReceipt() != null) {
            dto.setReceiptId(operation.getReceipt().getId());
        }

        if (operation.getAccount() != null) {
            dto.setAccount(operation.getAccount());
        }

        return dto;
    }

    @PostConstruct
    public void initDefaultOperationTypes() {
        if (operationTypeRepository.count() == 0) {
            OperationType income = new OperationType();
            income.setType(OperationType.Type.INCOME);
            income.setDescription("Income operations");
            OperationType expense = new OperationType();
            expense.setType(OperationType.Type.EXPENSE);
            expense.setDescription("Expense operations");
            operationTypeRepository.saveAll(List.of(income, expense));
        }
    }

    public List<OperationDto> getFutureOperations() {
        return getAllOperations();
    }
}
