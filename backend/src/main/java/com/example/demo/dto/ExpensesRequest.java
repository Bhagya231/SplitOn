package com.example.demo.dto;

import com.example.demo.enums.SplitType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class ExpensesRequest
{
    @NotBlank(message = "Expense title is required")
    private String title;

    @NotNull(message = "Expense amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Expense date is required")
    @PastOrPresent(message = "Expense date cannot be in the future")
    private LocalDate date;

    @NotNull(message = "Payer is required")
    private UUID payerId;

    @NotNull(message = "Split type is required")
    private SplitType splitType;


    @NotEmpty(message = "At least one split member is required")
    private Set<SplitMemberRequest> splitMembers;

}
