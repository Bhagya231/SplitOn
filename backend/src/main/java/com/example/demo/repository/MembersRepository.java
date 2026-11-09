package com.example.demo.repository;

import com.example.demo.entity.GroupMembers;
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
public interface MembersRepository extends JpaRepository<Members, UUID>
{


    @Query(value = """
               SELECT COUNT(*)
               FROM members
               WHERE email = :email And is_deleted = false
""",nativeQuery = true)
    long existByEmail(@Param("email") String email);

    @Query(value = """
        SELECT *
        FROM members
        WHERE is_deleted = false;
""",nativeQuery = true)
    List<Members> getAllMembers();


    @Query(value = """
        SELECT *
        FROM members
        WHERE id = :id AND is_deleted = false
""", nativeQuery = true)
    Optional<Members> getMemberById(@Param("id") String id);




    @Query(value = """
        SELECT *
        FROM members
        WHERE id IN (:ids)
        AND is_deleted = false
        """, nativeQuery = true)
    List<Members> findActiveMembersByIds(@Param("ids") Collection<String> ids);



    @Query(value = "SELECT * FROM members WHERE email = :email AND is_deleted = false", nativeQuery = true)
    Optional<Members> findByEmail(@Param("email") String email);






    @Query(value = """
        SELECT m.*
        FROM members m
        WHERE m.is_deleted = 0
          AND (:search IS NULL
              OR :search = ''
              OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%')))
          AND NOT EXISTS (SELECT 1
              FROM group_members gm
              WHERE gm.member_id = m.id
                AND gm.expense_groups_id = :groupId
                AND gm.is_deleted = 0 ) ORDER BY m.created_at DESC""",
            countQuery = """
        SELECT COUNT(*)
        FROM members m
        WHERE m.is_deleted = 0
          AND (:search IS NULL
              OR :search = ''
              OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%')) )
          AND NOT EXISTS (
              SELECT 1
              FROM group_members gm
              WHERE gm.member_id = m.id
                AND gm.expense_groups_id = :groupId
                AND gm.is_deleted = 0)""",nativeQuery = true)
    Page<Members> findAvailableMembersByGroupId(@Param("groupId") String groupId, @Param("search") String search, Pageable pageable);





}
