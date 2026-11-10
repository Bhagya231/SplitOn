package com.example.demo.service.impl;

import com.example.demo.dto.*;
import com.example.demo.entity.GroupMembers;
import com.example.demo.entity.Groups;
import com.example.demo.entity.Members;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.mappers.GroupsMapper;
import com.example.demo.mappers.MembersMapper;
import com.example.demo.repository.GroupMembersRepository;
import com.example.demo.repository.GroupsRepository;
import com.example.demo.repository.MembersRepository;
import com.example.demo.service.api.GroupsService;
import com.example.demo.util.AppLogger;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
@RequiredArgsConstructor
public class GroupsServiceImpl implements GroupsService
{

    private static final Logger log = AppLogger.getLogger(GroupsServiceImpl.class);

    private final GroupsRepository groupsRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final MembersRepository membersRepository;
    private final GroupsMapper groupsMapper;
    private final MembersMapper membersMapper;




    @Override
    @Transactional
    public List<GroupResponse> getGroupsByMemberId(Members member)
    {
        try {
            log.info("get group by members id is started in service {}",member.getName());
            List<Groups> groups = groupsRepository.findActiveGroupsByMemberId(member.getId().toString());

            return groups.stream().map(this::convertToResponse).toList();

        } catch (Exception e)
        {
            log.error("unexpected error while getting the groups for member {}",member.getId());
            throw new BadRequestException(e.getMessage());
        }
    }


    @Override
    @Transactional
    public GroupResponse createGroup(GroupRequest request, Members member, List<Members> groupMembers)
    {

        try {

            log.info("Creating group: {}", request.getName());

            Groups group = new Groups();

            group.setName(request.getName().trim());
            group.setDescription(request.getDescription());
            group.setCreatedBy(member);

            Groups savedGroup = groupsRepository.save(group);

            boolean creatorExists = false;

            for (Members groupMember : groupMembers)
            {
                if (groupMember.getId().equals(member.getId()))
                {
                    creatorExists = true;
                    break;
                }
            }

            if (!creatorExists)
            {
                groupMembers.add(member);
            }


            List<GroupMembers> groupMembersList = new ArrayList<>();

            for (Members groupMember : groupMembers)
            {

                GroupMembers user = new GroupMembers();

                user.setExpense_groups(savedGroup);
                user.setMember(groupMember);

                groupMembersList.add(user);
            }

            List<GroupMembers> savedGroupMembers = groupMembersRepository.saveAll(groupMembersList);

            log.info("Group created successfully: {}", savedGroup.getId());



            return convertToResponse(savedGroup);

        }catch (BadRequestException e)
        {
            log.error("error while creating the group {}",request.getName());
            throw e;

        } catch (Exception e)
        {
            log.error("unexpected error while creating the groups {}",request.getName());
            throw new RuntimeException(e);
        }


    }



    @Override
    public GroupResponse getGroupById(Groups group, Members member)
    {

        try {

            validateGroupMembers(group, member);

            return convertToResponse(group);

        }catch (BadRequestException e)
        {
            log.warn("getting group failed  {}: {}", group.getId(), e.getMessage());
            throw e;

        } catch (Exception e)
        {
            log.error("Unexpected error while getting group {} {}", group.getId(), e.getMessage());
            throw new BadRequestException( e.getMessage());
        }
    }





    @Override
    public Page<GroupResponse> getAllGroups(String search, Pageable pageable, Members member)
    {

        try {
            Page<Groups> groups = groupsRepository.findAllActiveGroupsByMemberId(member.getId().toString(), search, pageable);

            return groups.map(this::convertToResponse);

        } catch (Exception e)
        {
            log.info("unexpected error while getting all groups ");
            throw new BadRequestException(e.getMessage());
        }


    }



    @Override
    @Transactional
    public GroupResponse updateGroup(Groups group,GroupUpdateRequest request,Members member)
    {

        try {

            validateGroupMembers(group, member);

            group.setName(request.getName().trim());
            group.setDescription(request.getDescription());

            Groups updatedGroup = groupsRepository.save(group);

            log.info("Group updated successfully: {}", updatedGroup.getId());

            return convertToResponse(updatedGroup);

        } catch (BadRequestException e)
        {
            log.warn(" error while updating group   {}: {}", group.getId(), e.getMessage());
            throw e;

        } catch (Exception e)
        {
            log.error("Unexpected error while updating group {} {}", group.getId(), e.getMessage());
            throw new BadRequestException( e.getMessage());
        }

    }


