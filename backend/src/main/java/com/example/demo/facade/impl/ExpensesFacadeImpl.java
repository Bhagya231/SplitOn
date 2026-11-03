package com.example.demo.facade.impl;

import com.example.demo.dto.BalanceResponse;
import com.example.demo.dto.ExpensesRequest;
import com.example.demo.dto.ExpensesResponse;
import com.example.demo.entity.Expenses;
import com.example.demo.entity.Members;
import com.example.demo.exceptions.InvalidCredentialsException;
import com.example.demo.facade.api.ExpenseFacade;
import com.example.demo.repository.ExpensesRepository;
import com.example.demo.repository.MembersRepository;
import com.example.demo.service.api.ExpensesService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class ExpensesFacadeImpl implements ExpenseFacade
{

    private static final Logger log = AppLogger.getLogger(ExpensesFacadeImpl.class);

    private final ExpensesService expensesService;
    private final MembersRepository membersRepository;
    private final ExpensesRepository expensesRepository;

    @Override
    public ExpensesResponse addExpenses(ExpensesRequest request)
    {

            log.info(" request reached adding expenses for {}", request.getTitle());



            return expensesService.addExpenses(request);


    }

    @Override
    public List<ExpensesResponse> getAllExpenses()
    {

            log.info("fetching the all expenses request reached facade layer");
            return expensesService.getAllExpenses();


    }

    @Override
    public ExpensesResponse getExpenseById(UUID id)
    {
        log.info("fetching expense by id {} reached facade layer ",id);

        Expenses expense = checkExpense(id);
        return expensesService.getExpenseById(expense);

    }

    public List<BalanceResponse> getAllBalances()
    {
        try {
            log.info("fetching the balance request reached facade layer");
            return expensesService.getAllBalances();
        } catch (Exception e) {
            log.info(" error while fetching the balance {} ",e.getMessage());
            throw new RuntimeException("error while fetching the all balance ",e);
        }
    }



    public BigDecimal getTotalSpending()
    {

            log.info("fetching the total amount spent request reached facade layer");
            return expensesService.getTotalSpending();

    }

    public void deleteExpense(UUID expenseId)
    {

        try {

            log.info("delete expense request reached facade layer for id {}",expenseId);
//            Expenses expense = expensesRepository.getActiveExpenseById(expenseId.toString())
//                    .orElseThrow(() -> {
//                        log.warn("expense not found with id {}", expenseId);
//                        return new IllegalArgumentException("Expense not found with id: " + expenseId);
//                    });

            expensesService.deleteExpense(checkExpense(expenseId));


        }catch (IllegalArgumentException e) {
            log.warn("Unable to delete expense {}: {}",expenseId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error while deleting expense {}: {}", expenseId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete expense", e);
        }
    }

    @Override
    public ExpensesResponse editExpense(UUID expenseId, ExpensesRequest request)
    {

        try {
            log.info("request reached for the edit the expense id {} ",expenseId);

            Expenses expenses = checkExpense(expenseId);
            return expensesService.editExpense(expenses,request);


        }catch (IllegalArgumentException e) {
            log.warn("error while edit expense {}: {}",expenseId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error while editing expense {}: {}", expenseId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete expense", e);
        }
    }

    public Expenses checkExpense(UUID id)
    {

        return expensesRepository.getActiveExpenseById(id.toString())
                .orElseThrow(() -> {
                    log.warn("expense not found with id {}", id);
                    return new IllegalArgumentException("Expense not found with id: " + id);
                });
    }


}
