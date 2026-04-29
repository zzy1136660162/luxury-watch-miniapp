package com.luxurywatch.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.PageResult;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Series;
import com.luxurywatch.mapper.SeriesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系列管理控制器
 */
@RestController
@RequestMapping("/product/series")
public class ProductSeriesController {

    @Autowired
    private SeriesMapper seriesMapper;

    /**
     * 获取系列列表（分页）
     */
    @GetMapping("/list")
    @SaCheckPermission("product:list")
    public R<PageResult<Series>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Series> pageParam = new Page<>(page, size);
        Page<Series> result = seriesMapper.selectPage(pageParam, null);
        
        return R.success(new PageResult<>(
            result.getRecords(),
            result.getTotal(),
            page,
            size
        ));
    }

    /**
     * 获取系列详情
     */
    @GetMapping("/{id}")
    @SaCheckPermission("product:list")
    public R<Series> detail(@PathVariable Integer id) {
        Series series = seriesMapper.selectById(id);
        if (series == null) {
            return R.error("系列不存在");
        }
        return R.success(series);
    }

    /**
     * 创建系列
     */
    @PostMapping
    @SaCheckPermission("product:add")
    public R<Void> create(@RequestBody Series series) {
        seriesMapper.insert(series);
        return R.success();
    }

    /**
     * 更新系列
     */
    @PutMapping("/{id}")
    @SaCheckPermission("product:edit")
    public R<Void> update(@PathVariable Integer id, @RequestBody Series series) {
        series.setId(id);
        seriesMapper.updateById(series);
        return R.success();
    }

    /**
     * 删除系列
     */
    @DeleteMapping("/{id}")
    @SaCheckPermission("product:delete")
    public R<Void> delete(@PathVariable Integer id) {
        seriesMapper.deleteById(id);
        return R.success();
    }
}
