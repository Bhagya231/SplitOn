package com.example.demo.repository;

import com.example.demo.entity.SplitMembers;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.math.BigDecimal;
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
    List<SplitMembers> getSplitMembersByExpenseId(@Param("expenseId") String expenseId);


    @Query(value = """
        SELECT COALESCE(SUM(sm.value), 0)
        FROM split_members sm
        JOIN expenses e ON e.id = sm.expenses_id
        WHERE e.expense_groups_id = :groupId
          AND sm.members_id = :memberId
          AND e.is_deleted = false
          AND sm.is_deleted = false
        """, nativeQuery = true)
    BigDecimal getTotalShareByMember(@Param("groupId") String groupId, @Param("memberId") String memberId);



    @Query(value = """
        SELECT sm.*
        FROM split_members sm
        WHERE sm.members_id = :id
        AND sm.is_deleted = false
    """,nativeQuery = true)
    List<SplitMembers> getSplitMemberByMemberId(@Param("id") String id);


    @Query(value = """ 
            select coalesce(sum(sm.value),0)
                        from split_members sm
                                    join expenses e ON sm.expenses_id = e.id 
                                                where e.expense_groups_id = :groupId AND e.payer_id = :memberId AND sm.members_id = :groupMemberId 
                                                            AND e.is_deleted = false AND sm.is_deleted = false
            """, nativeQuery = true)
    BigDecimal getTotalPaidByMembers(@Param("groupId") String groupId,@Param("memberId") String memberId,@Param("groupMemberId") String GroupMemberId);



}
