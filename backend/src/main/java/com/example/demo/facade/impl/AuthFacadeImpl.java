package com.example.demo.facade.impl;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.RegisterResponse;
import com.example.demo.entity.Members;
import com.example.demo.facade.api.AuthFacade;
import com.example.demo.repository.MembersRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.api.AuthService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuthFacadeImpl implements AuthFacade
{

    private static final Logger log = AppLogger.getLogger(AuthFacadeImpl.class);

    private final AuthService authService;
    private final MembersRepository membersRepository;

    @Override
    public RegisterResponse register(RegisterRequest request)
    {
        log.info("Registration request received for email {} ", request.getEmail());

        try {
            RegisterResponse response = authService.register(request);
            log.info("Registration request completed successfully for email {}  ", request.getEmail());

            return response;
        }catch(Exception e)
        {
            log.error(" Registration request failed for email {} ", request.getEmail());
            throw e;
        }
    }

    @Override
    public LoginResponse login(LoginRequest request)
    {
        log.info(" Login request received for email {}  ", request.getEmail());

        try {
            LoginResponse response = authService.login(request);
            log.info(" Login request completed for email {} ", request.getEmail());

            return  response;
        }catch (Exception e)
        {
            log.error("Login request failed for email {} ", request.getEmail());
            throw e;
        }
    }


    @Override
    public void logout()
    {
        log.info("logout request reached facade layer ");

            authService.logout();



    }


}
