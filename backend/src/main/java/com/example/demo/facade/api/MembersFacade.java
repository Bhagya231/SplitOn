package com.example.demo.facade.api;

import com.example.demo.dto.MemberRequest;
import com.example.demo.dto.MemberResponse;

import java.util.List;
import java.util.UUID;

public interface MembersFacade
{
    MemberResponse addMembers(MemberRequest request);
    MemberResponse editMember(UUID id, MemberRequest request);
    List<MemberResponse> getAllMembers();
    void deleteMember(UUID id);
}
