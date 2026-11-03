package com.example.demo.facade.api;

import com.example.demo.dto.BalanceResponse;
import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.entity.Expenses;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ExpenseFacade {

    ExpensesResponse addExpenses(ExpensesRequest request);

    List<ExpensesResponse> getAllExpenses();

    ExpensesResponse getExpenseById(UUID id);

    List<BalanceResponse> getAllBalances();

    BigDecimal getTotalSpending();

    ExpensesResponse editExpense(UUID expenseId, ExpensesRequest request);

    void deleteExpense(UUID expenseId);
}
