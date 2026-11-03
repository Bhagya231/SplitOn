package com.example.demo.mappers;

import com.example.demo.dto.MemberResponse;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.RegisterResponse;
import com.example.demo.entity.Members;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "Spring")
public interface MembersMapper
{

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Members toEntity(RegisterRequest request);

    @Mapping(target = "message", constant = "User registered successfully")
    @Mapping(target = "role", expression = "java(members.getRole())")
    @Mapping(target = "token", source = "token")
    RegisterResponse toRegisterResponse(Members members,String token);

    @Mapping(target = "message", constant = "Login successful")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "role", expression = "java(members.getRole())")
    LoginResponse toLoginResponse(Members members, String token);

    MemberResponse toResponse(Members members);

}
