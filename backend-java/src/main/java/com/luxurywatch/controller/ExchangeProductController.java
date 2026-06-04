package com.luxurywatch.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.PageResult;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.ExchangeProduct;
import com.luxurywatch.service.ExchangeProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 积分兑换商品控制器
 */
@RestController
@RequestMapping("/exchange/product")
public class ExchangeProductController {

    @Autowired
    private ExchangeProductService exchangeProductService;

    /**
     * 获取兑换商品列表（分页）
     */
    @GetMapping("/list")
    public R<PageResult<Map<String, Object>>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer status) {

        // 创建分页对象
        Page<ExchangeProduct> pageParam = new Page<>(page, size);

        // 构建查询条件
        LambdaQueryWrapper<ExchangeProduct> wrapper = new LambdaQueryWrapper<>();

        if (name != null && !name.trim().isEmpty()) {
            wrapper.like(ExchangeProduct::getName, name);
        }
        if (status != null) {
            wrapper.eq(ExchangeProduct::getStatus, status);
        }

        // 按排序字段倒序，然后按创建时间倒序
        wrapper.orderByDesc(ExchangeProduct::getSort)
               .orderByDesc(ExchangeProduct::getCreateTime);

        // 执行分页查询
        Page<ExchangeProduct> resultPage = exchangeProductService.page(pageParam, wrapper);

        // 转换为Map列表
        List<Map<String, Object>> list = resultPage.getRecords().stream().map(product -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", product.getId());
            map.put("name", product.getName());
            map.put("code", product.getCode());
            map.put("image", product.getImage());
            map.put("pointsCost", product.getPointsCost());
            map.put("stock", product.getStock());
            map.put("description", product.getDescription());
            map.put("status", product.getStatus());
            map.put("sort", product.getSort());
            map.put("createTime", product.getCreateTime());
            map.put("updateTime", product.getUpdateTime());
            return map;
        }).toList();

        // 构建分页结果
        PageResult<Map<String, Object>> result = new PageResult<>(list, resultPage.getTotal(), page, size);

        return R.success(result);
    }

    /**
     * 获取兑换商品详情
     */
    @GetMapping("/{id}")
    public R<Map<String, Object>> detail(@PathVariable Long id) {
        ExchangeProduct product = exchangeProductService.getById(id);
        if (product == null) {
            return R.error("商品不存在");
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", product.getId());
        map.put("name", product.getName());
        map.put("code", product.getCode());
        map.put("image", product.getImage());
        map.put("pointsCost", product.getPointsCost());
        map.put("stock", product.getStock());
        map.put("description", product.getDescription());
        map.put("status", product.getStatus());
        map.put("sort", product.getSort());
        map.put("createTime", product.getCreateTime());
        map.put("updateTime", product.getUpdateTime());

        return R.success(map);
    }

    /**
     * 创建兑换商品
     */
    @PostMapping
    public R<Void> create(@RequestBody ExchangeProduct product) {
        // 设置默认值
        if (product.getStatus() == null) {
            product.setStatus(1);
        }
        if (product.getStock() == null) {
            product.setStock(0);
        }
        if (product.getPointsCost() == null) {
            product.setPointsCost(0);
        }
        if (product.getSort() == null) {
            product.setSort(0);
        }

        boolean success = exchangeProductService.save(product);
        if (success) {
            return R.success();
        } else {
            return R.error("创建失败");
        }
    }

    /**
     * 更新兑换商品
     */
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody ExchangeProduct product) {
        ExchangeProduct existing = exchangeProductService.getById(id);
        if (existing == null) {
            return R.error("商品不存在");
        }

        product.setId(id);
        boolean success = exchangeProductService.updateById(product);
        if (success) {
            return R.success();
        } else {
            return R.error("更新失败");
        }
    }

    /**
     * 删除兑换商品
     */
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        boolean success = exchangeProductService.removeById(id);
        if (success) {
            return R.success();
        } else {
            return R.error("删除失败");
        }
    }

    /**
     * 批量删除兑换商品
     */
    @PostMapping("/batch-delete")
    public R<Void> batchDelete(@RequestBody Map<String, List<Long>> params) {
        List<Long> ids = params.get("ids");
        if (ids == null || ids.isEmpty()) {
            return R.error("ID列表不能为空");
        }

        boolean success = exchangeProductService.removeByIds(ids);
        if (success) {
            return R.success();
        } else {
            return R.error("删除失败");
        }
    }
}
