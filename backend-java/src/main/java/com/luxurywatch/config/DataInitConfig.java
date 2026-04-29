package com.luxurywatch.config;

import com.luxurywatch.service.impl.DataInitializerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 应用启动时初始化数据
 */
@Component
public class DataInitConfig implements ApplicationRunner {

    @Autowired
    private DataInitializerService dataInitializerService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("=================================================");
        System.out.println("开始检查并初始化测试数据...");
        dataInitializerService.initializeTestData();
        System.out.println("数据初始化检查完成");
        System.out.println("=================================================");
    }
}
