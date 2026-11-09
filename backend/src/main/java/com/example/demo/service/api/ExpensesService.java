package com.example.demo.service.api;

import com.example.demo.dto.BalanceResponse;
import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.entity.Expenses;
import com.example.demo.entity.Groups;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ExpensesService
{
    ExpensesResponse addExpenses(Groups group, ExpensesRequest request);

    Page<ExpensesResponse> getAllExpenses(Groups group, String search, Pageable pageable);

    ExpensesResponse getExpenseById(Expenses expense);

    List<BalanceResponse> getAllBalances(Groups group);

    BigDecimal getTotalSpending(Groups group);

    ExpensesResponse editExpense(Expenses expense, ExpensesRequest request);

    void deleteExpense(Expenses expense);


}
