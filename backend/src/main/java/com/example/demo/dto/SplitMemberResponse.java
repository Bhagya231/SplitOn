package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class SplitMemberResponse
{
    private UUID id;

    private UUID memberId;

    private String memberName;

    private BigDecimal percentage;

    private BigDecimal value;
}
