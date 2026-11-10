package com.example.demo.repository;

import com.example.demo.entity.GroupMembers;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GroupMembersRepository extends JpaRepository<GroupMembers, UUID>
{


    @Query(value = """
        SELECT gm.*
        FROM group_members gm
        INNER JOIN members m ON m.id = gm.member_id
        WHERE gm.expense_groups_id = :groupId
          AND gm.is_deleted = false
          AND m.is_deleted = false
          AND ( :search IS NULL
              OR :search = ''
              OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY gm.created_at DESC
        """, countQuery = """
        SELECT COUNT(*)
        FROM group_members gm
        INNER JOIN members m ON m.id = gm.member_id
        WHERE gm.expense_groups_id = :groupId
          AND gm.is_deleted = false
          AND m.is_deleted = false
          AND (
              :search IS NULL
              OR :search = ''
              OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%')))""", nativeQuery = true)
    Page<GroupMembers> findActiveMembersByGroupId(@Param("groupId") String groupId, @Param("search") String search, Pageable pageable);




    @Query(value = """
    SELECT gm.*
    FROM group_members gm
    WHERE gm.expense_groups_id = :groupId
    AND gm.is_deleted = false
    """, nativeQuery = true)
    List<GroupMembers> findActiveGroupMembers(@Param("groupId") String groupId);

    @Query(value = """
    SELECT gm.*
    FROM group_members gm
    WHERE gm.member_id = :memberId
      AND gm.expense_groups_id = :groupId
      AND gm.is_deleted = false
    """, nativeQuery = true)
    Optional<GroupMembers> findActiveMembers(@Param("memberId") String memberId, @Param("groupId") String groupId);




    @Query(value = """
    SELECT DISTINCT m.*
    FROM members m
    INNER JOIN group_members gm ON gm.member_id = m.id
    WHERE gm.expense_groups_id = :groupId
      AND gm.is_deleted = false
      AND m.is_deleted = false
      AND m.id IN (:memberIds)
    """, nativeQuery = true)
    List<Members> findActiveMembersByIdsAndGroupId(@Param("memberIds") Collection<String> memberIds, @Param("groupId") String groupId);


}
