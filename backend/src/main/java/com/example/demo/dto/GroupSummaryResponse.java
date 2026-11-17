package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GroupSummaryResponse
{

    private Long totalExpenses;

    private Long totalMembers;

    private Long totalExpenseCount;

    private String groupName;
}
