package com.luxurywatch.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.PageResult;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.User;
import com.luxurywatch.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public R<PageResult<User>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Page<User> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(User::getUsername, keyword)
                   .or()
                   .like(User::getNickname, keyword);
        }
        Page<User> result = userService.page(page, wrapper);
        return R.success(new PageResult<>(result.getRecords(), result.getTotal()));
    }

    @GetMapping("/{id}")
    public R<User> getById(@PathVariable Long id) {
        User user = userService.getById(id);
        return user != null ? R.success(user) : R.error("用户不存在");
    }

    @PostMapping
    public R<Boolean> save(@RequestBody User user) {
        return R.success(userService.save(user));
    }

    @PutMapping
    public R<Boolean> update(@RequestBody User user) {
        return R.success(userService.updateById(user));
    }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) {
        return R.success(userService.removeById(id));
    }
}
