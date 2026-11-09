package com.example.demo.service.impl;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.enums.BalanceStatus;
import com.example.demo.enums.SplitType;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.mappers.ExpensesMapper;
import com.example.demo.repository.ExpensesRepository;
import com.example.demo.repository.GroupMembersRepository;
import com.example.demo.repository.SplitMembersRepository;
import com.example.demo.service.api.ExpensesService;
import com.example.demo.util.AppLogger;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ExpensesServiceImpl implements ExpensesService
{

    private static final Logger log = AppLogger.getLogger(ExpensesServiceImpl.class);

    private final ExpensesRepository expensesRepository;
    private final SplitMembersRepository splitMembersRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final ExpensesMapper expensesMapper;



    @Override
    @Transactional
    public ExpensesResponse addExpenses(Groups group, ExpensesRequest request)
    {

        try {
            log.info("Started adding expense: {}", request.getTitle());


            validateSplitRequests(request);

            UUID payerId = request.getPayerId();

            Map<UUID, Members> memberMap = getActiveMembersMap(request.getSplitMembers(), payerId, group);

            Members payer = memberMap.get(payerId);

            if (payer == null)
            {
                log.warn("payer must be an active member of this group {}",payerId);
                throw new BadRequestException("Payer must be an active member of this group");
            }

            Map<UUID, BigDecimal> shares = calculateShares(request.getSplitMembers(), request.getAmount(), request.getSplitType(), payerId);



            Expenses expense = new Expenses();

            expense.setTitle(request.getTitle().trim());
            expense.setAmount(request.getAmount());
            expense.setDate(request.getDate());
            expense.setPayer(payer);
            expense.setSplitType(request.getSplitType());
            expense.setExpense_groups(group);


            Expenses savedExpense = expensesRepository.save(expense);


            List<SplitMembers> splitMembers = new ArrayList<>();

            for (SplitMemberRequest splitRequest : request.getSplitMembers())
            {

                UUID memberId = splitRequest.getId();
                Members member = memberMap.get(memberId);

                SplitMembers splitMember = new SplitMembers();

                splitMember.setExpenses(savedExpense);
                splitMember.setMembers(member);
                splitMember.setPercentage(SplitType.PERCENTAGE.equals(request.getSplitType()) ? splitRequest.getPercentage() : null);
                splitMember.setValue(shares.get(memberId));

                splitMembers.add(splitMember);


            }


            List<SplitMembers> savedSplits = splitMembersRepository.saveAll(splitMembers);

            savedExpense.setSplitMembers(savedSplits);

            log.info("Expense created successfully for group {}", group.getId());

            return expensesMapper.toResponse(savedExpense);

        }catch (IllegalArgumentException e)
        {
            log.error("error while adding the expense {} {}",request.getTitle(),e.getMessage());
            throw e;
        } catch (BadRequestException e)
        {
            log.error("unexpected error while adding the expenses {} {}",request.getTitle(),e.getMessage());
            throw new BadRequestException(e.getMessage());
        }


    }







    @Override
    public Page<ExpensesResponse> getAllExpenses(Groups group, String search, Pageable pageable)
    {
        log.info("Started fetching all expenses");

        try {

            Page<Expenses> expensesPage = expensesRepository.getAllExpensesByGroupId(group.getId().toString(), search, pageable);

            return expensesPage.map(expense -> {
                            expense.setSplitMembers(splitMembersRepository.getSplitMembersByExpenseId(expense.getId().toString()));

                return expensesMapper.toResponse(expense);
            });

        } catch (Exception e) {
            log.error("Error while fetching expenses", e);
            throw new RuntimeException("Error while fetching expenses", e);
        }
    }


    @Override
    public ExpensesResponse getExpenseById(Expenses expense)
    {
        try {
            log.info("Started fetching expense by ID {}",expense.getId());



            List<SplitMembers> activeSplits = splitMembersRepository.getSplitMembersByExpenseId(expense.getId().toString());

            expense.setSplitMembers(activeSplits);

            log.info("Expense fetched successfully with ID: {}", expense.getId());

            return expensesMapper.toResponse(expense);


        } catch (Exception e) {
            log.error("Error while fetching expense: {}", e.getMessage(), e);
            throw new RuntimeException(
                    "Error while fetching expense by ID", e);
        }
    }

    @Override
    public List<BalanceResponse> getAllBalances(Groups group)
    {

        log.info("Fetching group balances");

        try {

            String groupId = group.getId().toString();

            List<GroupMembers> groupMembers = groupMembersRepository.findActiveMembersByGroupId(groupId);

            List<Expenses> expenses = expensesRepository.getAllExpensesByGroupId(groupId);

            Map<UUID, BigDecimal> totalPaid = new HashMap<>();
            Map<UUID, BigDecimal> totalShare = new HashMap<>();


            for (GroupMembers groupMember : groupMembers)
            {
                UUID memberId = groupMember.getMember().getId();

                totalPaid.put(memberId, BigDecimal.ZERO);
                totalShare.put(memberId, BigDecimal.ZERO);
            }

            for (Expenses expense : expenses)
            {

                UUID payerId = expense.getPayer().getId();

                BigDecimal oldPaid = totalPaid.get(payerId);

                BigDecimal newPaid = oldPaid.add(expense.getAmount());

                totalPaid.put(payerId, newPaid);



                List<SplitMembers> splits = splitMembersRepository.getSplitMembersByExpenseId(expense.getId().toString());


                for (SplitMembers split : splits)
                {

                    UUID memberId = split.getMembers().getId();

                    BigDecimal oldShare = totalShare.get(memberId);

                    BigDecimal newShare = oldShare.add(split.getValue());

                    totalShare.put(memberId, newShare);
                }
            }


            List<BalanceResponse> responses = new ArrayList<>();

            for (GroupMembers groupMember : groupMembers)
            {

                Members member = groupMember.getMember();

                UUID memberId = member.getId();

                BigDecimal paid = totalPaid.get(memberId);
                BigDecimal share = totalShare.get(memberId);


                BigDecimal balance = paid.subtract(share);

                BalanceResponse response = new BalanceResponse();

                response.setMemberId(memberId);
                response.setMemberName(member.getName());
                response.setTotalPaid(paid);
                response.setTotalShare(share);
                response.setBalance(balance);


                if (balance.compareTo(BigDecimal.ZERO) > 0)
                {
                    response.setStatus(BalanceStatus.SHOULD_RECEIVE);
                }
                else if (balance.compareTo(BigDecimal.ZERO) < 0)
                {
                    response.setStatus(BalanceStatus.OWES);
                }
                else {
                    response.setStatus(BalanceStatus.SETTLED);
                }

                responses.add(response);
            }

            return responses;

        } catch (Exception e)
        {
            log.error("Error while fetching group balances", e);
            throw new BadRequestException( e.getMessage());
        }
    }




    @Override
    public BigDecimal getTotalSpending(Groups group)
    {

        try {
            log.info("Started calculating total spending");

            List<Expenses> expenses = expensesRepository.getAllExpensesByGroupId(group.getId().toString());

            BigDecimal totalSpending = BigDecimal.ZERO;

            for (Expenses expense : expenses)
            {
                totalSpending = totalSpending.add(expense.getAmount());
            }

            log.info(" calculated total expenses Successfully: {}", totalSpending);

            return totalSpending;
        }catch (Exception e)
        {
            log.error("error while getting the total spending amount {} ",e.getMessage() );
            throw new RuntimeException("error while getting the getting total amount spending ",e);

        }

    }

    @Override
    @Transactional
    public void deleteExpense(Expenses expense)
    {
        try {
            log.info("started deleting the expense: {}", expense.getId());



            List<SplitMembers> splitMembers = splitMembersRepository.getSplitMembersByExpenseId(expense.getId().toString());



            for (SplitMembers splitMember : splitMembers)
            {
                splitMember.setIsDeleted(true);
            }

            splitMembersRepository.saveAll(splitMembers);

            expense.setIsDeleted(true);
            expensesRepository.save(expense);

            log.info(" deleting Expense completed successfully: {}", expense.getId());

        } catch (IllegalArgumentException e) {
            log.warn("Unable to delete expense {}: {}", expense.getId(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error while deleting expense {}: {}", expense.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to delete expense", e);
        }

    }



    @Override
    @Transactional
    public ExpensesResponse editExpense(Expenses expense, ExpensesRequest request)
    {

        log.info("Started updating expense: {}", expense.getId());


        validateSplitRequests(request);

        Groups group = expense.getExpense_groups();
        UUID payerId = request.getPayerId();

        Map<UUID, Members> memberMap = getActiveMembersMap(request.getSplitMembers(), payerId, group);


        Members payer = memberMap.get(payerId);

        if (payer == null)
        {
            throw new BadRequestException("Payer must be an active member of this group");
        }


        Map<UUID, BigDecimal> shares = calculateShares(request.getSplitMembers(), request.getAmount(), request.getSplitType(), payerId);


        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setPayer(payer);
        expense.setSplitType(request.getSplitType());

        Expenses savedExpense = expensesRepository.save(expense);


        List<SplitMembers> existingSplits = splitMembersRepository.getSplitMembersByExpenseId(expense.getId().toString());

        Map<UUID, SplitMembers> existingSplitMap = new HashMap<>();

        for (SplitMembers split : existingSplits)
        {
            existingSplitMap.putIfAbsent(split.getMembers().getId(), split);
        }

        Set<UUID> requestedMemberIds = new HashSet<>();

        List<SplitMembers> updatedSplits = new ArrayList<>();


        for (SplitMemberRequest memberRequest : request.getSplitMembers())
        {

            UUID memberId = memberRequest.getId();
            requestedMemberIds.add(memberId);

            SplitMembers splitMember = existingSplitMap.get(memberId);

            if (splitMember == null)
            {
                splitMember = new SplitMembers();
            }

            splitMember.setExpenses(savedExpense);
            splitMember.setMembers(memberMap.get(memberId));

            splitMember.setPercentage(SplitType.PERCENTAGE.equals(request.getSplitType()) ? memberRequest.getPercentage() : null);

            splitMember.setValue(shares.get(memberId));
            splitMember.setIsDeleted(false);

            updatedSplits.add(splitMember);
        }


        List<SplitMembers> removedSplits = new ArrayList<>();

        for (SplitMembers oldSplit : existingSplits)
        {

            UUID memberId = oldSplit.getMembers().getId();

            if (!requestedMemberIds.contains(memberId))
            {
                oldSplit.setIsDeleted(true);
                removedSplits.add(oldSplit);
            }
        }

        List<SplitMembers> savedUpdatedSplits = splitMembersRepository.saveAll(updatedSplits);

        if (!removedSplits.isEmpty())
        {
            splitMembersRepository.saveAll(removedSplits);
        }

        ExpensesResponse response = expensesMapper.toResponse(savedExpense);

        response.setSplitMembers(savedUpdatedSplits.stream().map(expensesMapper::toSplitMemberResponse).toList());

        log.info("Expense updated successfully: {}", savedExpense.getId());

        return response;
    }






    private void validateSplitRequests(ExpensesRequest request)
    {

        if (request.getSplitMembers() == null || request.getSplitMembers().isEmpty())
        {
            log.warn("At least one split member is required {} ",request.getSplitMembers());
            throw new BadRequestException("At least one split member is required");
        }

        Set<UUID> memberIds = new HashSet<>();

        for (SplitMemberRequest split : request.getSplitMembers())
        {

            if (split.getId() == null)
            {
                log.warn("split member ID is required {}",split);
                throw new BadRequestException("Split member ID is required");
            }

            if (!memberIds.add(split.getId()))
            {
                log.warn("Duplicate split members are not allowed {}",split.getId());
                throw new BadRequestException("Duplicate split members are not allowed");
            }
        }
    }



    private Map<UUID, Members> getActiveMembersMap(Set<SplitMemberRequest> splitRequests, UUID payerId, Groups group)
    {

        Set<String> memberIds = splitRequests.stream().map(split -> split.getId().toString())
                .collect(Collectors.toSet());

        memberIds.add(payerId.toString());

        List<Members> activeMembers = groupMembersRepository.findActiveMembersByIdsAndGroupId(memberIds, group.getId().toString());

        Map<UUID, Members> memberMap = activeMembers.stream().collect(Collectors.toMap(Members::getId, member -> member));

        if (memberMap.size() != memberIds.size())
        {
            throw new BadRequestException("Payer and all split members must belong to this group");
        }

        return memberMap;
    }


    private Map<UUID, BigDecimal> calculateShares(Set<SplitMemberRequest> splitRequests,BigDecimal amount,SplitType splitType, UUID payerId)
     {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
        {
            throw new BadRequestException("Expense amount must be greater than zero");
        }

        if (amount.scale() > 2)
        {
            throw new BadRequestException("Expense amount cannot have more than 2 decimal places");
        }

        Map<UUID, BigDecimal> shares = new LinkedHashMap<>();

        BigDecimal totalAmount = amount.setScale(2, RoundingMode.HALF_UP);

        if (splitType == SplitType.EQUAL)
        {

            BigDecimal equalShare = totalAmount.divide(BigDecimal.valueOf(splitRequests.size()), 2, RoundingMode.DOWN);

            for (SplitMemberRequest split : splitRequests)
            {
                shares.put(split.getId(), equalShare);
            }

        } else if (splitType == SplitType.PERCENTAGE)
        {

            validatePercentages(splitRequests);

            for (SplitMemberRequest split : splitRequests)
            {

                BigDecimal percentage = split.getPercentage();

                BigDecimal share = totalAmount.multiply(percentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.DOWN);

                shares.put(split.getId(), share);
            }

        } else {
            throw new BadRequestException("Invalid split type");
        }


        BigDecimal calculatedTotal = shares.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal difference = totalAmount.subtract(calculatedTotal);

        if (difference.compareTo(BigDecimal.ZERO) != 0)
        {

            UUID adjustmentMember = shares.containsKey(payerId) ? payerId : shares.keySet().iterator().next();

            shares.put(adjustmentMember, shares.get(adjustmentMember).add(difference));
        }

        return shares;
    }



    private void validatePercentages(Set<SplitMemberRequest> splitRequests)
    {

        BigDecimal totalPercentage = BigDecimal.ZERO;

        for (SplitMemberRequest split : splitRequests)
        {

            BigDecimal percentage = split.getPercentage();

            if (percentage == null || percentage.compareTo(BigDecimal.ZERO) < 0 || percentage.compareTo(BigDecimal.valueOf(100)) > 0)
            {

                throw new BadRequestException("Percentage must be between 0 and 100");
            }

            totalPercentage = totalPercentage.add(percentage);
        }

        if (totalPercentage.compareTo(BigDecimal.valueOf(100)) != 0)
        {
            throw new BadRequestException("Total split percentage must be exactly 100");
        }
    }











}
