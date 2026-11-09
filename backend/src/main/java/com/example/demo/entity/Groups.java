package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "expense_groups")
public class Groups extends BaseEntity
{

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private Members createdBy;

    @OneToMany(mappedBy = "expense_groups",fetch = FetchType.LAZY)
    private List<GroupMembers> groupMembers = new ArrayList<>();


    @OneToMany(mappedBy = "expense_groups",fetch = FetchType.LAZY)
    private List<Expenses> expenses = new ArrayList<>();
}
