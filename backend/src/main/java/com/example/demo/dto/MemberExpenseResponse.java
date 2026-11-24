package com.example.demo.dto;

import com.example.demo.enums.SplitType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class MemberExpenseResponse
{
    private UUID expenseId;
    private String title;
    private BigDecimal amount;

    private UUID paidBy;
    private String paidByName;

    private BigDecimal memberPercentage;
    private BigDecimal memberShare;

    private LocalDate date;
    private SplitType splitType;
}
