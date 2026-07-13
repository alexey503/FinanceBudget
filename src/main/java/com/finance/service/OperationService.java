package com.finance.service;

import com.finance.domain.Operation;
import com.finance.domain.OperationType;
import com.finance.dto.OperationDto;
import com.finance.repository.*;
import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

        Operation savedOperation = operationRepository.save(operation);
        // При создании новой операции nextId = id
        savedOperation.setNextId(savedOperation.getId());
        return operationRepository.save(savedOperation);
    }

    public List<OperationDto> getAllOperations() {
        return operationRepository.findAllActive().stream()
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
        LocalDateTime now = LocalDateTime.now();
        return operationRepository.findFutureOperations(now).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Operation> updateOperationsBatch(List<OperationDto> dtos) {
        List<Operation> updatedOperations = new ArrayList<>();
        
        for (OperationDto dto : dtos) {
            Operation originalOperation = operationRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Operation not found with id: " + dto.getId()));

            // Сравниваем поля оригинальной операции с полученным DTO
            if (!hasOperationChanged(originalOperation, dto)) {
                // Если изменений нет, пропускаем эту запись
                continue;
            }

            // Создаем новую операцию с измененными данными
            Operation newOperation = new Operation();
            newOperation.setDateTime(dto.getDateTime() != null ? dto.getDateTime() : LocalDateTime.now());
            newOperation.setTotalAmount(dto.getTotalAmount());
            newOperation.setComment(dto.getComment());
            
            newOperation.setAccount(accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found")));
            
            if (dto.getMarketplaceId() != null) {
                newOperation.setMarketplace(marketplaceRepository.findById(dto.getMarketplaceId())
                        .orElseThrow(() -> new RuntimeException("Marketplace not found")));
            }

            newOperation.setOperationType(operationTypeRepository.findById(dto.getOperationTypeId())
                    .orElseThrow(() -> new RuntimeException("OperationType not found")));

            if (dto.getSpecialTypeId() != null) {
                newOperation.setSpecialType(specialTypeRepository.findById(dto.getSpecialTypeId())
                        .orElseThrow(() -> new RuntimeException("SpecialType not found")));
            }
            
            if (dto.getCategoryId() != null) {
                newOperation.setCategory(categoryRepository.findById(dto.getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found")));
            }
            
            if (dto.getReceiptId() != null) {
                newOperation.setReceipt(receiptRepository.findById(dto.getReceiptId())
                        .orElseThrow(() -> new RuntimeException("Receipt not found")));
            }

            // Сохраняем новую операцию
            Operation savedNewOperation = operationRepository.save(newOperation);
            // Устанавливаем nextId для новой операции = id новой операции
            savedNewOperation.setNextId(savedNewOperation.getId());
            operationRepository.save(savedNewOperation);

            // Обновляем старую операцию: устанавливаем nextId = id новой операции
            originalOperation.setNextId(savedNewOperation.getId());
            operationRepository.save(originalOperation);

            updatedOperations.add(savedNewOperation);
        }

        return updatedOperations;
    }

    private boolean hasOperationChanged(Operation original, OperationDto updated) {
        // Сравниваем все поля операции
        if (!original.getDateTime().equals(updated.getDateTime())) {
            return true;
        }
        if (original.getTotalAmount() != updated.getTotalAmount()) {
            return true;
        }
        if (!nullSafeEquals(original.getComment(), updated.getComment())) {
            return true;
        }
        if (!original.getAccount().getId().equals(updated.getAccountId())) {
            return true;
        }
        if (!original.getOperationType().getId().equals(updated.getOperationTypeId())) {
            return true;
        }
        
        // Сравниваем опциональные поля
        Long originalMarketplaceId = original.getMarketplace() != null ? original.getMarketplace().getId() : null;
        if (!nullSafeEquals(originalMarketplaceId, updated.getMarketplaceId())) {
            return true;
        }
        
        Long originalCategoryId = original.getCategory() != null ? original.getCategory().getId() : null;
        if (!nullSafeEquals(originalCategoryId, updated.getCategoryId())) {
            return true;
        }
        
        Long originalSpecialTypeId = original.getSpecialType() != null ? original.getSpecialType().getId() : null;
        if (!nullSafeEquals(originalSpecialTypeId, updated.getSpecialTypeId())) {
            return true;
        }
        
        Long originalReceiptId = original.getReceipt() != null ? original.getReceipt().getId() : null;
        if (!nullSafeEquals(originalReceiptId, updated.getReceiptId())) {
            return true;
        }
        
        return false;
    }

    private boolean nullSafeEquals(Object obj1, Object obj2) {
        if (obj1 == null && obj2 == null) {
            return true;
        }
        if (obj1 == null || obj2 == null) {
            return false;
        }
        return obj1.equals(obj2);
    }
}
