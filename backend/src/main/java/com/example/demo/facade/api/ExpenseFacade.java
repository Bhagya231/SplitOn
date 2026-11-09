package com.example.demo.facade.api;

import com.example.demo.dto.BalanceResponse;
import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.entity.Expenses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ExpenseFacade {

    ExpensesResponse addExpenses(UUID groupId, ExpensesRequest request);

    Page<ExpensesResponse> getAllExpenses(UUID groupId, String search, Pageable pageable);

    ExpensesResponse getExpenseById(UUID groupId, UUID expenseId);

    List<BalanceResponse> getAllBalances(UUID groupId);

//    GroupSummaryResponse getGroupSummary(UUID groupId);


    ExpensesResponse editExpense(UUID groupId, UUID expenseId, ExpensesRequest request);

    void deleteExpense(UUID groupId, UUID expenseId);

    BigDecimal getTotalSpending(UUID groupId);


}
