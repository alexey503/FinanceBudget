package com.finance.controller;

import com.finance.domain.BudgetMainOperation;
import com.finance.dto.BudgetOperationDto;
import com.finance.service.BudgetOperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationController {

    private final BudgetOperationService budgetOperationService;

    @PostMapping
    public BudgetMainOperation createOperation(@RequestBody BudgetOperationDto dto) {
        return budgetOperationService.createOperation(dto);
    }

    @GetMapping
    public List<BudgetMainOperation> getAllOperations() {
        return budgetOperationService.getAllOperations();
    }

    @GetMapping("/{id}")
    public BudgetMainOperation getOperationById(@PathVariable Long id) {
        return budgetOperationService.getOperationById(id);
    }
}