    @Override
    @Transactional
    public void addGroupMembers(Groups group, List<Members> groupMembers,Members member)
    {

        try {

            log.info("Adding members to group: {}", group.getId());

            List<GroupMembers> activeMembers = validateGroupMembers(group, member);

            Set<UUID> existMemberIds = new HashSet<>();

            for (GroupMembers groupMember : activeMembers)
            {
                existMemberIds.add(groupMember.getMember().getId());
            }


            Set<UUID> requestedMemberIds = new HashSet<>();

            List<GroupMembers> newMembers = new ArrayList<>();

            for (Members newMember : groupMembers)
            {

                UUID memberId = newMember.getId();

                if (!requestedMemberIds.add(memberId))
                {
                    log.warn("Duplicate member in the add request{}",memberId);
                    throw new BadRequestException("Duplicate member in request " );
                }

                if (existMemberIds.contains(memberId))
                {
                    log.warn("member is already added to this group {}", newMember.getName());
                    throw new BadRequestException("Member is already added to this group " );
                }

                GroupMembers groupMember = new GroupMembers();

                groupMember.setExpense_groups(group);
                groupMember.setMember(newMember);

                newMembers.add(groupMember);
            }

            groupMembersRepository.saveAll(newMembers);


            log.info("Members added successfully to group: {}", group.getId());

        } catch (BadRequestException e)
        {
            log.warn("Adding members failed for group {}: {}", group.getId(), e.getMessage());
            throw e;

        } catch (Exception e)
        {
            log.error("Unexpected error while adding members to group {} {}", group.getId(), e.getMessage());
            throw new BadRequestException( e.getMessage());
        }
    }


    @Override
    @Transactional
    public void removeGroupMember(Groups group,Members memberRemove,Members member)
    {

        try {
            List<GroupMembers> activeMembers = validateGroupMembers(group, member);

            GroupMembers removingmember = null;

            for (GroupMembers gm : activeMembers)
            {
                if (gm.getMember().getId().equals(memberRemove.getId()))
                {
                    removingmember = gm;
                    break;
                }
            }

            if (removingmember == null)
            {
                log.warn("Member is not belong to this group {}  {}",member.getId(), group.getId());
                throw new BadRequestException("Member does not belong to this group");
            }

            removingmember.setIsDeleted(true);

            groupMembersRepository.save(removingmember);


            log.info("Member {} removed successfully from group {}", memberRemove.getId(), group.getId());

        } catch (BadRequestException e) {
            log.warn("Removing member failed for group {}: {}", group.getId(), e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error while removing member from group {}", group.getId(), e);
            throw new BadRequestException( e.getMessage());
        }
    }



    @Override
    @Transactional
    public void deleteGroup(Groups group, Members member)
    {


        try {

            validateGroupMembers(group, member);

            group.setIsDeleted(true);

            groupsRepository.save(group);

            log.info("Group deleted successfully: {}", group.getId());

        }catch (BadRequestException e)
        {
            log.error("error while deleting the group {}",group.getId());
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while deleting the group {}",group.getId());
            throw new BadRequestException(e.getMessage());
        }


    }


    private List<GroupMembers> validateGroupMembers(Groups group, Members member)
    {

        List<GroupMembers> activeMembers = groupMembersRepository.findActiveGroupMembers(group.getId().toString());

        boolean isMember = activeMembers.stream().anyMatch(groupMember -> groupMember.getMember().getId().equals(member.getId()));

        if (!isMember)
        {
            log.warn("logging member are not the member of this group");
            throw new BadRequestException("You are not a member of this group");

        }

        return activeMembers;
    }

    @Override
    @Transactional
    public Page<MemberResponse> getAvailableMembers(Groups group,Members loggedInMember,String search, Pageable pageable)
    {


        try {

            validateGroupMembers(group, loggedInMember);


            Page<Members> availableMembers = membersRepository.findAvailableMembersByGroupId(group.getId().toString(), search, pageable);


            return availableMembers.map(membersMapper::toResponse);

        }catch (BadRequestException e)
        {
            log.error("error while getting available members {}",group.getId());
            throw e;
        } catch (Exception e)
        {
            log.error("unexpected error while getting the available members {}",group.getId());
            throw new BadRequestException(e.getMessage());
        }



    }



    @Override
    @Transactional
    public Page<MemberResponse> getGroupMembers(Groups group,Members loggedInMember, String search,Pageable pageable)
    {

        try {
            validateGroupMembers(group, loggedInMember);

            Page<GroupMembers> groupMembers = groupMembersRepository.findActiveMembersByGroupId(group.getId().toString(), search, pageable);


            return groupMembers.map(groupMember -> membersMapper.toResponse(groupMember.getMember()));

        } catch (Exception e)
        {
            log.error("error while getting group members {}",group.getId());
            throw new BadRequestException(e.getMessage());
        }


    }


    private GroupResponse convertToResponse(Groups group)
    {

        GroupResponse response = groupsMapper.toResponse(group);

        List<GroupMembers> activeMembers = groupMembersRepository.findActiveGroupMembers(group.getId().toString());

        List<GroupMembersResponse> memberResponses = activeMembers.stream().map(groupsMapper::toResponse).toList();

        response.setGroupMembers(memberResponses);

        return response;
    }

}
