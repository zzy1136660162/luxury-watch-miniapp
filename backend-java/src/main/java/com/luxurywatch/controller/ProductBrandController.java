package com.luxurywatch.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.PageResult;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Brand;
import com.luxurywatch.mapper.BrandMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 品牌管理控制器
 */
@RestController
@RequestMapping("/product/brand")
public class ProductBrandController {

    @Autowired
    private BrandMapper brandMapper;

    /**
     * 获取品牌列表（分页）
     */
    @GetMapping("/list")
    @SaCheckPermission("product:list")
    public R<PageResult<Brand>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Brand> pageParam = new Page<>(page, size);
        Page<Brand> result = brandMapper.selectPage(pageParam, null);
        
        return R.success(new PageResult<>(
            result.getRecords(),
            result.getTotal(),
            page,
            size
        ));
    }

    /**
     * 获取品牌详情
     */
    @GetMapping("/{id}")
    @SaCheckPermission("product:list")
    public R<Brand> detail(@PathVariable Integer id) {
        Brand brand = brandMapper.selectById(id);
        if (brand == null) {
            return R.error("品牌不存在");
        }
        return R.success(brand);
    }

    /**
     * 创建品牌
     */
    @PostMapping
    @SaCheckPermission("product:add")
    public R<Void> create(@RequestBody Brand brand) {
        brandMapper.insert(brand);
        return R.success();
    }

    /**
     * 更新品牌
     */
    @PutMapping("/{id}")
    @SaCheckPermission("product:edit")
    public R<Void> update(@PathVariable Integer id, @RequestBody Brand brand) {
        brand.setId(id);
        brandMapper.updateById(brand);
        return R.success();
    }

    /**
     * 删除品牌
     */
    @DeleteMapping("/{id}")
    @SaCheckPermission("product:delete")
    public R<Void> delete(@PathVariable Integer id) {
        brandMapper.deleteById(id);
        return R.success();
    }
}
