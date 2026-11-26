package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class GroupBalanceResponse
{
    private BigDecimal totalGroupExpenses;
    private Integer totalExpenseInGroup;
    private Integer totalGroupMembers;
    private BigDecimal myPaid;
    private BigDecimal myShare;
    private BigDecimal myNetBalance;
    private List<MemberBalanceResponse> membersWhoWillGetBack;
    private List<MemberBalanceResponse> membersWhoNeedToPay;
    private List<MemberBalanceResponse> settledMembers;

}
