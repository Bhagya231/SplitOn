package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class GroupMembersRequest
{
    @NotNull(message = "Member ID is required")
    private UUID memberId;
}
