package com.example.demo.entity;

import com.example.demo.enums.LoginStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@Table(name = "members")
public class Members extends BaseEntity
{

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phone;

    @Column(nullable = false)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoginStatus loginStatus = LoginStatus.LOGGED_OUT;


    @Column(name = "last_logout")
    private LocalDateTime lastLogout;

    @OneToMany(mappedBy = "member")
    private List<GroupMembers> groupMember = new ArrayList<>();

    @OneToMany(mappedBy = "members")
    private List<SplitMembers> splitMember = new ArrayList<>();


    @OneToMany(mappedBy = "payer")
    private List<Expenses> paidExpenses = new ArrayList<>();



}
