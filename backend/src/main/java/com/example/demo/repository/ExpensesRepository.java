package com.example.demo.repository;

import com.example.demo.entity.Expenses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpensesRepository extends JpaRepository<Expenses, UUID>
{

    @Query(value = """
        SELECT e.*
        FROM expenses e
        WHERE e.expense_groups_id = :groupId
          AND e.is_deleted = false
          AND (:search IS NULL OR :search = ''
                           OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')))
                ORDER BY e.created_at DESC""",
            countQuery = """
                SELECT COUNT(*)
                FROM expenses e
                WHERE e.expense_groups_id = :groupId
                  AND e.is_deleted = false
                  AND (:search IS NULL OR :search = ''
                      OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')))
                """, nativeQuery = true)
    Page<Expenses> getAllExpensesByGroupId(@Param("groupId") String groupId, @Param("search") String search, Pageable pageable);


    @Query(value = """
        SELECT e.*
        FROM expenses e
        WHERE e.id = :expenseId
          AND e.expense_groups_id = :groupId
          AND e.is_deleted = false
        """, nativeQuery = true)
    Optional<Expenses> getActiveExpenseByIdAndGroupId(@Param("expenseId") String expenseId, @Param("groupId") String groupId);


    @Query(value = """
        SELECT *
        FROM expenses
        WHERE id = :expenseId
          AND is_deleted = false
        """, nativeQuery = true)
    Optional<Expenses> getActiveExpenseById(@Param("expenseId") String expenseId);


    @Query(value = """
        SELECT *
        FROM expenses
        WHERE expense_groups_id = :groupId
          AND is_deleted = false
        ORDER BY created_at DESC
        """, nativeQuery = true)
    List<Expenses> getAllExpensesByGroupId(@Param("groupId") String groupId);


}
