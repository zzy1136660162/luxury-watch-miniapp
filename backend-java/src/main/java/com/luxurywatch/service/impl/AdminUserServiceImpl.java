package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.AdminUser;
import com.luxurywatch.mapper.AdminUserMapper;
import com.luxurywatch.service.AdminUserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserServiceImpl extends ServiceImpl<AdminUserMapper, AdminUser> implements AdminUserService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public AdminUser findByUsername(String username) {
        return baseMapper.selectByUsername(username);
    }

    @Override
    public AdminUser login(String username, String password) {
        AdminUser user = baseMapper.selectByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        if (user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }
}
