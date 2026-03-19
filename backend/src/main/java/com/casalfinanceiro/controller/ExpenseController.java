package com.casalfinanceiro.controller;

import com.casalfinanceiro.domain.Expense;
import com.casalfinanceiro.dto.ExpenseRequestDTO;
import com.casalfinanceiro.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> listAll(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @AuthenticationPrincipal Jwt jwt) { // Pega o crachá

        String userId = jwt.getSubject();
        String coupleId = jwt.getClaimAsString("custom:couple_id");

        int resolvedYear = year != null ? year : java.time.LocalDate.now().getYear();
        int resolvedMonth = month != null ? month : java.time.LocalDate.now().getMonthValue();

        return ResponseEntity.ok(service.getExpensesForMonth(resolvedYear, resolvedMonth, userId, coupleId));
    }
    @PostMapping
    public ResponseEntity<Expense> create(
            @RequestBody @Valid ExpenseRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) { // Pega o crachá

        // Extrai as informações de dentro do Token da AWS
        String userId = jwt.getSubject();
        String coupleId = jwt.getClaimAsString("custom:couple_id");

        return ResponseEntity.ok(service.createExpense(dto, userId, coupleId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(
            @PathVariable UUID id,
            @Valid @RequestBody ExpenseRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        String coupleId = jwt.getClaimAsString("custom:couple_id");
        Expense updatedExpense = service.updateExpense(id, dto, userId, coupleId);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        String coupleId = jwt.getClaimAsString("custom:couple_id");
        service.deleteExpense(id, userId, coupleId);
        return ResponseEntity.noContent().build();
    }
}