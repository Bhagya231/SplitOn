package com.example.demo.facade.api;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.RegisterResponse;

public interface AuthFacade
{

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
