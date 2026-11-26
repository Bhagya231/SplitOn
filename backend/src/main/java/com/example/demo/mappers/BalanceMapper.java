package com.example.demo.mappers;

import com.example.demo.dto.MemberBalanceResponse;
import com.example.demo.entity.Members;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface BalanceMapper
{
    @Mapping(target = "memberId", source = "member.id")
    @Mapping(target = "memberName", source = "member.name")
    @Mapping(target = "email", source = "member.email")
    @Mapping(target = "phone", source = "member.phone")
    @Mapping(target = "totalPaid", source = "totalPaid")
    @Mapping(target = "totalShare", source = "totalShare")
    @Mapping(target = "netBalance", ignore = true)
    @Mapping(target = "balanceStatus", ignore = true)
    MemberBalanceResponse toMemberBalanceResponse(Members member, BigDecimal totalPaid, BigDecimal totalShare);
}
