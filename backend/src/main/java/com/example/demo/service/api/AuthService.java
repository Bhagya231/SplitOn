package com.example.demo.service.api;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.RegisterResponse;
import com.example.demo.entity.Members;

public interface AuthService
{
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
    void logout();
}
