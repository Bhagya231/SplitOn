package com.example.demo.repository;

import com.example.demo.entity.GroupMembers;
import com.example.demo.entity.Groups;
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
public interface GroupsRepository extends JpaRepository<Groups, UUID>
{
    @Query(value = """
            SELECT g.*
            FROM expense_groups g
            INNER JOIN group_members gm ON gm.expense_groups_id = g.id
            WHERE gm.member_id = :memberId
              AND gm.is_deleted = false
              AND g.is_deleted = false
            ORDER BY g.created_at DESC
            """, nativeQuery = true)
    List<Groups> findActiveGroupsByMemberId(@Param("memberId") String memberId);



    @Query(value = """
        SELECT *
        FROM expense_groups
        WHERE id = :groupId
        AND is_deleted = false
        """, nativeQuery = true)
    Optional<Groups> findActiveGroupById(@Param("groupId") String groupId);







    @Query(value = """
            SELECT g.*
            FROM expense_groups g
            INNER JOIN group_members gm  ON gm.expense_groups_id = g.id
            WHERE gm.member_id = :memberId
              AND gm.is_deleted = false
              AND g.is_deleted = false
              AND ( :search IS NULL
                  OR :search = ''
                  OR LOWER(g.name) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY g.created_at DESC
            """, countQuery = """
            SELECT COUNT(DISTINCT g.id)
            FROM expense_groups g
            INNER JOIN group_members gm  ON gm.expense_groups_id = g.id
            WHERE gm.member_id = :memberId
              AND gm.is_deleted = false
              AND g.is_deleted = false
              AND (:search IS NULL
                  OR :search = ''
                  OR LOWER(g.name) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')) )
            """, nativeQuery = true)
    Page<Groups> findAllActiveGroupsByMemberId(@Param("memberId") String memberId, @Param("search") String search, Pageable pageable);

}
