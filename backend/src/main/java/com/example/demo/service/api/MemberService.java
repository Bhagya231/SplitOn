package com.example.demo.service.api;

import com.example.demo.dto.MemberDetailsResponse;
import com.example.demo.dto.MemberRequest;
import com.example.demo.dto.MemberResponse;
import com.example.demo.entity.GroupMembers;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;


import java.util.List;
import java.util.UUID;


public interface MemberService
{
    MemberResponse addMembers(MemberRequest request);
    MemberResponse editMember(UUID id, MemberRequest request);
    List<MemberResponse> getAllMembers();
    void deleteMember(UUID id);

   // MemberDetailsResponse getMemberDetails(Groups group, GroupMembers user, GroupMembers selectedMember);
}
