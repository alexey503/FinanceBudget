package com.finance.repository;

import com.finance.domain.OperationItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationItemRepository extends JpaRepository<OperationItem, Long> {
}