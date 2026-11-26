package com.example.demo.repository;

import com.example.demo.entity.Expenses;
import jakarta.persistence.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
            select coalesce(sum(e.amount), 0)
                        from expenses e 
                        where e.expense_groups_id = :groupId
                        AND e.is_deleted = false
            """, nativeQuery = true)
    BigDecimal getTotalGroupExpenses(@Param("groupId") String groupId);


    @Query(value = """
        SELECT COALESCE(SUM(e.amount), 0)
        FROM expenses e
        WHERE e.expense_groups_id = :groupId
          AND e.payer_id = :memberId
          AND e.is_deleted = false
        """, nativeQuery = true)
    BigDecimal getTotalPaidByMember(@Param("groupId") String groupId, @Param("memberId") String memberId);

    @Query(value = """
        SELECT DISTINCT e.*
        FROM expenses e
        INNER JOIN split_members sm ON sm.expenses_id = e.id
        WHERE e.expense_groups_id = :groupId
          AND sm.members_id = :memberId
          AND e.is_deleted = false
          AND sm.is_deleted = false
        ORDER BY e.date DESC
        """, nativeQuery = true)
    List<Expenses> findExpensesByMember(@Param("groupId") String groupId, @Param("memberId") String memberId);


    @Query(value = """
        SELECT *
        FROM expenses
        WHERE expense_groups_id = :groupId
          AND is_deleted = false
        ORDER BY created_at DESC
        """, nativeQuery = true)
    List<Expenses> getAllExpensesByGroupId(@Param("groupId") String groupId);



    @Query(value = """
        SELECT e.*
        FROM expenses e 
        WHERE e.expense_groups_id = :groupId
         AND e.is_deleted = false
            AND EXISTS(
                SELECT 1
                 FROM split_members sm1
                    WHERE sm1.expenses_id = e.id
                        AND sm1.members_id = :userId
                            AND sm1.is_deleted = false 
                    )
                AND EXISTS(
                    SELECT 1
                    FROM split_members sm2
                    WHERE sm2.expenses_id = e.id
                    AND sm2.members_id = :selectedMemberId
                    AND sm2.is_deleted = false)
                ORDER BY e.date DESC
                            """,nativeQuery = true)
    List<Expenses> findSharedExpenses(@Param("groupId") String groupId, @Param("userId") String userId,
                                      @Param("selectedMemberId") String selectedMemberId);


}
