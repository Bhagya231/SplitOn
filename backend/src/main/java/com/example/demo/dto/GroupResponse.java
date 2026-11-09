package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class GroupResponse
{
    private UUID id;

    private String name;

    private String description;

    private UUID createdBy;

    private LocalDateTime createdAt;

    private List<GroupMembersResponse> groupMembers;
}
