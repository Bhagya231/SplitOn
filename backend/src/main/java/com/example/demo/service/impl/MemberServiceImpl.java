package com.example.demo.service.impl;

import com.example.demo.entity.SplitMembers;
import com.example.demo.exceptions.BadRequestException;
import com.example.demo.exceptions.EmailAlreadyExistException;
import com.example.demo.dto.MemberRequest;
import com.example.demo.dto.MemberResponse;
import com.example.demo.entity.Members;

import com.example.demo.mappers.MembersMapper;
import com.example.demo.repository.MembersRepository;
import com.example.demo.repository.SplitMembersRepository;
import com.example.demo.service.api.MemberService;
import com.example.demo.util.AppLogger;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.springframework.beans.BeanUtils;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService
{

    private static final Logger log = AppLogger.getLogger(MemberServiceImpl.class);

    private final MembersRepository membersRepository;
    private final MembersMapper membersMapper;
    private final SplitMembersRepository splitMembersRepository;



    @Override
    public MemberResponse addMembers(MemberRequest request)
    {
        log.info(" adding member is started in service for user {}", request.getName());

        try {
            long exist = membersRepository.existByEmail(request.getEmail());

            if(exist > 0)
            {
                log.warn("Member already exist with email {}", request.getEmail());
                throw new EmailAlreadyExistException("Member is already exist by the email ");

            }

            Members members = new Members();

            members.setEmail(request.getEmail());
            members.setName(request.getName());

            Members savedMember = membersRepository.save(members);

            MemberResponse memberResponse = new MemberResponse();

            BeanUtils.copyProperties(savedMember,memberResponse);

            log.info("Member is added successfully with id {}", savedMember.getId());

            return memberResponse;
        }catch (EmailAlreadyExistException e)
        {
            log.error("email already exist with email {}", request.getEmail());
            throw e;
        }catch (Exception e)
        {
            log.error("unexpected error {} while adding members ", e.getMessage());
            throw new RuntimeException(" unexpected error wile adding members",e);
        }


    }


    @Override
    public List<MemberResponse> getAllMembers()
    {
        try {
            log.info("started getting all member  ");

            List<Members> members = membersRepository.getAllMembers();


            log.info("fetching the all members is completed successfully");
            return members.stream().map(membersMapper::toResponse).toList();

        } catch (Exception e) {
            log.info("error while fetching the members {} ",e.getMessage());
            throw new RuntimeException("error while fetching the error ",e);
        }

    }


    @Override
    public MemberResponse editMember(UUID id,MemberRequest request)
    {
        log.info(" editing member is started in service for Member {}", id);
       try {
           Members members = membersRepository.getMemberById(id.toString())
                   .orElseThrow(() ->
                   {
                       log.warn("member is not exist with id {}", id);
                       return new EntityNotFoundException("Member not found ");
                   });


           members.setName(request.getName());
           members.setEmail(request.getEmail());
           Members updatedMember = membersRepository.save(members);

           log.info("updating the member is completed successfully");

           MemberResponse memberResponse = new MemberResponse();

           BeanUtils.copyProperties(updatedMember,memberResponse);

           return  memberResponse;


       }catch (EntityNotFoundException e)
       {
           log.error("user not found with id  {}", id);
           throw e;
       }catch (Exception e)
       {
           log.error("unexpected error {} while updating ", e.getMessage());
           throw new RuntimeException(" unexpected error wile updating members",e);
       }

    }

    @Override
    @Transactional
    public void deleteMember(UUID id)
    {

       try {
           log.info("deleting the member is started in service ");

           Members member = membersRepository.getMemberById(id.toString())
                   .orElseThrow(() ->
                   {
                       log.warn("member is not found with id {}", id);
                       return new EntityNotFoundException("Member not found ");
                   });


           List<SplitMembers> splitMember = splitMembersRepository.getSplitMemberByMemberId(id.toString());

           BigDecimal totalShare = BigDecimal.ZERO;
           for(SplitMembers user: splitMember )
           {

               totalShare = totalShare.add(user.getValue());
           }

           if(!totalShare.equals(BigDecimal.ZERO))
           {
               log.warn("This member is included in expenses and cannot be deleted. {}",id);
               throw new BadRequestException("This member is included in expenses and cannot be deleted.");
           }


           member.setIsDeleted(true);

           membersRepository.save(member);

           log.info("deleting member is completed successfully");
       }catch (EntityNotFoundException | IllegalArgumentException  e)
       {
           log.error("member not found error id {}",id);
           throw e;
       } catch (BadRequestException e)
       {
           log.error("This member is included in expenses and cannot be deleted. {}",id);
           throw e;
       }
       catch (Exception e)
       {
           log.info("error while deleting the expense id {} ",e.getMessage());
           throw new RuntimeException("error while deleting expense ",e);
       }





    }






}
