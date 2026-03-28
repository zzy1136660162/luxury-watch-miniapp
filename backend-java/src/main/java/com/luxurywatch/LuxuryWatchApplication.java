package com.luxurywatch;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.luxurywatch.mapper")
public class LuxuryWatchApplication {

    public static void main(String[] args) {
        SpringApplication.run(LuxuryWatchApplication.class, args);
    }

}
