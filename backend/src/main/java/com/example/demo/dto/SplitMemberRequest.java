package com.example.demo.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class SplitMemberRequest
{
    @NotNull(message = "Member ID is required")
    private UUID id;


    @DecimalMin(value = "0.00", message = "Amount cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Amount can have maximum 2 decimal places")
    private BigDecimal amount;


    @DecimalMin(value = "0.00", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.00", message = "Percentage cannot exceed 100")
    @Digits(integer = 3, fraction = 2, message = "Percentage can have maximum 2 decimal places")
    private BigDecimal percentage;
}
