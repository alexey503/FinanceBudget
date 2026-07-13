package com.finance.repository;

import com.finance.domain.Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface OperationRepository extends JpaRepository<Operation, Long> {
    
    @Query("SELECT o FROM Operation o WHERE o.nextId = o.id ORDER BY o.dateTime DESC")
    List<Operation> findAllActive();
    
    @Query("SELECT o FROM Operation o WHERE o.nextId = o.id AND o.dateTime >= :currentDate ORDER BY o.dateTime ASC")
    List<Operation> findFutureOperations(LocalDateTime currentDate);
}
