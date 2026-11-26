package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class BalanceRelationResponse
{
    private UUID memberId;
    private String memberName;
    private String email;
    private String phone;
    private BigDecimal amount;
}
