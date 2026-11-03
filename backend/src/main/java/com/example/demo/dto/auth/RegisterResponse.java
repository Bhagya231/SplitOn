package com.example.demo.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RegisterResponse
{
    private String message;

    private UUID id;
    private String name;
    private String email;
    private String role;

    private String token;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
