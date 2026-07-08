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
        if (dto.getMarketplaceId() != null) {
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

    public List<Operation> getAllOperations() {
        return operationRepository.findAll();
    }

    public Operation getOperationById(@NotNull Long id) {
        return operationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Operation not found"));
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

    public List<Operation> getFutureOperations() {
        return getAllOperations();
    }
}
