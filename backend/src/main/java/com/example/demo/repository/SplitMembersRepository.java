package com.example.demo.repository;

import com.example.demo.entity.SplitMembers;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SplitMembersRepository  extends JpaRepository<SplitMembers, UUID>
{

    @Query(value = """ 
        SELECT sm.*
        FROM split_members sm
        WHERE sm.expenses_id  = :expenseId 
        AND sm.is_deleted = false;
""",nativeQuery = true)
    List<SplitMembers> getSplitMembersByExpenseIds(@Param("expenseId") String expenseId);


    @Query(value = """
        SELECT sm.*
        FROM split_members sm
        WHERE sm.members_id = :id
        AND is_deleted = false;
    """,nativeQuery = true)
    List<SplitMembers> getSplitMemberByMemberId(@Param("id") String id);


}
