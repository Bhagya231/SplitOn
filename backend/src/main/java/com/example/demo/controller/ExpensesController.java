package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.facade.api.ExpenseFacade;

import com.example.demo.util.AppLogger;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/expense")
@RequiredArgsConstructor
public class ExpensesController
{

    private static final Logger log = AppLogger.getLogger(MemberController.class);

    private final ExpenseFacade expenseFacade;




    @PostMapping("/add")
    public ResponseEntity<ExpensesResponse> addExpense(@Valid @RequestBody ExpensesRequest request)
    {
        log.info("adding expenses request reached the endpoint: {}", request.getTitle());

        try {
            ExpensesResponse response = expenseFacade.addExpenses(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Failed to add the expenses: {}", request.getTitle(), e);
            throw e;
        }

    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ExpensesResponse>> getAllExpenses()
    {
        log.info("request reached endpoint for fetching all expenses ");
        try {
            List<ExpensesResponse> res = expenseFacade.getAllExpenses();

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            log.info("unexpected error while fetching the all expenses {} ",e.getMessage());
            throw new RuntimeException("error while fetching the all expenses ",e);
        }
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ExpensesResponse> getExpenseById(@PathVariable UUID id)
    {
        log.info("request reached endpoint for the get expense by id {}",id);


            ExpensesResponse res = expenseFacade.getExpenseById(id);
            return ResponseEntity.ok(res);



    }

    @GetMapping("/balance")
    public ResponseEntity<List<BalanceResponse>> getBalance()
    {
        log.info("request reached endpoint for fetching balance ");
        try {
            List<BalanceResponse> res = expenseFacade.getAllBalances();

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            log.info("unexpected error while fetching the balance {} ",e.getMessage());
            throw new RuntimeException("error while fetching the balance ",e);
        }
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalSpending()
    {
        log.info("request reached endpoint for fetching the total amount spent");
        return ResponseEntity.ok(expenseFacade.getTotalSpending());
    }

    @DeleteMapping("/delete/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID expenseId)
    {
        log.info("delete request reached the endpoint for expense id {}", expenseId);
        expenseFacade.deleteExpense(expenseId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/edit/{expenseId}")
    public ResponseEntity<ExpensesResponse> edit(@PathVariable UUID expenseId,@Valid @RequestBody ExpensesRequest request )
    {
        log.info("request reached end point for edit the expense {}",expenseId);
        ExpensesResponse res = expenseFacade.editExpense(expenseId,request);

        return ResponseEntity.ok(res);
    }
}
