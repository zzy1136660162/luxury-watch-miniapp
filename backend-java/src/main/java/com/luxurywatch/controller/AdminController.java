package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.luxurywatch.common.R;
import com.luxurywatch.dto.LoginDTO;
import com.luxurywatch.entity.AdminUser;
import com.luxurywatch.entity.SysRole;
import com.luxurywatch.mapper.SysRoleMapper;
import com.luxurywatch.service.AdminUserService;
import com.luxurywatch.service.SysMenuService;
import com.luxurywatch.vo.LoginVO;
import com.luxurywatch.vo.PermissionVO;
import com.luxurywatch.vo.UserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 后台管理员登录控制器
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private SysMenuService sysMenuService;

    @Autowired
    private SysRoleMapper sysRoleMapper;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public R<LoginVO> login(@RequestBody LoginDTO dto) {
        // 用户名密码校验
        AdminUser admin = adminUserService.login(dto.getUsername(), dto.getPassword());

        // Sa-Token 登录
        StpUtil.login(admin.getId());

        // 获取 Token
        String token = StpUtil.getTokenValue();

        // 构建响应
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setUserInfo(buildUserInfo(admin));

        return R.success(vo);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    public R<UserInfoVO> getUserInfo() {
        Long userId = StpUtil.getLoginIdAsLong();
        AdminUser admin = adminUserService.getById(userId);

        if (admin == null) {
            return R.error("用户不存在");
        }

        return R.success(buildUserInfo(admin));
    }

    /**
     * 获取用户权限信息
     */
    @GetMapping("/permission")
    public R<PermissionVO> getPermissions() {
        Long userId = StpUtil.getLoginIdAsLong();

        // 获取角色列表
        List<SysRole> roles = sysRoleMapper.selectByUserId(userId);
        List<String> roleCodes = roles.stream()
                .map(SysRole::getRoleCode)
                .collect(Collectors.toList());

        // 获取权限列表
        PermissionVO vo = new PermissionVO();
        vo.setRoles(roleCodes);

        // 获取按钮权限
        List<Map<String, Object>> menus = sysMenuService.getUserMenus(userId);
        List<String> permissions = extractPermissions(menus);
        vo.setPermissions(permissions);

        return R.success(vo);
    }

    /**
     * 获取用户菜单
     */
    @GetMapping("/menus")
    public R<List<Map<String, Object>>> getMenus() {
        // 调试日志
        System.out.println("[MenuAPI] Token: " + StpUtil.getTokenValue());
        System.out.println("[MenuAPI] isLogin: " + StpUtil.isLogin());
        
        if (!StpUtil.isLogin()) {
            System.out.println("[MenuAPI] 用户未登录");
            return R.error("未登录");
        }
        
        Long userId = StpUtil.getLoginIdAsLong();
        System.out.println("[MenuAPI] userId: " + userId);
        
        List<Map<String, Object>> menus = sysMenuService.getUserMenus(userId);
        System.out.println("[MenuAPI] menus size: " + (menus != null ? menus.size() : 0));
        return R.success(menus);
    }

    /**
     * 登出
     */
    @PostMapping("/logout")
    public R<Void> logout() {
        StpUtil.logout();
        return R.success();
    }

    /**
     * 构建用户信息
     */
    private UserInfoVO buildUserInfo(AdminUser admin) {
        UserInfoVO vo = new UserInfoVO();
        vo.setId(admin.getId());
        vo.setUsername(admin.getUsername());
        vo.setNickname(admin.getNickname());
        vo.setAvatar(admin.getAvatar());
        vo.setEmail(admin.getEmail());
        vo.setPhone(admin.getPhone());

        // 获取角色
        List<SysRole> roles = sysRoleMapper.selectByUserId(admin.getId());
        vo.setRoles(roles.stream().map(SysRole::getRoleCode).collect(Collectors.toList()));

        return vo;
    }

    /**
     * 提取菜单权限
     */
    private List<String> extractPermissions(List<Map<String, Object>> menus) {
        List<String> permissions = new java.util.ArrayList<>();
        extractPermissionsRecursive(menus, permissions);
        return permissions;
    }

    private void extractPermissionsRecursive(List<Map<String, Object>> menus, List<String> permissions) {
        for (Map<String, Object> menu : menus) {
            Map<String, Object> meta = (Map<String, Object>) menu.get("meta");
            if (meta != null && meta.get("permission") != null) {
                permissions.add((String) meta.get("permission"));
            }
            Object children = menu.get("children");
            if (children instanceof List) {
                extractPermissionsRecursive((List<Map<String, Object>>) children, permissions);
            }
        }
    }
}
