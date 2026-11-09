package com.example.demo.entity;

import com.example.demo.enums.SplitType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Setter
@Getter
@Table(name = "expenses")
public class Expenses extends BaseEntity
{

    @Column(nullable = false)
    private String title;

    @Positive
    @Column(nullable = false,precision = 10,scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate date;

//    @Column(name = "payer_id", nullable = false, length = 36)
//    @JdbcTypeCode(Types.VARCHAR)
//    private UUID payerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SplitType splitType;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_groups_id", nullable = false)
    private Groups expense_groups;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payer_id", nullable = false)
    private Members payer;

    @OneToMany(mappedBy = "expenses", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<SplitMembers> splitMembers = new ArrayList<>();






}
