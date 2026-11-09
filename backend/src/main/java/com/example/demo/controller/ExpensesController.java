package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.facade.api.ExpenseFacade;

import com.example.demo.util.AppLogger;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("groups/{groupId}/expenses")
@RequiredArgsConstructor
public class ExpensesController
{

    private static final Logger log = AppLogger.getLogger(ExpensesController.class);

    private final ExpenseFacade expenseFacade;




    @PostMapping("/add")
    public ResponseEntity<ExpensesResponse> addExpense(@PathVariable UUID groupId, @Valid @RequestBody ExpensesRequest request)
    {

        try {
            log.info("Adding expense request received for group {}: {}", groupId, request.getTitle());

            ExpensesResponse response = expenseFacade.addExpenses(groupId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Failed to add the expenses: {}", request.getTitle(), e);
            throw new BadRequestException(e.getMessage());
        }

    }

    @GetMapping
    public ResponseEntity<Page<ExpensesResponse>> getAllExpenses(@PathVariable UUID groupId, @RequestParam(required = false) String search, @PageableDefault(size = 5) Pageable pageable)
    {

        try {
            log.info("Fetching expenses for group {}, search: {}", groupId, search);

            Page<ExpensesResponse> response = expenseFacade.getAllExpenses(groupId, search, pageable);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.info("unexpected error while fetching the all expenses {} ",e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpensesResponse> getExpenseById(@PathVariable UUID groupId, @PathVariable UUID expenseId)
    {

        try {
            log.info("Fetching expense {} from group {}", expenseId, groupId);

            ExpensesResponse response = expenseFacade.getExpenseById(groupId, expenseId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to fetch expense {} from group {}: {}", expenseId, groupId, e.getMessage(), e);
            throw new BadRequestException(e.getMessage());
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<List<BalanceResponse>> getBalance(@PathVariable UUID groupId)
    {

        try {
            log.info("Fetching balances for group {}", groupId);

            List<BalanceResponse> response = expenseFacade.getAllBalances(groupId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.info("unexpected error while fetching the balance {} ",e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalSpending(@PathVariable UUID groupId)
    {

        try {
            log.info("Fetching total spending for group {}", groupId);

            BigDecimal response = expenseFacade.getTotalSpending(groupId);

            return ResponseEntity.ok(response);

        } catch (Exception e)
        {
            log.error("Failed to fetch total spending for group {}: {}", groupId, e.getMessage(), e);
            throw new BadRequestException(e.getMessage());
        }
    }



    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID groupId, @PathVariable UUID expenseId)
    {

        try {
            log.info("Delete request received for expense {} in group {}", expenseId, groupId);

            expenseFacade.deleteExpense(groupId, expenseId);

            return ResponseEntity.noContent().build();

        } catch (Exception e)
        {
            log.error("Failed to delete expense {} from group {}: {}", expenseId, groupId, e.getMessage(), e);
            throw new BadRequestException(e.getMessage());
        }
    }


    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpensesResponse> editExpense(@PathVariable UUID groupId, @PathVariable UUID expenseId, @Valid @RequestBody ExpensesRequest request) {

        try {
            log.info("Edit request received for expense {} in group {}", expenseId, groupId);

            ExpensesResponse response = expenseFacade.editExpense(groupId, expenseId, request);

            return ResponseEntity.ok(response);

        } catch (Exception e)
        {
            log.error("Failed to edit expense {} in group {}: {}", expenseId, groupId, e.getMessage(), e);
            throw new BadRequestException(e.getMessage());
        }
    }
}
