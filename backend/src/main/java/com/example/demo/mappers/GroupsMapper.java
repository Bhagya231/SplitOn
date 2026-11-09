package com.example.demo.mappers;

import com.example.demo.dto.GroupMembersResponse;
import com.example.demo.dto.GroupResponse;
import com.example.demo.entity.GroupMembers;
import com.example.demo.entity.Groups;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupsMapper
{

    @Mapping(source = "createdBy.id", target = "createdBy")
    GroupResponse toResponse(Groups groups);

    @Mapping(source = "member.id", target = "memberId")
    @Mapping(source = "member.name", target = "memberName")
    @Mapping(source = "member.email", target = "email")
    GroupMembersResponse toResponse(GroupMembers groupMembers);
}
