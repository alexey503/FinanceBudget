package com.finance.controller;

import com.finance.domain.BudgetMainOperation;
import com.finance.dto.BudgetOperationDto;
import com.finance.service.OperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationController {

    private final OperationService operationService;

    @PostMapping
    public BudgetMainOperation createOperation(@RequestBody BudgetOperationDto dto) {
        return operationService.createOperation(dto);
    }

    @GetMapping("/futurepay")
    public List<BudgetMainOperation> getFutureOperations() {
        return operationService.getFutureOperations();
    }

    @GetMapping
    public List<BudgetMainOperation> getAllOperations() {
        return operationService.getAllOperations();
    }

    @GetMapping("/{id}")
    public BudgetMainOperation getOperationById(@PathVariable Long id) {
        return operationService.getOperationById(id);
    }
}
