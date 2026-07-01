package com.finance.repository;

import com.finance.domain.BudgetMainOperation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetMainOperationRepository extends JpaRepository<BudgetMainOperation, Long> {
}