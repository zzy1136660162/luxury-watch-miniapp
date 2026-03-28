package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.User;
import com.luxurywatch.mapper.UserMapper;
import com.luxurywatch.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
