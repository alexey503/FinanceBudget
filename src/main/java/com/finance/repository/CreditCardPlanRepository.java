package com.finance.repository;

import com.finance.domain.CreditCardPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditCardPlanRepository extends JpaRepository<CreditCardPlan, Long> {
}