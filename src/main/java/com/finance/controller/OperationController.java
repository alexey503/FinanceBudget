package com.finance.controller;

import com.finance.domain.Operation;
import com.finance.dto.OperationDto;
import com.finance.service.OperationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationController {

    private final OperationService operationService;

    @PostMapping
    public ResponseEntity<Operation> createOperation(@Valid @RequestBody OperationDto dto) {
        try {
            Operation operation = operationService.createOperation(dto);
            return ResponseEntity.ok(operation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/futurepay")
    public List<OperationDto> getFutureOperations() {
        return operationService.getFutureOperations();
    }

    @GetMapping
    public List<OperationDto> getAllOperations() {
        return operationService.getAllOperations();
    }

    @GetMapping("/{id}")
    public OperationDto getOperationById(@PathVariable Long id) {
        return operationService.getOperationById(id);
    }
}
