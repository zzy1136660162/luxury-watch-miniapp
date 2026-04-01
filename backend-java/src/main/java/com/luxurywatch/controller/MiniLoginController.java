package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.luxurywatch.common.R;
import com.luxurywatch.dto.MiniLoginRequest;
import com.luxurywatch.dto.MiniLoginResponse;
import com.luxurywatch.service.MiniLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/mini")
public class MiniLoginController {

    @Autowired
    private MiniLoginService miniLoginService;

    @PostMapping("/login")
    public R<MiniLoginResponse> login(@RequestBody MiniLoginRequest request, HttpServletRequest httpRequest) {
        try {
            String ip = getClientIp(httpRequest);
            MiniLoginResponse response = miniLoginService.login(request, ip);
            return R.success(response);
        } catch (RuntimeException e) {
            return R.error(e.getMessage());
        }
    }

    @GetMapping("/userinfo")
    public R<MiniLoginResponse> getUserInfo() {
        try {
            if (!StpUtil.isLogin()) {
                return R.error("未登录");
            }
            Long userId = StpUtil.getLoginIdAsLong();
            MiniLoginResponse response = miniLoginService.getUserInfo(userId);
            return R.success(response);
        } catch (RuntimeException e) {
            return R.error(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public R<String> logout() {
        try {
            if (StpUtil.isLogin()) {
                StpUtil.logout();
            }
            return R.success("退出成功");
        } catch (Exception e) {
            return R.success("退出成功");
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (!StringUtils.hasText(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (!StringUtils.hasText(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (!StringUtils.hasText(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (!StringUtils.hasText(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (!StringUtils.hasText(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (!StringUtils.hasText(ip)) {
            ip = "127.0.0.1";
        }
        return ip;
    }

    private static class StringUtils {
        public static boolean hasText(String str) {
            return str != null && !str.trim().isEmpty();
        }
    }
}
