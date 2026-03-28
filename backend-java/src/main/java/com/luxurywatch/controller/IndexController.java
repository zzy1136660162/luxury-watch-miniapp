package com.luxurywatch.controller;

import com.luxurywatch.common.R;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class IndexController {

    @GetMapping("/")
    public R<String> index() {
        return R.success("奢侈品腕表小程序商城后端服务启动成功!");
    }

    @GetMapping("/health")
    public R<String> health() {
        return R.success("ok");
    }
}
