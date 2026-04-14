package com.luxurywatch.exception;

import cn.dev33.satoken.exception.NotLoginException;
import com.luxurywatch.common.R;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理未登录异常
     */
    @ExceptionHandler(NotLoginException.class)
    public R<String> handleNotLoginException(NotLoginException e, HttpServletRequest request) {
        e.printStackTrace();
        return R.error(401, "登录已过期，请重新登录");
    }

    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    public R<String> handleException(Exception e) {
        e.printStackTrace();
        return R.error("系统错误: " + e.getMessage());
    }
}
