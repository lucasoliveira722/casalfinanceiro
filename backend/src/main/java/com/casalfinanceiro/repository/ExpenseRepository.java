package com.casalfinanceiro.repository;

import com.casalfinanceiro.domain.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    @Query("SELECT e FROM Expense e WHERE " +
            "(e.expenseType = 'SINGLE' AND e.createdAt >= :startDate AND e.createdAt <= :endDate) OR " +
            "(e.expenseType = 'RECURRING' AND e.createdAt <= :endDate) OR " +
            "(e.expenseType = 'INSTALLMENT' AND e.createdAt <= :endDate AND e.endMonthYear >= :monthStart)")
    List<Expense> findExpensesForMonth(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("monthStart") LocalDate monthStart
    );
}