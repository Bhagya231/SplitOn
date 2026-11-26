package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class MemberBalanceDetailsResponse
{
    private UUID memberId;

    private String memberName;

    private String email;

    private String phone;

    private BigDecimal totalPaid;

    private BigDecimal totalShare;

    private BigDecimal netBalance;

    private String balanceStatus;

    private List<BalanceRelationResponse> owesTo;

    private List<BalanceRelationResponse> owedBy;
}
