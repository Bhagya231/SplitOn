package com.example.demo.facade.api;

import com.example.demo.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface GroupsFacade
{
    List<GroupResponse> getGroupsByMember();

    GroupResponse createGroup(GroupRequest request);

    GroupResponse getGroupById(UUID groupId);

    Page<GroupResponse> getAllGroups(String search, Pageable pageable);

    GroupResponse updateGroup(UUID groupId, GroupUpdateRequest request);

    void addGroupMembers(UUID groupId, Set<GroupMembersRequest> request);

    void removeGroupMember(UUID groupId, UUID memberId);

    Page<MemberResponse> getAvailableMembers(UUID groupId,String search,Pageable pageable);

    Page<MemberResponse> getGroupMembers(UUID groupId, String search,Pageable pageable);


    void deleteGroup(UUID groupId);
}
