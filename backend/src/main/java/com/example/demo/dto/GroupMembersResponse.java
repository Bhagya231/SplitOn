package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class GroupMembersResponse
{
    private UUID id;

    private UUID memberId;

    private String memberName;

    private String email;
}
