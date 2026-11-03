package com.example.demo.service.impl;

import com.example.demo.dto.*;
import com.example.demo.entity.Expenses;
import com.example.demo.entity.Members;
import com.example.demo.entity.SplitMembers;
import com.example.demo.enums.BalanceStatus;
import com.example.demo.enums.SplitType;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.repository.ExpensesRepository;
import com.example.demo.repository.MembersRepository;
import com.example.demo.repository.SplitMembersRepository;
import com.example.demo.service.api.ExpensesService;
import com.example.demo.util.AppLogger;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;

@Service
@RequiredArgsConstructor
public class ExpensesServiceImpl implements ExpensesService
{

    private static final Logger log = AppLogger.getLogger(ExpensesServiceImpl.class);

    private final ExpensesRepository expensesRepository;
    private  final SplitMembersRepository splitMembersRepository;
    private final MembersRepository membersRepository;



    @Transactional
    @Override
    public ExpensesResponse addExpenses(ExpensesRequest request)
    {

        try {
            log.info("Started adding expense: {}", request.getTitle());


            List<SplitMemberRequest> req = validateSplitRequests(request);

            // Get active participant details.
            Map<UUID, Members> memberMap = getActiveMembersMap(req);

            //  Get payer independently.
            Members payer = getPayer(request.getPayerId(), memberMap);

            // Calculate participant shares.
            Map<UUID, BigDecimal> shares = calculateShares(req, request.getAmount(), request.getSplitType(), payer.getId());

            //  Create expense.
            Expenses expense = new Expenses();

            expense.setTitle(request.getTitle().trim());
            expense.setAmount(request.getAmount());
            expense.setDate(request.getDate());
            expense.setPayerId(payer.getId());
            expense.setSplitType(request.getSplitType());


            Expenses savedExpense = expensesRepository.save(expense);


            List<SplitMembers> splitMembers = new ArrayList<>();

            for (SplitMemberRequest memberRequest : req) {

                SplitMembers splitMember = new SplitMembers();

                splitMember.setExpenses(savedExpense);

                splitMember.setMembers(memberMap.get(memberRequest.getId()));


                splitMember.setPercentage(SplitType.PERCENTAGE.equals(request.getSplitType()) ? memberRequest.getPercentage() : null);


                splitMember.setValue(shares.get(memberRequest.getId()));



                splitMembers.add(splitMember);
            }


            List<SplitMembers> savedSplits = splitMembersRepository.saveAll(splitMembers);

            log.info("Expense created successfully: {}", savedExpense.getId());

            return toResponse(savedExpense,savedSplits,payer.getName());
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







    public ExpensesResponse toResponse(Expenses expenses, List<SplitMembers> splitMembers,String payerName)
    {

        ExpensesResponse response = new ExpensesResponse();



        response.setId(expenses.getId());
        response.setTitle(expenses.getTitle());
        response.setAmount(expenses.getAmount());
        response.setDate(expenses.getDate());
        response.setPayerId(expenses.getPayerId());
        response.setPayerName(payerName);
        response.setSplitType(expenses.getSplitType());


        List<SplitMemberResponse> splitResponses = createSplitResponses(splitMembers);


        response.setSplitMembers(splitResponses);

        return response;

    }

    private  List<SplitMemberResponse> createSplitResponses(List<SplitMembers> splitMembers)
    {
        List<SplitMemberResponse> splitResponses = new ArrayList<>();

        for (SplitMembers splitMember : splitMembers) {

            SplitMemberResponse splitResponse = new SplitMemberResponse();

            splitResponse.setId(splitMember.getId());
            splitResponse.setMemberId(splitMember.getMembers().getId());
            splitResponse.setMemberName(splitMember.getMembers().getName());
            splitResponse.setPercentage(splitMember.getPercentage());
            splitResponse.setValue(splitMember.getValue());

            splitResponses.add(splitResponse);
        }

        return splitResponses;
    }


    @Override
    public List<ExpensesResponse> getAllExpenses()
    {

        try {
            log.info("started getting all Expense  ");

            List<Expenses> expenses = expensesRepository.getAllExpenses();

            if (expenses.isEmpty())
            {
                return emptyList();
            }

            List<Members> members = membersRepository.getAllMembers();

            Map<UUID, String> memberNames = members.stream().collect(Collectors.toMap(Members::getId, Members::getName));
            List<ExpensesResponse> responses = new ArrayList<>();

            for (Expenses expense : expenses)
            {
                List<SplitMembers> splitMembers = splitMembersRepository.getSplitMembersByExpenseIds(expense.getId().toString());

                String payerName = memberNames.get(expense.getPayerId());



                responses.add(toResponse(expense,splitMembers,payerName));
            }


            log.info("fetching the all expenses is completed successfully");
            return responses;

        } catch (Exception e) {
            log.error("error while fetching the members {} ",e.getMessage());
            throw new RuntimeException("error while fetching the error ",e);
        }



    }


    @Override
    public ExpensesResponse getExpenseById(Expenses expense) {
        try {
            log.info("Started fetching expense by ID {}",expense.getId());



            List<SplitMembers> splitMembers = splitMembersRepository.getSplitMembersByExpenseIds(expense.getId().toString());


            String payerName = membersRepository.findById(expense.getPayerId()).map(Members::getName).orElse(null);


            ExpensesResponse response = toResponse(expense, splitMembers, payerName);

            log.info("Expense fetched successfully with ID: {}", expense.getId());

            return response;

        } catch (Exception e) {
            log.error("Error while fetching expense: {}", e.getMessage(), e);
            throw new RuntimeException(
                    "Error while fetching expense by ID", e);
        }
    }


    @Override
    public List<BalanceResponse> getAllBalances()
    {
        try {
            log.info("Started calculating member balances");

            List<Members> members = membersRepository.getAllMembers();

            List<Expenses> expenses = expensesRepository.getAllExpenses();

            List<BalanceResponse> responses = new ArrayList<>();

            for(Members member : members)
            {
                BigDecimal totalPaid = BigDecimal.ZERO;
                BigDecimal totalShare = BigDecimal.ZERO;

                for(Expenses expense : expenses)
                {
                    if (member.getId().equals(expense.getPayerId()))
                    {
                        totalPaid = totalPaid.add(expense.getAmount());
                    }

                    List<SplitMembers> splitMembers = splitMembersRepository.getSplitMembersByExpenseIds(expense.getId().toString());

                    for(SplitMembers splitMember : splitMembers)
                    {
                        if(member.getId().equals(splitMember.getMembers().getId()))
                        {
                            totalShare = totalShare.add(splitMember.getValue());
                        }
                    }

                }


                BalanceResponse response = getResponse(member, totalPaid, totalShare);

                responses.add(response);

            }

            log.info("Successfully calculated member balances");

            return responses;

        }catch (Exception e)
        {
            log.error("error while getting the balance {} ", e.getMessage());
            throw new RuntimeException("error while getting the balance ",e);
        }
    }

    private BalanceResponse getResponse(Members member, BigDecimal totalPaid, BigDecimal totalShare)
    {
        BigDecimal balance = totalPaid.subtract(totalShare);

        BalanceResponse response = new BalanceResponse();

        response.setMemberId(member.getId());
        response.setMemberName(member.getName());
        response.setTotalPaid(totalPaid);
        response.setTotalShare(totalShare);
        response.setBalance(balance);


        if (balance.compareTo(BigDecimal.ZERO) > 0)
        {
            response.setStatus(BalanceStatus.SHOULD_RECEIVE);
        } else if (balance.compareTo(BigDecimal.ZERO) < 0)
        {
            response.setStatus(BalanceStatus.OWES);
        } else {
            response.setStatus(BalanceStatus.SETTLED);
        }
        return response;
    }


    @Override
    public BigDecimal getTotalSpending()
    {

        try {
            log.info("Started calculating total spending");

            List<Expenses> expenses = expensesRepository.getAllExpenses();

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



            List<SplitMembers> splitMembers = splitMembersRepository.getSplitMembersByExpenseIds(expense.getId().toString());



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


        List<SplitMemberRequest> req = validateSplitRequests(request);


        Map<UUID, Members> memberMap = getActiveMembersMap(req);


        Members payer = getPayer(request.getPayerId(), memberMap);


        Map<UUID, BigDecimal> shares = calculateShares(req, request.getAmount(), request.getSplitType(), payer.getId());


        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setPayerId(payer.getId());
        expense.setSplitType(request.getSplitType());

        Expenses savedExpense = expensesRepository.save(expense);


        List<SplitMembers> existingSplits = splitMembersRepository.getSplitMembersByExpenseIds(expense.getId().toString());


        Map<UUID, SplitMembers> existingSplitMap = new HashMap<>();

        for (SplitMembers split : existingSplits)
        {
            existingSplitMap.putIfAbsent(split.getMembers().getId(), split);
        }


        List<SplitMembers> updatedSplits = new ArrayList<>();

        for (SplitMemberRequest memberRequest : req)
        {

            UUID memberId = memberRequest.getId();


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

        //  Soft-delete participants removed from the expense.
        List<SplitMembers> removedSplits = new ArrayList<>();

        for (SplitMembers oldSplit : existingSplits) {

            UUID oldMemberId = oldSplit.getMembers().getId();

            if (!memberMap.containsKey(oldMemberId)) {

                oldSplit.setIsDeleted(true);

                removedSplits.add(oldSplit);
            }
        }


        splitMembersRepository.saveAll(updatedSplits);


        if (!removedSplits.isEmpty())
        {
            splitMembersRepository.saveAll(removedSplits);
        }

        log.info("Expense updated successfully: {}", savedExpense.getId());


        return toResponse(savedExpense, updatedSplits, payer.getName());
    }





    private List<SplitMemberRequest> validateSplitRequests(ExpensesRequest request)
    {

        Set<SplitMemberRequest> splitRequests = request.getSplitMembers();

        if (splitRequests == null || splitRequests.isEmpty())
        {
            log.warn("At least one participant is required {}",request.getSplitMembers());
            throw new IllegalArgumentException("At least one participant is required");
        }


        Set<UUID> participantIds = new HashSet<>();

        for (SplitMemberRequest req : splitRequests)
        {
            participantIds.add(req.getId());
        }

        if (participantIds.size() != splitRequests.size() || participantIds.contains(null))
        {
            log.warn("Invalid or duplicate participants " );
            throw new IllegalArgumentException("Invalid or duplicate participants");
        }


        return new ArrayList<>(splitRequests);
    }



    private Map<UUID, Members> getActiveMembersMap(List<SplitMemberRequest> requests)
    {

        Set<UUID> participantIds = new HashSet<>();

        for (SplitMemberRequest request : requests)
        {
            participantIds.add(request.getId());
        }

        List<Members> activeMembers = membersRepository.findActiveMembersByIds(participantIds);

        if (activeMembers.size() != participantIds.size())
        {
            log.info("One or more participants do not exist or are inactive");
            throw new IllegalArgumentException("One or more participants do not exist or are inactive");
        }

        Map<UUID, Members> membersMap = new HashMap<>();

        for (Members member : activeMembers)
        {
            membersMap.put(member.getId(), member);
        }

        return membersMap;
    }


    private Members getPayer(UUID payerId, Map<UUID, Members> memberMap)
    {

        if (payerId == null)
        {
            log.warn("Payer is required {}", (Object) null);
            throw new IllegalArgumentException("Payer is required");
        }


        if (memberMap.containsKey(payerId))
        {
            return memberMap.get(payerId);
        }

        return membersRepository.getMemberById(payerId.toString()).orElseThrow(() -> {
            log.warn("Payer {} does not exist or is inactive",payerId);
            return  new  IllegalArgumentException("Payer does not exist or is inactive");
        });

    }



    private void validatePercentages(List<SplitMemberRequest> requests)
    {
        log.info("validating percentage started");

        BigDecimal totalPercentage = BigDecimal.ZERO;

        for (SplitMemberRequest member : requests)
        {

            BigDecimal percentage = member.getPercentage();

            if (percentage == null || percentage.compareTo(BigDecimal.ZERO) < 0 || percentage.compareTo(new BigDecimal("100")) > 0)
            {
                log.warn("Percentage must be between 0 and 100");
                throw new IllegalArgumentException("Percentage must be between 0 and 100");
            }

            totalPercentage = totalPercentage.add(percentage);
        }

        if (totalPercentage.compareTo(new BigDecimal("100")) != 0)
        {
            log.warn("Total percentage {} must equal 100%", totalPercentage);
            throw new IllegalArgumentException("Total percentage must equal 100%");
        }
    }



    private Map<UUID, BigDecimal> calculateShares(List<SplitMemberRequest> requests, BigDecimal amount, SplitType splitType, UUID payerId)
    {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
        {
            log.warn("Expense amount {} must be greater than zero",amount);
            throw new IllegalArgumentException("Expense amount must be greater than zero");
        }

        if (amount.scale() > 2)
        {
            log.info("Expense amount {} cannot have more than 2 decimal places",amount);
            throw new IllegalArgumentException("Expense amount cannot have more than 2 decimal places");
        }

        if (requests == null || requests.isEmpty())
        {
            log.warn("At least one split member is required {}",requests);
            throw new IllegalArgumentException("At least one split member is required");
        }

        Map<UUID, BigDecimal> shares = new HashMap<>();

        UUID remainderReceiver = requests.stream().anyMatch(member -> member.getId().equals(payerId)) ? payerId : requests.getFirst().getId();

        BigDecimal allocatedAmount = BigDecimal.ZERO;

        if (splitType == SplitType.EQUAL) {

            BigDecimal baseShare = amount.divide(BigDecimal.valueOf(requests.size()), 2, RoundingMode.DOWN);

            for (SplitMemberRequest member : requests)
            {
                shares.put(member.getId(), baseShare);
                allocatedAmount = allocatedAmount.add(baseShare);
            }

            BigDecimal remainingAmount = amount.subtract(allocatedAmount);

            shares.put(remainderReceiver, shares.get(remainderReceiver).add(remainingAmount));

        } else if (splitType == SplitType.PERCENTAGE)
        {

            validatePercentages(requests);

            for (SplitMemberRequest member : requests)
            {

                BigDecimal share = amount.multiply(member.getPercentage()).divide(new BigDecimal("100"), 2, RoundingMode.DOWN);

                shares.put(member.getId(), share);
                allocatedAmount = allocatedAmount.add(share);
            }

            BigDecimal remainingAmount = amount.subtract(allocatedAmount);

            shares.put(remainderReceiver, shares.get(remainderReceiver).add(remainingAmount));

        } else {
            log.warn("Invalid split type");
            throw new IllegalArgumentException("Invalid split type");
        }

        return shares;
    }






}
