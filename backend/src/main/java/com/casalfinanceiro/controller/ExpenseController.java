package com.casalfinanceiro.controller;

import com.casalfinanceiro.domain.Expense;
import com.casalfinanceiro.dto.ExpenseRequestDTO;
import com.casalfinanceiro.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(required = false) Integer month) {

        // Se o frontend enviou o mês e o ano, chama o filtro inteligente
        if (year != null && month != null) {
            return ResponseEntity.ok(service.getExpensesForMonth(year, month));
        }

        // Se não enviou nada, traz tudo (Comportamento antigo)
        return ResponseEntity.ok(service.getAllExpenses());
    }
    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody ExpenseRequestDTO dto) {
        // Simulando um usuário logado por enquanto
        String dummyUserId = "user-123";
        Expense savedExpense = service.createExpense(dto, dummyUserId);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
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