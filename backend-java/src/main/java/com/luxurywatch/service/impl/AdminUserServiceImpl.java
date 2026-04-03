package com.luxurywatch.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.AdminUser;
import com.luxurywatch.entity.AdminUserRole;
import com.luxurywatch.entity.SysRole;
import com.luxurywatch.mapper.AdminUserMapper;
import com.luxurywatch.mapper.AdminUserRoleMapper;
import com.luxurywatch.mapper.SysRoleMapper;
import com.luxurywatch.service.AdminUserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminUserServiceImpl extends ServiceImpl<AdminUserMapper, AdminUser> implements AdminUserService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SysRoleMapper sysRoleMapper;
    private final AdminUserRoleMapper adminUserRoleMapper;

    public AdminUserServiceImpl(SysRoleMapper sysRoleMapper, AdminUserRoleMapper adminUserRoleMapper) {
        this.sysRoleMapper = sysRoleMapper;
        this.adminUserRoleMapper = adminUserRoleMapper;
    }

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

    @Override
    @Transactional
    public AdminUser register(String username, String password) {
        AdminUser existUser = baseMapper.selectByUsername(username);
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        AdminUser user = new AdminUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(username);
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setDeleted(0);

        baseMapper.insert(user);

        // 分配默认管理员角色
        LambdaQueryWrapper<SysRole> roleWrapper = new LambdaQueryWrapper<>();
        roleWrapper.eq(SysRole::getRoleCode, "ADMIN");
        SysRole adminRole = sysRoleMapper.selectOne(roleWrapper);
        if (adminRole != null) {
            AdminUserRole userRole = new AdminUserRole();
            userRole.setUserId(user.getId());
            userRole.setRoleId(adminRole.getId());
            userRole.setCreateTime(LocalDateTime.now());
            adminUserRoleMapper.insert(userRole);
        }

        return user;
    }

    @Override
    public List<Map<String, Object>> listAdmins(String keyword, Integer status) {
        LambdaQueryWrapper<AdminUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AdminUser::getDeleted, 0);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                .like(AdminUser::getUsername, keyword)
                .or()
                .like(AdminUser::getNickname, keyword)
            );
        }

        if (status != null) {
            wrapper.eq(AdminUser::getStatus, status);
        }

        wrapper.orderByDesc(AdminUser::getCreateTime);

        List<AdminUser> users = baseMapper.selectList(wrapper);
        List<Map<String, Object>> result = new ArrayList<>();

        for (AdminUser user : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("username", user.getUsername());
            map.put("nickname", user.getNickname());
            map.put("email", user.getEmail());
            map.put("phone", user.getPhone());
            map.put("status", user.getStatus());
            map.put("createTime", user.getCreateTime());

            // 获取用户角色
            List<SysRole> roles = sysRoleMapper.selectByUserId(user.getId());
            if (!roles.isEmpty()) {
                map.put("roleId", roles.get(0).getId());
                map.put("roleName", roles.get(0).getRoleName());
            } else {
                map.put("roleId", null);
                map.put("roleName", "无角色");
            }

            result.add(map);
        }

        return result;
    }

    @Override
    @Transactional
    public boolean createAdmin(AdminUser admin, Long roleId) {
        // 检查用户名是否已存在
        AdminUser existUser = baseMapper.selectByUsername(admin.getUsername());
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 设置密码加密
        if (StringUtils.hasText(admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }

        admin.setCreateTime(LocalDateTime.now());
        admin.setUpdateTime(LocalDateTime.now());
        admin.setDeleted(0);

        baseMapper.insert(admin);

        // 分配角色
        if (roleId != null) {
            AdminUserRole userRole = new AdminUserRole();
            userRole.setUserId(admin.getId());
            userRole.setRoleId(roleId);
            userRole.setCreateTime(LocalDateTime.now());
            adminUserRoleMapper.insert(userRole);
        }

        return true;
    }

    @Override
    @Transactional
    public boolean updateAdmin(AdminUser admin, Long roleId) {
        AdminUser existUser = baseMapper.selectById(admin.getId());
        if (existUser == null) {
            throw new RuntimeException("管理员不存在");
        }

        // 检查用户名是否被其他用户使用
        AdminUser byUsername = baseMapper.selectByUsername(admin.getUsername());
        if (byUsername != null && !byUsername.getId().equals(admin.getId())) {
            throw new RuntimeException("用户名已存在");
        }

        // 更新基本信息
        existUser.setUsername(admin.getUsername());
        existUser.setNickname(admin.getNickname());
        existUser.setEmail(admin.getEmail());
        existUser.setPhone(admin.getPhone());
        existUser.setStatus(admin.getStatus());
        existUser.setUpdateTime(LocalDateTime.now());

        // 如果传了新密码，则更新密码
        if (StringUtils.hasText(admin.getPassword())) {
            existUser.setPassword(passwordEncoder.encode(admin.getPassword()));
        }

        baseMapper.updateById(existUser);

        // 更新角色
        if (roleId != null) {
            // 先删除该用户所有旧角色
            adminUserRoleMapper.deleteByUserId(admin.getId());
            // 检查是否已存在目标角色
            int exists = adminUserRoleMapper.countByUserIdAndRoleId(admin.getId(), roleId);
            if (exists == 0) {
                AdminUserRole userRole = new AdminUserRole();
                userRole.setUserId(admin.getId());
                userRole.setRoleId(roleId);
                userRole.setCreateTime(LocalDateTime.now());
                adminUserRoleMapper.insert(userRole);
            }
        }

        return true;
    }

    @Override
    @Transactional
    public boolean deleteAdmin(Long id) {
        AdminUser user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("管理员不存在");
        }

        // 不能删除自己
        Long currentUserId = StpUtil.getLoginIdAsLong();
        if (id.equals(currentUserId)) {
            throw new RuntimeException("不能删除自己");
        }

        // 逻辑删除
        user.setDeleted(1);
        user.setUpdateTime(LocalDateTime.now());
        baseMapper.updateById(user);

        // 删除用户角色关联
        LambdaQueryWrapper<AdminUserRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AdminUserRole::getUserId, id);
        adminUserRoleMapper.delete(wrapper);

        return true;
    }

    @Override
    public boolean updateStatus(Long id, Integer status) {
        AdminUser user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("管理员不存在");
        }

        user.setStatus(status);
        user.setUpdateTime(LocalDateTime.now());
        baseMapper.updateById(user);
        return true;
    }
}
