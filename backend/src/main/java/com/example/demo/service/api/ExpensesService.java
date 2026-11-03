package com.example.demo.service.api;

import com.example.demo.dto.BalanceResponse;
import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.entity.Expenses;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ExpensesService
{
    ExpensesResponse addExpenses(ExpensesRequest request);

    List<ExpensesResponse> getAllExpenses();

    ExpensesResponse getExpenseById(Expenses expense);

    List<BalanceResponse> getAllBalances();

    BigDecimal getTotalSpending();

    ExpensesResponse editExpense(Expenses expenses, ExpensesRequest request);

    void deleteExpense(Expenses expense);


}
