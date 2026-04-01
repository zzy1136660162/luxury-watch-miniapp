package com.luxurywatch.service.impl;

import cn.dev33.satoken.secure.BCrypt;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.luxurywatch.dto.MiniLoginRequest;
import com.luxurywatch.dto.MiniLoginResponse;
import com.luxurywatch.entity.WxUser;
import com.luxurywatch.mapper.WxUserMapper;
import com.luxurywatch.service.MiniLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
public class MiniLoginServiceImpl implements MiniLoginService {

    @Autowired
    private WxUserMapper wxUserMapper;

    @Override
    public MiniLoginResponse login(MiniLoginRequest request, String ip) {
        String username = request.getUsername();
        String password = request.getPassword();

        if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
            throw new RuntimeException("用户名和密码不能为空");
        }

        LambdaQueryWrapper<WxUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WxUser::getUsername, username);
        WxUser existUser = wxUserMapper.selectOne(wrapper);

        WxUser user;
        if (existUser != null) {
            if (!BCrypt.checkpw(password, existUser.getPassword())) {
                throw new RuntimeException("密码错误");
            }
            user = existUser;
            user.setLastLoginTime(LocalDateTime.now());
            user.setLastLoginIp(ip);
            user.setUpdateTime(LocalDateTime.now());
            wxUserMapper.updateById(user);
        } else {
            user = new WxUser();
            user.setUsername(username);
            user.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
            user.setAvatar(request.getAvatar());
            user.setNickname(StringUtils.hasText(request.getNickname()) ? request.getNickname() : username);
            user.setPoints(0);
            user.setGrowthValue(0);
            user.setMemberLevel(1);
            user.setStatus(1);
            user.setLastLoginTime(LocalDateTime.now());
            user.setLastLoginIp(ip);
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            user.setDeleted(0);
            wxUserMapper.insert(user);
        }

        StpUtil.login(user.getId());
        String token = StpUtil.getTokenValue();

        return convertToResponse(user, token);
    }

    @Override
    public MiniLoginResponse getUserInfo(Long userId) {
        WxUser user = wxUserMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return convertToResponse(user, null);
    }

    private MiniLoginResponse convertToResponse(WxUser user, String token) {
        MiniLoginResponse response = new MiniLoginResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setAvatar(user.getAvatar());
        response.setPoints(user.getPoints() != null ? user.getPoints() : 0);
        response.setGrowthValue(user.getGrowthValue() != null ? user.getGrowthValue() : 0);
        response.setMemberLevel(user.getMemberLevel() != null ? user.getMemberLevel() : 1);
        response.setMemberLevelName(getMemberLevelName(user.getMemberLevel()));
        if (token != null) {
            response.setToken(token);
        }
        return response;
    }

    private String getMemberLevelName(Integer level) {
        if (level == null) return "普通会员";
        switch (level) {
            case 1: return "普通会员";
            case 2: return "银卡会员";
            case 3: return "金卡会员";
            case 4: return "钻卡会员";
            default: return "普通会员";
        }
    }
}
