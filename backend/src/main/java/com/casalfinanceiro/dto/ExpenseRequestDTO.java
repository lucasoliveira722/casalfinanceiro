package com.casalfinanceiro.dto;

import com.casalfinanceiro.domain.Expense;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ExpenseRequestDTO {

    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "O valor deve ser maior que zero")
    private BigDecimal amount;

    @NotNull
    private Expense.Visibility visibility;

    @NotNull
    private Expense.ExpenseType expenseType;

    // Novo campo numérico para as parcelas (substituiu a String antiga)
    @Min(value = 1, message = "O número de parcelas deve ser pelo menos 1")
    private Integer installments;
}