package com.example.demo.facade.api;

import com.example.demo.dto.GroupBalanceResponse;
import com.example.demo.dto.MemberBalanceDetailsResponse;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;

import java.util.UUID;

public interface BalanceFacade
{
    GroupBalanceResponse getGroupBalance(UUID groupId);
    MemberBalanceDetailsResponse getMemberBalanceDetails(UUID groupId, UUID memberId);
}
