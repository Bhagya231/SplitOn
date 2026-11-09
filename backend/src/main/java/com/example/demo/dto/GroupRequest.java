package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class GroupRequest
{

    @NotBlank(message = "name is required ")
    private String name;

    @NotBlank(message = "Expense title is required")
    private String description;

    @NotEmpty(message = "At least one group member is required")
    private Set<GroupMembersRequest> groupMembers;
}
