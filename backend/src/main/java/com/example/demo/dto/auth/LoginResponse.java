package com.example.demo.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class LoginResponse
{

    private String message;

    private String token;

    private UUID id;
    private String name;
    private String email;

    private String role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
