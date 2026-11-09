package com.example.demo.service.api;

import com.example.demo.dto.GroupRequest;
import com.example.demo.dto.GroupResponse;
import com.example.demo.dto.GroupUpdateRequest;
import com.example.demo.dto.MemberResponse;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface GroupsService
{
    List<GroupResponse> getGroupsByMemberId(Members member);

    GroupResponse createGroup(GroupRequest request, Members member,List<Members> groupMembers);

    GroupResponse getGroupById(Groups group, Members member);

    Page<GroupResponse> getAllGroups(String search, Pageable pageable, Members member);

    GroupResponse updateGroup(Groups group,GroupUpdateRequest request,Members loggedInMember);

    void addGroupMembers(Groups group,List<Members> groupMembers,Members loggedInMember);

    void removeGroupMember(Groups group,Members member, Members loggedInMember);

    Page<MemberResponse> getAvailableMembers(Groups group,Members loggedInMember,String search,Pageable pageable);

    Page<MemberResponse> getGroupMembers(Groups group, Members loggedInMember, String search, Pageable pageable);

    void deleteGroup(Groups group, Members member);
}
