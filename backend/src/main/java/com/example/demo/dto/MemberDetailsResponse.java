package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class MemberDetailsResponse
{
    private UUID memberId;
    private String memberName;
    private String email;
    private String phone;
    private LocalDateTime joinedAt;

    private BigDecimal totalPaid;
    private BigDecimal totalShare;
    private BigDecimal balance;
    private String status;

    private List<MemberExpenseResponse> expenses;
}
