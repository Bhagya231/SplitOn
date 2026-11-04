package com.example.demo.security;

import com.example.demo.entity.Members;

import lombok.RequiredArgsConstructor;

import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@NullMarked
public class CustomUserDetails implements UserDetails
{

    private final Members members;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        return List.of(new SimpleGrantedAuthority("ROLE_" + members.getRole()));
    }

    @Override
    public String getUsername()
    {
        return members.getEmail();
    }

    @Override
    public String getPassword()
    {
        return members.getPassword();
    }

    public UUID getUserId() {
        return members.getId();
    }
}
