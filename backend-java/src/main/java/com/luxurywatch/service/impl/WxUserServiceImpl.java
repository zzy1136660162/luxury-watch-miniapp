package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.WxUser;
import com.luxurywatch.mapper.WxUserMapper;
import com.luxurywatch.service.WxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class WxUserServiceImpl extends ServiceImpl<WxUserMapper, WxUser> implements WxUserService {

    @Autowired
    private WxUserMapper wxUserMapper;

    @Override
    public Page<WxUser> pageWxUser(Page<WxUser> page, String keyword, String phone, Integer memberLevel, Integer status) {
        LambdaQueryWrapper<WxUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WxUser::getDeleted, 0);
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                .like(WxUser::getUsername, keyword)
                .or()
                .like(WxUser::getNickname, keyword)
            );
        }
        
        if (StringUtils.hasText(phone)) {
            wrapper.eq(WxUser::getPhone, phone);
        }
        
        if (memberLevel != null) {
            wrapper.eq(WxUser::getMemberLevel, memberLevel);
        }
        
        if (status != null) {
            wrapper.eq(WxUser::getStatus, status);
        }
        
        wrapper.orderByDesc(WxUser::getCreateTime);
        
        return wxUserMapper.selectPage(page, wrapper);
    }

    @Override
    public boolean updateStatus(Long id, Integer status) {
        WxUser user = new WxUser();
        user.setId(id);
        user.setStatus(status);
        return updateById(user);
    }

    @Override
    public boolean updateMemberLevel(Long id, Integer level) {
        WxUser user = new WxUser();
        user.setId(id);
        user.setMemberLevel(level);
        return updateById(user);
    }

    @Override
    public boolean adjustPoints(Long id, Integer points, String description) {
        WxUser user = getById(id);
        if (user == null) {
            return false;
        }
        
        WxUser updateUser = new WxUser();
        updateUser.setId(id);
        updateUser.setPoints(user.getPoints() + points);
        
        return updateById(updateUser);
    }

    @Override
    public boolean resetPassword(Long id) {
        WxUser user = new WxUser();
        user.setId(id);
        // 默认密码为123456（BCrypt加密后的值）
        user.setPassword("$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6");
        return updateById(user);
    }
}