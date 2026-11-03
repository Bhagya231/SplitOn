package com.example.demo.mappers;

import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.dto.SplitMemberResponse;
import com.example.demo.entity.Expenses;

import com.example.demo.entity.SplitMembers;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExpensesMapper
{



    @Mapping( target = "payerName",ignore = true)
    ExpensesResponse toResponse(Expenses expenses);


    @Mapping(source = "members.id", target = "memberId")
    @Mapping(source = "members.name", target = "memberName")
    SplitMemberResponse toSplitMemberResponse(SplitMembers splitMember);

}
