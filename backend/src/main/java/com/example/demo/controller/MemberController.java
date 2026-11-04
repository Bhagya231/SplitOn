package com.example.demo.controller;

import com.example.demo.dto.MemberRequest;
import com.example.demo.dto.MemberResponse;

import com.example.demo.facade.api.MembersFacade;

import com.example.demo.util.AppLogger;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController
{
    private static final Logger log = AppLogger.getLogger(MemberController.class);

    private final MembersFacade membersFacade;




    @PostMapping("/add")
    public ResponseEntity<MemberResponse> addMembers( @Valid @RequestBody MemberRequest request)
    {
        log.info("adding member request reached the endpoint: {}", request.getEmail());

        try {
            MemberResponse response = membersFacade.addMembers(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Failed to add the member: {} {}", request.getEmail(), e.getMessage());
            throw new RuntimeException("error while adding the members ",e);
        }

    }

    @GetMapping("/getAll")
    public ResponseEntity<List<MemberResponse>> getAllMembers()
    {
        log.info("request reached endpoint for fetching all members ");
        try {
            List<MemberResponse> res = membersFacade.getAllMembers();

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            log.info("unexpected error while fetching the members {} ",e.getMessage());
            throw new RuntimeException("error while fetching the members ",e);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<MemberResponse> editMember(@PathVariable UUID id, @Valid @RequestBody MemberRequest request)
    {
        log.info("request reached endpoint for id {}", id);

        try {
            MemberResponse response = membersFacade.editMember(id, request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to update the member: {}", id, e);
            throw e;
        }

    }

    @DeleteMapping("/delete/{id}")
    public  ResponseEntity<String> delete(@PathVariable UUID id)
    {
        log.info(" request reached end point for the  delete id {}", id);



            membersFacade.deleteMember(id);

            return ResponseEntity.ok("deleted completed ");

    }


}
