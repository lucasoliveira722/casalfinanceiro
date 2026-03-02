package com.casalfinanceiro.controller;

import com.casalfinanceiro.domain.Expense;
import com.casalfinanceiro.dto.ExpenseRequestDTO;
import com.casalfinanceiro.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
// TODO: Em produção configuraremos CORS com precisão, isso permite chamadas do React Native local
@CrossOrigin(origins = "*")
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

        if (year != null && month != null) {
            return ResponseEntity.ok(service.getExpensesForMonth(year, month, userId, coupleId));
        }

        // Se quiser manter o listAll genérico, lembre de criar um método no repository filtrando apenas por coupleId
        return ResponseEntity.ok(service.getAllExpenses());
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
    public ResponseEntity<Expense> update(@PathVariable UUID id, @Valid @RequestBody ExpenseRequestDTO dto) {
        Expense updatedExpense = service.updateExpense(id, dto);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build(); // Retorna 204 (Sem conteúdo) indicando sucesso
    }
}