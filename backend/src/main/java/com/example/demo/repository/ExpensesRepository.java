package com.example.demo.repository;

import com.example.demo.entity.Expenses;
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
        WHERE e.is_deleted = false
        ORDER BY e.id
""", nativeQuery = true)
    List<Expenses> getAllExpenses();

    @Query(value = """
    SELECT e.*
    FROM expenses e
    WHERE e.id = :id
      AND e.is_deleted = false
    """, nativeQuery = true)
    Optional<Expenses> getActiveExpenseById( @Param("id") String id);





}
