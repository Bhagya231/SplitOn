package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupUpdateRequest
{
    @NotBlank(message = "Group name is required")
    private String name;

    private String description;
}
