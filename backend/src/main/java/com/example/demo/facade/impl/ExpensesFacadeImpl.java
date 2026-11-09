package com.example.demo.facade.impl;

import com.example.demo.dto.BalanceResponse;
import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.entity.Expenses;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.facade.api.ExpenseFacade;
import com.example.demo.repository.ExpensesRepository;
import com.example.demo.repository.GroupMembersRepository;
import com.example.demo.repository.GroupsRepository;
import com.example.demo.repository.MembersRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.api.ExpensesService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class ExpensesFacadeImpl implements ExpenseFacade
{

    private static final Logger log = AppLogger.getLogger(ExpensesFacadeImpl.class);

    private final ExpensesService expensesService;
    private final MembersRepository membersRepository;
    private final GroupsRepository groupsRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final ExpensesRepository expensesRepository;

    @Override
    public ExpensesResponse addExpenses(UUID groupId, ExpensesRequest request) {

        try {
            log.info("Add expense request received for group {}", groupId);


            Groups group = checkGroup(groupId);
            Members member = getLoggedInMember();

            checkGroupMembers(group, member);

            return expensesService.addExpenses(group, request);

        } catch (BadRequestException e)
        {
            log.warn("Unable to add expense: {}", e.getMessage());
            throw e;

        } catch (Exception e)
        {
            log.error("Error while adding expense for group {}: {}", groupId, e.getMessage(), e);
            throw new RuntimeException("Failed to add expense", e);
        }
    }

    @Override
    public Page<ExpensesResponse> getAllExpenses(UUID groupId, String search, Pageable pageable)
    {

        try {
            log.info("Fetching expenses for group {}", groupId);


            Groups group = checkGroup(groupId);
            Members member = getLoggedInMember();

            checkGroupMembers(group, member);

            return expensesService.getAllExpenses(group, search, pageable);

        } catch (BadRequestException e)
        {
            log.warn("Unable to fetch expenses: {}", e.getMessage());
            throw e;

        } catch (Exception e)
        {
            log.error("Error while fetching expenses for group {}: {}", groupId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch expenses", e);
        }
    }


    // Get Expense By ID
    @Override
    public ExpensesResponse getExpenseById(UUID groupId, UUID expenseId) {

        try {
            log.info("Fetching expense {} from group {}", expenseId, groupId);

            Groups group = checkGroup(groupId);
            Members member = getLoggedInMember();

            checkGroupMembers(group, member);

            Expenses expense = checkExpense(group, expenseId);

            return expensesService.getExpenseById(expense);

        } catch (BadRequestException e) {
            log.warn("Unable to fetch expense {}: {}", expenseId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error while fetching expense {}: {}",
                    expenseId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch expense", e);
        }
    }


    // Get All Balances
    @Override
    public List<BalanceResponse> getAllBalances(UUID groupId) {

        try {
            log.info("Fetching balances for group {}", groupId);

            Groups group = checkGroup(groupId);
            Members member = getLoggedInMember();

            checkGroupMembers(group, member);

            return expensesService.getAllBalances(group);

        } catch (BadRequestException e) {
            log.warn("Unable to fetch balances: {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error while fetching balances for group {}: {}",
                    groupId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch balances", e);
        }
    }



//    @Override
//    public GroupSummaryResponse getGroupSummary(UUID groupId) {
//
//        try {
//            log.info("Fetching group summary for group {}", groupId);
//
//            Groups group = checkGroup(groupId);
//            Members member = getLoggedInMember();
//
//            checkGroupMembership(group, member);
//
//            return expensesService.getGroupSummary(group, member);
//
//        } catch (BadRequestException e) {
//            log.warn("Unable to fetch group summary: {}", e.getMessage());
//            throw e;
//
//        } catch (Exception e) {
//            log.error("Error while fetching group summary for group {}: {}",
//                    groupId, e.getMessage(), e);
//            throw new RuntimeException("Failed to fetch group summary", e);
//        }
//    }



    @Override
    public ExpensesResponse editExpense(UUID groupId, UUID expenseId, ExpensesRequest request)
    {

        try {
            log.info("Edit expense request received for expense {}", expenseId);



            Groups group = checkGroup(groupId);
            Members member = getLoggedInMember();

            checkGroupMembers(group, member);

            Expenses expense = checkExpense(group, expenseId);

            return expensesService.editExpense(expense, request);

        } catch (BadRequestException e)
        {
            log.warn("Unable to edit expense {}: {}", expenseId, e.getMessage());
            throw e;

        } catch (Exception e)
        {
            log.error("Error while editing expense {}: {}", expenseId, e.getMessage(), e);
            throw new RuntimeException("Failed to edit expense", e);
        }
    }

    public BigDecimal getTotalSpending(UUID groupID)
    {

        log.info("fetching the total amount spent request reached facade layer");

        Groups group = checkGroup(groupID);
        return expensesService.getTotalSpending(group);

    }



    @Override
    public void deleteExpense(UUID groupId, UUID expenseId) {

        try {
            log.info("Delete expense request received for expense {}", expenseId);

            Groups group = checkGroup(groupId);
            Members member = getLoggedInMember();

            checkGroupMembers(group, member);

            Expenses expense = checkExpense(group, expenseId);

            expensesService.deleteExpense(expense);

            log.info("Expense {} deleted successfully", expenseId);

        } catch (BadRequestException e) {
            log.warn("Unable to delete expense {}: {}", expenseId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error while deleting expense {}: {}", expenseId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete expense", e);
        }


    }





    private Members getLoggedInMember()
    {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null )
            {
                log.warn("member is not authenticated ");
                throw new BadRequestException("member is not authenticated");
            }

            if (!(authentication.getPrincipal() instanceof CustomUserDetails userDetails))
            {
                throw new BadRequestException("Invalid authenticated user");
            }

            UUID memberId = userDetails.getUserId();

            return membersRepository.getMemberById(memberId.toString())
                    .orElseThrow(() -> new BadRequestException("Logged-in member not found"));


    }


    private Groups checkGroup(UUID groupId)
    {

            if (groupId == null)
            {
                log.warn("Group ID is required ");
                throw new BadRequestException("Group ID is required");
            }

            return groupsRepository.findActiveGroupById(groupId.toString())
                    .orElseThrow(() -> new BadRequestException("Group not found"));

    }


    private void checkGroupMembers(Groups group, Members member)
    {
        if (group == null || member == null)
        {
            throw new BadRequestException("Group and member are required");
        }

        boolean isMember = groupMembersRepository.findActiveMembers(member.getId().toString(), group.getId().toString()).isPresent();

        if (!isMember)
        {
            throw new BadRequestException("You are not a member of this group");
        }


    }


    private Expenses checkExpense(Groups group, UUID expenseId)
    {

        if (group == null)
        {
            throw new BadRequestException("Group is required");
        }

        if (expenseId == null)
        {
            throw new BadRequestException("Expense ID is required");
        }

        Expenses expense = expensesRepository.getActiveExpenseByIdAndGroupId(expenseId.toString(),group.getId().toString()  )
                .orElseThrow(() ->
                        new BadRequestException("Expense not found"));

        if (expense.getExpense_groups() == null || !expense.getExpense_groups().getId().equals(group.getId())) {

            throw new BadRequestException("Expense does not belong to this group");
        }

        return expense;

    }

}


