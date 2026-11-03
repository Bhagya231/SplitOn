package com.example.demo.dto;

import com.example.demo.enums.SplitType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ExpensesResponse
{
    private UUID id;

    private String title;
    private BigDecimal amount;
    private LocalDate date;

    private UUID payerId;
    private String payerName;

    private SplitType splitType;

    private List<SplitMemberResponse> splitMembers;
}
