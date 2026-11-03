package com.example.demo.repository;

import com.example.demo.entity.Members;
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


    @Query("""
    SELECT m
    FROM Members m
    WHERE m.id IN :ids
    AND m.isDeleted = false
""")
    List<Members> findActiveMembersByIds(@Param("ids") Collection<UUID> ids);



    @Query(value = "SELECT * FROM members WHERE email = :email AND is_deleted = false", nativeQuery = true)
    Optional<Members> findByEmail(@Param("email") String email);

}
