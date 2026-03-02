package com.casalfinanceiro.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "couple_id", nullable = false)
    private String coupleId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false)
    private ExpenseType expenseType;

    // --- NOVOS CAMPOS DE PARCELAMENTO ---
    @Column(name = "installments")
    private Integer installments;

    @Column(name = "installment_amount")
    private BigDecimal installmentAmount;

    @Column(name = "end_month_year")
    private LocalDate endMonthYear;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Visibility { PERSONAL, SHARED }
    public enum ExpenseType { SINGLE, INSTALLMENT, RECURRING }
}