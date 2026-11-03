package com.example.demo.dto;

import com.example.demo.enums.BalanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class BalanceResponse
{
    private UUID memberId;

    private String memberName;

    private BigDecimal totalPaid;

    private BigDecimal totalShare;

    private BigDecimal balance;

    private BalanceStatus status;
}
