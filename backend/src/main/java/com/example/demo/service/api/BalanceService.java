package com.example.demo.service.api;

import com.example.demo.dto.GroupBalanceResponse;
import com.example.demo.dto.MemberBalanceDetailsResponse;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;

public interface BalanceService
{
     GroupBalanceResponse getGroupBalance(Groups group, Members user);
    MemberBalanceDetailsResponse getMemberBalanceDetails(Groups group, Members member);
}
