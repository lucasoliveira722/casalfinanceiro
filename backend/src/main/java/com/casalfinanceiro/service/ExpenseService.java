package com.casalfinanceiro.service;

import com.casalfinanceiro.domain.Expense;
import com.casalfinanceiro.dto.ExpenseRequestDTO;
import com.casalfinanceiro.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense createExpense(ExpenseRequestDTO dto, String userId) {
        Expense expense = new Expense();
        expense.setUserId(userId);
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setVisibility(dto.getVisibility());
        expense.setExpenseType(dto.getExpenseType());

        applyInstallmentLogic(expense, dto, LocalDate.now());

        return repository.save(expense);
    }

    public Expense updateExpense(UUID id, ExpenseRequestDTO dto) {
        Expense expense = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gasto não encontrado"));

        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setVisibility(dto.getVisibility());
        expense.setExpenseType(dto.getExpenseType());

        LocalDate baseDate = expense.getCreatedAt() != null ? expense.getCreatedAt().toLocalDate() : LocalDate.now();
        applyInstallmentLogic(expense, dto, baseDate);

        return repository.save(expense);
    }

    public void deleteExpense(UUID id) {
        repository.deleteById(id);
    }

    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    public List<Expense> getExpensesForMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        LocalDate monthStart = yearMonth.atDay(1);

        return repository.findExpensesForMonth(startDate, endDate, monthStart);
    }

    // O método precisa estar DENTRO da classe ExpenseService
    private void applyInstallmentLogic(Expense expense, ExpenseRequestDTO dto, LocalDate baseDate) {
        if (dto.getExpenseType() == Expense.ExpenseType.INSTALLMENT
                && dto.getInstallments() != null
                && dto.getInstallments() > 0) {

            expense.setInstallments(dto.getInstallments());

            BigDecimal installmentAmount = dto.getAmount().divide(
                    new BigDecimal(dto.getInstallments()),
                    2,
                    RoundingMode.CEILING
            );
            expense.setInstallmentAmount(installmentAmount);

            LocalDate startMonth = baseDate.withDayOfMonth(1);
            expense.setEndMonthYear(startMonth.plusMonths(dto.getInstallments() - 1));

        } else {
            expense.setInstallments(null);
            expense.setInstallmentAmount(null);
            expense.setEndMonthYear(null);
        }
    }
} // <- Última chave da classe!