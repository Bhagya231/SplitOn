package com.example.demo.facade.impl;

import com.example.demo.dto.*;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.facade.api.GroupsFacade;
import com.example.demo.repository.GroupsRepository;
import com.example.demo.repository.MembersRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.api.GroupsService;
import com.example.demo.util.AppLogger;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GroupsFacadeImpl implements GroupsFacade
{

    private static final Logger log = AppLogger.getLogger(GroupsFacadeImpl.class);


    private final GroupsService groupsService;
    private final MembersRepository membersRepository;
    private final GroupsRepository groupsRepository;


    private Members getLoggedInMember()
    {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();



        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        UUID memberId = userDetails.getUserId();


        return membersRepository.getMemberById(memberId.toString())
                .orElseThrow(() -> {
                    log.warn("member not found for id {}",memberId);
                    return new BadRequestException("Member not found");
                });
    }

    private Groups validateGroup(UUID groupId)
    {

        return groupsRepository.findActiveGroupById(groupId.toString())
                .orElseThrow(() -> {
                    log.warn("group not found for id {}",groupId);
                    return new BadRequestException("Group not found");
                });

    }



    private List<Members> validateGroupMembers(Set<GroupMembersRequest> request)
    {

        if (request == null || request.isEmpty())
        {
            log.warn("Group members are required");
            throw new BadRequestException("Group members are required");
        }

        Set<String> memberIds = new HashSet<>();

        for (GroupMembersRequest groupMember : request)
        {

            if (groupMember == null)
            {
                log.warn("Group member request is null");
                throw new BadRequestException("Group member request is required");
            }

            if (groupMember.getMemberId() == null)
            {
                log.warn("Member ID is required");
                throw new BadRequestException("Member ID is required");
            }

            String memberId = groupMember.getMemberId().toString();

            if (!memberIds.add(memberId))
            {
                log.warn("Duplicate member ID: {}", memberId);
                throw new BadRequestException("Duplicate members are not allowed");
            }
        }

        List<Members> members = membersRepository.findActiveMembersByIds(memberIds);

        if (members.size() != memberIds.size())
        {
            log.warn("Some members are invalid or deleted");
            throw new BadRequestException("One or more members are invalid or deleted");
        }

        return members;
    }






    @Override
    public List<GroupResponse> getGroupsByMember()
    {


        try {
            Members member = getLoggedInMember();

            log.info("Fetching groups for member: {}", member.getId());

            return groupsService.getGroupsByMemberId(member);
        }catch (BadRequestException e)
        {
            log.error("error while get the group by member ");
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while getting the group by member id");
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public GroupResponse createGroup(GroupRequest request)
    {

        try {
            Members member = getLoggedInMember();

            List<Members> groupMembers = validateGroupMembers(request.getGroupMembers());


            log.info("Creating group for member: {}", member.getId());

            return groupsService.createGroup(request, member,groupMembers);
        }catch (IllegalArgumentException | BadRequestException  e)
        {
            log.error("error while creating the group {}",request.getName());
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while creating group");
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public GroupResponse getGroupById(UUID groupId)
    {

        try {
            Members member = getLoggedInMember();

            Groups group = validateGroup(groupId);

            log.info("Fetching group: {}", groupId);

            return groupsService.getGroupById(group, member);
        }catch (BadRequestException e)
        {
            log.error("error while getting the group by id {}",groupId);
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while getting the group for id {}",groupId);
            throw new BadRequestException(e.getMessage());
        }


    }

    @Override
    public Page<GroupResponse> getAllGroups(String search, Pageable pageable)
    {
        try {
            Members member = getLoggedInMember();

            if (pageable == null || pageable.getPageSize() <= 0)
            {
                log.warn("Invalid pagination details {}",pageable);
                throw new BadRequestException("Invalid pagination details");
            }

            String validSearch = search == null ? "" : search.trim();

            log.info("Fetching all groups  for member : {}", member.getId());

            return groupsService.getAllGroups(validSearch, pageable,member);
        }catch (BadRequestException e)
        {
            log.error("error while getting the all group by ");
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while getting all the group ");
            throw new BadRequestException(e.getMessage());
        }


    }

    @Override
    public GroupResponse updateGroup(UUID groupId, GroupUpdateRequest request)
    {
        try {
            Members loggedInMember = getLoggedInMember();

            Groups group = validateGroup(groupId);


            log.info("Updating group: {}", groupId);

            return groupsService.updateGroup(group, request, loggedInMember);

        } catch (BadRequestException e)
        {
            log.warn("Group update failed for {}: {}", groupId, e.getMessage());
            throw e;
        } catch (Exception e)
        {
            log.error("Unexpected error while updating group {} {}", groupId, e.getMessage());
            throw new BadRequestException("Unable to update group");
        }
    }


    @Override
    public void addGroupMembers(UUID groupId, Set<GroupMembersRequest> request)
    {
        try {
            Members loggedInMember = getLoggedInMember();

            Groups group = validateGroup(groupId);

            List<Members> groupMembers = validateGroupMembers(request);

            log.info("Adding members to group: {}", groupId);

            groupsService.addGroupMembers(group, groupMembers, loggedInMember);

        } catch (BadRequestException e) {
            log.warn("Adding members failed for group {}: {}", groupId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while adding members to group {}", groupId, e);
            throw new BadRequestException("Unable to add group members");
        }
    }


    @Override
    public void removeGroupMember(UUID groupId, UUID memberId)
    {
        try {
            Members loggedInMember = getLoggedInMember();

            Groups group = validateGroup(groupId);

            if (memberId == null)
            {
                log.warn("members Id is required {}",memberId);
                throw new BadRequestException("Member ID is required");
            }

            Members member = membersRepository.getMemberById(memberId.toString()).orElseThrow(() -> new BadRequestException("Member not found"));

            log.info("Removing member {} from group {}", memberId, groupId);

            groupsService.removeGroupMember(group, member, loggedInMember);

        } catch (BadRequestException e) {
            log.warn("Removing member failed for group {}: {}", groupId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while removing member from group {}", groupId, e);
            throw new BadRequestException("Unable to remove group member");
        }
    }

    @Override
    public void deleteGroup(UUID groupId)
    {

        try {
            Members member = getLoggedInMember();

            Groups group = validateGroup(groupId);

            log.info("Deleting group: {}", groupId);

            groupsService.deleteGroup(group, member);
        }catch (BadRequestException e)
        {
            log.error("error while deleting the  group id {} ",groupId);
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while deleting the group {} ",groupId);
            throw new BadRequestException(e.getMessage());
        }


    }


    @Override
    public Page<MemberResponse> getAvailableMembers(UUID groupId, String search, Pageable pageable)
    {

        log.info("Get available members request for group: {}", groupId);

      try {

          if (pageable == null || pageable.getPageSize() > 100)
          {
              throw new BadRequestException("Invalid pagination details");
          }


          Members loggedInMember = getLoggedInMember();

          Groups group = validateGroup(groupId);



          return groupsService.getAvailableMembers(group,loggedInMember,search,pageable);

      }catch (EntityNotFoundException e)
      {
          log.error("error while getting available members  {}",groupId);
          throw e;
      } catch (Exception e)
      {
          log.error("unexpected error while getting available members for group {}",groupId);
          throw new RuntimeException(e);
      }

    }




    @Override
    public Page<MemberResponse> getGroupMembers(UUID groupId,String search,Pageable pageable)
    {

        try {
            if (pageable == null || pageable.getPageSize() > 100)
            {
                log.warn("Invalid pagination details");
                throw new BadRequestException("Invalid pagination details");
            }



            Members loggedInMember = getLoggedInMember();

            Groups group = validateGroup(groupId);

            return groupsService.getGroupMembers(group,loggedInMember,search, pageable);

        }catch (EntityNotFoundException e)
        {
            log.error("error while getting group members {}",groupId);
            throw e;
        } catch (Exception e)
        {
            log.error("Unexpected error while getting the group members {}",groupId);
            throw new RuntimeException(e.getMessage());
        }

    }






}
