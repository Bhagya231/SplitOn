package com.example.demo.service.impl;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.RegisterResponse;
import com.example.demo.entity.Members;
import com.example.demo.enums.LoginStatus;
import com.example.demo.exceptions.EmailAlreadyExistsException;
import com.example.demo.exceptions.InvalidCredentialsException;
import com.example.demo.mappers.MembersMapper;
import com.example.demo.repository.MembersRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.security.JwtUtils;
import com.example.demo.service.api.AuthService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService
{

    private static final Logger log = AppLogger.getLogger(AuthServiceImpl.class);

    private final MembersRepository membersRepository;
    private final PasswordEncoder passwordEncoder;
    private final MembersMapper membersMapper;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;



    @Override
    public RegisterResponse register(RegisterRequest request)
    {
        log.info("Registration started for email: {}", request.getEmail());

        try {
            if (membersRepository.existByEmail(request.getEmail()) > 0)
            {
                log.warn("Registration failed. Email already exists  {}",request.getEmail() );
                throw new EmailAlreadyExistsException("Email already exists");
            }
            Members member = membersMapper.toEntity(request);

            member.setPassword(passwordEncoder.encode(request.getPassword()));

            member.setRole("ADMIN");


            Members  savedMember = membersRepository.save(member);

            CustomUserDetails userDetails = new CustomUserDetails(savedMember);

            // Generate JWT
            String token = jwtUtils.generateToken(userDetails);

            RegisterResponse response = membersMapper.toRegisterResponse(savedMember,token);

            log.info("Patient registered successfully. User ID: {} ", savedMember.getId());


            return response;

        }catch (EmailAlreadyExistsException e)
        {
            log.error("email already existed error {} in register method ",e.getMessage());
            throw e;
        }
        catch (Exception e) {

            log.error("Unexpected error {} during registration for email {} ", e.getMessage(), request.getEmail() );

            throw new RuntimeException("Unable to register members",e);
        }
    }


    @Override
    public LoginResponse login(LoginRequest request)
    {
        log.info("Login attempt for email {} " , request.getEmail());

        try{

            // This single line securely checks both the email and the hashed password.
            // If the password is wrong, it automatically throws a BadCredentialsException.
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            Members members = membersRepository.findByEmail(request.getEmail()).orElseThrow(() -> {
                log.warn("Login failed. User not found for email {} ", request.getEmail());
                return new InvalidCredentialsException("user not register with this email");
            });

            members.setLoginStatus(LoginStatus.LOGGED_IN);
            membersRepository.save(members);


            CustomUserDetails userDetails = new CustomUserDetails(members);


            String token = jwtUtils.generateToken(userDetails);


            return membersMapper.toLoginResponse(members, token);

        }catch (BadCredentialsException e)
        {
            log.warn("Login failed. Invalid password for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid password try again");
        } catch (InvalidCredentialsException e)
        {
            log.warn("Login failed. members is not register with this email {} ",request.getEmail());
            throw e;

        } catch (Exception e) {

            log.error("Unexpected error during login for email: {}", request.getEmail(), e);

            throw new RuntimeException("Unable to login");
        }
    }


    @Override
    @Transactional
    public void logout()
    {

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        UUID id = userDetails.getUserId();

        log.info("Logout started for user ID {}", id);

        try {
            Members members = membersRepository.getMemberById(id.toString())
                    .orElseThrow(() -> {
                        log.warn("member  not found with id {}",id);
                        return new UsernameNotFoundException("member  not found");
                    });

            members.setLastLogout(LocalDateTime.now());
            members.setLoginStatus(LoginStatus.LOGGED_OUT);
            membersRepository.save(members);


            log.info("Logout completed successfully for user ID {}", id);



        } catch (UsernameNotFoundException e) {
            log.warn("Logout failed: user not found with ID {}", id);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during logout for user ID {}", id, e);
            throw new RuntimeException("Unable to logout", e);
        }
    }






}
