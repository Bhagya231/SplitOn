package com.example.demo.controller;


import com.example.demo.dto.*;
import com.example.demo.facade.api.GroupsFacade;
import com.example.demo.util.AppLogger;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;


@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupsController
{

    private static final Logger log = AppLogger.getLogger(GroupsController.class);

    private final GroupsFacade groupsFacade;





    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@Valid @RequestBody GroupRequest request) {

        log.info("Create group request received: {}", request.getName());

        GroupResponse response = groupsFacade.createGroup(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable UUID groupId) {

        log.info("Request received to fetch group: {}", groupId);

        GroupResponse response = groupsFacade.getGroupById(groupId);

        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<Page<GroupResponse>> getAllGroups(@RequestParam(required = false) String search, Pageable pageable)
    {

        log.info("Request received to fetch groups with search: {}", search);

        Page<GroupResponse> response = groupsFacade.getAllGroups(search, pageable);

        return ResponseEntity.ok(response);
    }


    @PutMapping("/{groupId}")
    public ResponseEntity<GroupResponse> updateGroup(@PathVariable UUID groupId, @Valid @RequestBody GroupUpdateRequest request)
    {

        log.info("Update group request received: {}", groupId);

        GroupResponse response = groupsFacade.updateGroup(groupId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID groupId)
    {

        log.info("Delete group request received: {}", groupId);

        groupsFacade.deleteGroup(groupId);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{groupId}/members")
    public ResponseEntity<Page<MemberResponse>> getGroupMembers(@PathVariable UUID groupId, @RequestParam(required = false) String search, Pageable pageable)
    {

        log.info("Request received to fetch members of group: {}", groupId);

        Page<MemberResponse> response = groupsFacade.getGroupMembers(groupId, search, pageable);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/{groupId}/available")
    public ResponseEntity<Page<MemberResponse>> getAvailableMembers(@PathVariable UUID groupId, @RequestParam(required = false) String search, Pageable pageable)
    {

        log.info("Request received to fetch available members for group: {}", groupId);

        Page<MemberResponse> response = groupsFacade.getAvailableMembers(groupId, search, pageable);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/{groupId}/members")
    public ResponseEntity<Void> addGroupMembers(@PathVariable UUID groupId, @Valid @RequestBody Set<GroupMembersRequest> request) {

        log.info("Request received to add members to group: {}", groupId);

        groupsFacade.addGroupMembers(groupId, request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<Void> removeGroupMember(@PathVariable UUID groupId, @PathVariable UUID memberId) {

        log.info("Request received to remove member {} from group {}", memberId, groupId);

        groupsFacade.removeGroupMember(groupId, memberId);

        return ResponseEntity.noContent().build();
    }
}
