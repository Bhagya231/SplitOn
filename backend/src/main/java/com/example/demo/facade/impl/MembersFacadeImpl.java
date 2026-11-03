package com.example.demo.facade.impl;

import com.example.demo.dto.MemberRequest;
import com.example.demo.dto.MemberResponse;
import com.example.demo.facade.api.MembersFacade;
import com.example.demo.service.api.MemberService;
import com.example.demo.util.AppLogger;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class MembersFacadeImpl implements MembersFacade
{
    private static final Logger log = AppLogger.getLogger(MembersFacadeImpl.class);

    private final MemberService memberService;

    @Override
    public MemberResponse addMembers(MemberRequest request)
    {
        try {
            log.info("adding member is reached facade for email {}", request.getEmail());

            return memberService.addMembers(request);

        } catch (Exception e) {
            log.error("error {} while adding the members with email {} ", e.getMessage(),request.getEmail());
            throw new RuntimeException("error while adding the member ",e);
        }
    }

    @Override
    public MemberResponse editMember(UUID id, MemberRequest request)
    {
        try {
            log.info("updating the member is reached the facade for id {}", id);
//            log.info(request.getName(),request.getEmail());

            return memberService.editMember(id,request);
        } catch (Exception e) {
            log.error("error while updating the member with id {}", id);
            throw new RuntimeException("error while updating the member",e);
        }
    }

    @Override
    public List<MemberResponse> getAllMembers()
    {
        try {
            log.info("fetching the all members request reached facade layer");
            return memberService.getAllMembers();
        } catch (Exception e) {
            log.info(" error while fetching the members {} ",e.getMessage());
            throw new RuntimeException("error while fetching the all members ",e);
        }
    }

    @Override
    public void deleteMember(UUID id) {

            log.info(" request reached facade for deleting the member for id {}", id);

            memberService.deleteMember(id);

    }
}
