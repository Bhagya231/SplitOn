package com.example.demo.controller;


import com.example.demo.dto.GroupBalanceResponse;
import com.example.demo.dto.MemberBalanceDetailsResponse;
import com.example.demo.facade.api.BalanceFacade;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/groups/{groupId}/balance")
public class BalanceController
{

    private static final Logger log = AppLogger.getLogger(BalanceController.class);

    private final BalanceFacade balanceFacade;


    @GetMapping
    public ResponseEntity<GroupBalanceResponse> getGroupBalance(@PathVariable UUID groupId)
    {

        log.info("getting started group balance for group {}",groupId);

        GroupBalanceResponse response =  balanceFacade.getGroupBalance(groupId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<MemberBalanceDetailsResponse> getMemberBalanceDetails(@PathVariable UUID groupId, @PathVariable UUID memberId)
    {
        log.info("request reached the controller for the member {} balance details in this group {}",memberId,groupId);
        MemberBalanceDetailsResponse response = balanceFacade.getMemberBalanceDetails(groupId, memberId);

        return ResponseEntity.ok(response);
    }

}
