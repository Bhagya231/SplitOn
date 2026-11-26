package com.example.demo.facade.impl;

import com.example.demo.dto.GroupBalanceResponse;
import com.example.demo.dto.MemberBalanceDetailsResponse;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.facade.api.BalanceFacade;
import com.example.demo.facade.api.MembersFacade;
import com.example.demo.repository.GroupMembersRepository;
import com.example.demo.repository.GroupsRepository;
import com.example.demo.repository.MembersRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.api.BalanceService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BalanceFacadeImpl implements BalanceFacade
{
    private static final Logger log = AppLogger.getLogger(BalanceFacadeImpl.class);

    private final MembersRepository membersRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final MembersFacade membersFacade;
    private final BalanceService balanceService;


    @Override
    public GroupBalanceResponse getGroupBalance(UUID groupId)
    {
        try {

            log.warn("getting balance in facade for the group  {}", groupId);
            Groups group = membersFacade.validateGroup(groupId);
            Members user = membersFacade.getLoggedInMember();
            checkMembersInGroup(user.getId(),groupId);

            return balanceService.getGroupBalance(group,user);


        }catch (BadRequestException e) {
            log.warn("Member details request failed: {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error while fetching member details", e);
            throw new BadRequestException("Unable to fetch member details");
        }


    }

    @Override
    public MemberBalanceDetailsResponse getMemberBalanceDetails(UUID groupId, UUID memberId)
    {
        try {
            log.warn("getting member {} balance details started in facade {} ", memberId,groupId);
            Groups group = membersFacade.validateGroup(groupId);
            Members member = validateMember(memberId);


            Members loggedInMember = membersFacade.getLoggedInMember();


            checkMembersInGroup(loggedInMember.getId(), groupId);

            checkMembersInGroup(memberId, groupId);


            return balanceService.getMemberBalanceDetails(group,member);

        }catch (BadRequestException e) {
            log.warn("error while getting the member balance request : {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error while fetching member balance details", e);
            throw new BadRequestException("Unable to fetch member balance details");
        }

    }

    private Members validateMember(UUID memberId)
    {
        if(memberId == null)
        {
            log.warn("member id is required {}",memberId);
            throw new BadRequestException("Member id is required");
        }

        return membersRepository.getMemberById(memberId.toString()) .orElseThrow(() -> {
            log.warn("member not found: {}", memberId);
            return new BadRequestException("Member not found");
        });
    }


    private void checkMembersInGroup( UUID userId, UUID groupId)
    {

        boolean members = groupMembersRepository.findActiveMembers(userId.toString(),groupId.toString()).isPresent();

        if(!members)
        {
            log.warn("Member {} is not belongs to this group {}", userId,groupId);
            throw new BadRequestException( "Member does not belong to this group");
        }
    }





}
