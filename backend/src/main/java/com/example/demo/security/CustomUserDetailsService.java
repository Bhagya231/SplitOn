package com.example.demo.security;

import com.example.demo.entity.Members;
import com.example.demo.repository.MembersRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service

@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService
{

    private final MembersRepository membersRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException
    {
        Members members = membersRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("Username not found with email"));

        return new CustomUserDetails(members);
    }


}
