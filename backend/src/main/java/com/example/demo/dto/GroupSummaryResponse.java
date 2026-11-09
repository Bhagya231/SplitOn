package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GroupSummaryResponse
{

    private Long totalExpenses;

    private BigDecimal totalAmount;

    private BigDecimal totalAmountPaid;

    private BigDecimal totalToReceive;

    private BigDecimal totalToPay;
}
