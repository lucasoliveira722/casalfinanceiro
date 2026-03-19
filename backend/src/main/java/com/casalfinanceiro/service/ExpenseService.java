package com.casalfinanceiro.service;

import com.casalfinanceiro.domain.Expense;
import com.casalfinanceiro.dto.ExpenseRequestDTO;
import com.casalfinanceiro.repository.ExpenseRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense createExpense(ExpenseRequestDTO dto, String userId, String coupleId) {
        Expense expense = new Expense();
        expense.setUserId(userId);
        expense.setCoupleId(coupleId); // Salvando o código do casal
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setVisibility(dto.getVisibility());
        expense.setExpenseType(dto.getExpenseType());

        // Mantenha a chamada do applyInstallmentLogic que já fizemos
        LocalDate baseDate = LocalDate.now();
        applyInstallmentLogic(expense, dto, baseDate);

        return repository.save(expense);
    }

    public Expense updateExpense(UUID id, ExpenseRequestDTO dto, String userId, String coupleId) {
        Expense expense = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Gasto não encontrado"));

        if (!expense.getCoupleId().equals(coupleId)) {
            throw new AccessDeniedException("Acesso negado: este gasto pertence a outro casal");
        }

        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setVisibility(dto.getVisibility());
        expense.setExpenseType(dto.getExpenseType());

        LocalDate baseDate = expense.getCreatedAt() != null ? expense.getCreatedAt().toLocalDate() : LocalDate.now();
        applyInstallmentLogic(expense, dto, baseDate);

        return repository.save(expense);
    }

    public void deleteExpense(UUID id, String userId, String coupleId) {
        Expense expense = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Gasto não encontrado"));

        if (!expense.getCoupleId().equals(coupleId)) {
            throw new AccessDeniedException("Acesso negado: este gasto pertence a outro casal");
        }

        repository.delete(expense);
    }

    public List<Expense> getExpensesForMonth(int year, int month, String userId, String coupleId) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        LocalDate monthStart = yearMonth.atDay(1);

        return repository.findExpensesForCouple(coupleId, userId, startDate, endDate, monthStart);
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