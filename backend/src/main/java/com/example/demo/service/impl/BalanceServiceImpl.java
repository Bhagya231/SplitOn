package com.example.demo.service.impl;


import com.example.demo.dto.BalanceRelationResponse;
import com.example.demo.dto.GroupBalanceResponse;
import com.example.demo.dto.MemberBalanceDetailsResponse;
import com.example.demo.dto.MemberBalanceResponse;
import com.example.demo.entity.Expenses;
import com.example.demo.entity.GroupMembers;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import com.example.demo.mappers.BalanceMapper;
import com.example.demo.repository.ExpensesRepository;
import com.example.demo.repository.GroupMembersRepository;
import com.example.demo.repository.SplitMembersRepository;
import com.example.demo.service.api.BalanceService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService
{

    private static final Logger log = AppLogger.getLogger(BalanceServiceImpl.class);

    private final ExpensesRepository expensesRepository;
    private final SplitMembersRepository splitMembersRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final BalanceMapper balanceMapper;


    @Override
    public GroupBalanceResponse getGroupBalance(Groups group, Members user)
    {
        String groupId = group.getId().toString();

        BigDecimal totalGroupExpenses = expensesRepository.getTotalGroupExpenses(groupId);

        List<GroupMembers> groupMembers = groupMembersRepository.findActiveGroupMembers(groupId);

        List<Expenses> expenses = expensesRepository.getAllExpensesByGroupId(groupId);


        BigDecimal myPaid = BigDecimal.ZERO;
        BigDecimal myShare = BigDecimal.ZERO;

        GroupBalanceResponse response = new GroupBalanceResponse();

        response.setMembersWhoNeedToPay(new ArrayList<>());
        response.setMembersWhoWillGetBack(new ArrayList<>());
        response.setSettledMembers(new ArrayList<>());

        for(GroupMembers groupMember : groupMembers )
        {
            Members member = groupMember.getMember();
            String memberId = member.getId().toString();

            BigDecimal totalPaid = expensesRepository.getTotalPaidByMember(groupId, memberId);

            BigDecimal totalShare = splitMembersRepository.getTotalShareByMember(groupId, memberId);



            BigDecimal netBalance = totalPaid.subtract(totalShare);

            MemberBalanceResponse memberResponse = balanceMapper.toMemberBalanceResponse(member, totalPaid, totalShare);

            memberResponse.setNetBalance(netBalance);

            if (netBalance.compareTo(BigDecimal.ZERO) > 0)
            {
                memberResponse.setBalanceStatus("SHOULD RECEIVE");
                response.getMembersWhoWillGetBack().add(memberResponse);

            } else if (netBalance.compareTo(BigDecimal.ZERO) < 0)
            {

                memberResponse.setBalanceStatus("OWES");
                response.getMembersWhoNeedToPay().add(memberResponse);

            } else {

                memberResponse.setBalanceStatus("SETTLED");
                response.getSettledMembers().add(memberResponse);
            }

            if (member.getId().equals(user.getId()))
            {
                myPaid = totalPaid;
                myShare = totalShare;
            }


        }

        response.setTotalGroupExpenses(totalGroupExpenses);
        response.setTotalExpenseInGroup(expenses.size());
        response.setTotalGroupMembers(groupMembers.size());
        response.setMyPaid(myPaid);
        response.setMyShare(myShare);
        response.setMyNetBalance(myPaid.subtract(myShare));




        return response;
    }

    @Override
    public MemberBalanceDetailsResponse getMemberBalanceDetails(Groups group, Members member)
    {

        String groupId = group.getId().toString();
        String memberId = member.getId().toString();

        BigDecimal totalPaid = expensesRepository.getTotalPaidByMember(groupId, memberId);

        BigDecimal totalShare = splitMembersRepository.getTotalShareByMember(groupId, memberId);

        BigDecimal netBalanceOfUser = totalPaid.subtract(totalShare);

        List<GroupMembers> groupMembers = groupMembersRepository.findAllGroupMembers(groupId);

        List<BalanceRelationResponse> owesTo = new ArrayList<>();
        List<BalanceRelationResponse> owedBy = new ArrayList<>();

        for (GroupMembers groupMember : groupMembers)
        {

            Members otherMember = groupMember.getMember();

            String otherMemberId = otherMember.getId().toString();

            if (memberId.equals(otherMemberId))
            {
                continue;
            }

            BigDecimal totalPaidAmount = splitMembersRepository.getTotalPaidByMembers(groupId, memberId, otherMemberId);

            BigDecimal totalShareAmount = splitMembersRepository.getTotalPaidByMembers(groupId, otherMemberId, memberId);

            BigDecimal netBalance = totalPaidAmount.subtract(totalShareAmount);


            if (netBalance.compareTo(BigDecimal.ZERO) > 0)
            {

                BalanceRelationResponse relation = new BalanceRelationResponse();
                relation.setMemberId(otherMember.getId());
                relation.setMemberName(otherMember.getName());
                relation.setEmail(otherMember.getEmail());
                relation.setPhone(otherMember.getPhone());
                relation.setAmount(netBalance);

                owedBy.add(relation);

            } else if (netBalance.compareTo(BigDecimal.ZERO) < 0)
            {

                BalanceRelationResponse relation = new BalanceRelationResponse();
                relation.setMemberId(otherMember.getId());
                relation.setMemberName(otherMember.getName());
                relation.setEmail(otherMember.getEmail());
                relation.setPhone(otherMember.getPhone());
                relation.setAmount(netBalance.abs());

                owesTo.add(relation);
            }
        }

        MemberBalanceDetailsResponse response = new MemberBalanceDetailsResponse();

        response.setMemberId(member.getId());
        response.setMemberName(member.getName());
        response.setEmail(member.getEmail());
        response.setPhone(member.getPhone());
        response.setTotalPaid(totalPaid);
        response.setTotalShare(totalShare);
        response.setNetBalance(netBalanceOfUser);

        if (netBalanceOfUser.compareTo(BigDecimal.ZERO) > 0)
        {
            response.setBalanceStatus("SHOULD RECEIVE");

        } else if (netBalanceOfUser.compareTo(BigDecimal.ZERO) < 0)
        {
            response.setBalanceStatus("OWES");
        } else
        {
            response.setBalanceStatus("SETTLED");
        }

        response.setOwesTo(owesTo);
        response.setOwedBy(owedBy);

        return response;


    }

}
