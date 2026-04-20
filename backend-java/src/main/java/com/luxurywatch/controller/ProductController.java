package com.luxurywatch.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Brand;
import com.luxurywatch.entity.Product;
import com.luxurywatch.entity.Series;
import com.luxurywatch.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商品管理控制器
 */
@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * 获取商品列表（分页）
     */
    @GetMapping("/list")
    @SaCheckPermission("product:list")
    public R<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String series,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer status) {

        IPage<Product> productPage = productService.getProductPage(page, size, name, brand, series, category, status);

        Map<String, Object> result = new HashMap<>();
        result.put("list", productPage.getRecords());
        result.put("total", productPage.getTotal());
        result.put("page", productPage.getCurrent());
        result.put("size", productPage.getSize());

        return R.success(result);
    }

    /**
     * 获取商品详情
     */
    @GetMapping("/{id}")
    @SaCheckPermission("product:list")
    public R<Product> detail(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return R.error("商品不存在");
        }
        return R.success(product);
    }

    /**
     * 创建商品
     */
    @PostMapping
    @SaCheckPermission("product:add")
    public R<Void> create(@RequestBody Product product) {
        boolean success = productService.createProduct(product);
        if (success) {
            return R.success();
        }
        return R.error("创建失败");
    }

    /**
     * 更新商品
     */
    @PutMapping("/{id}")
    @SaCheckPermission("product:edit")
    public R<Void> update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        boolean success = productService.updateProduct(product);
        if (success) {
            return R.success();
        }
        return R.error("更新失败");
    }

    /**
     * 删除商品
     */
    @DeleteMapping("/{id}")
    @SaCheckPermission("product:delete")
    public R<Void> delete(@PathVariable Long id) {
        boolean success = productService.deleteProduct(id);
        if (success) {
            return R.success();
        }
        return R.error("删除失败");
    }

    /**
     * 批量删除商品
     */
    @PostMapping("/batch-delete")
    @SaCheckPermission("product:batchDelete")
    public R<Void> batchDelete(@RequestBody Map<String, List<Long>> params) {
        List<Long> ids = params.get("ids");
        if (ids == null || ids.isEmpty()) {
            return R.error("请选择要删除的商品");
        }
        boolean success = productService.batchDeleteProducts(ids);
        if (success) {
            return R.success();
        }
        return R.error("批量删除失败");
    }

    /**
     * 更新商品状态
     */
    @PutMapping("/{id}/status")
    @SaCheckPermission("product:updateStatus")
    public R<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> params) {
        Integer status = params.get("status");
        if (status == null || (status != 0 && status != 1)) {
            return R.error("状态值无效");
        }
        boolean success = productService.updateProductStatus(id, status);
        if (success) {
            return R.success();
        }
        return R.error("状态更新失败");
    }

    /**
     * 更新商品库存
     */
    @PutMapping("/{id}/stock")
    @SaCheckPermission("product:edit")
    public R<Void> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> params) {
        Integer stock = params.get("stock");
        if (stock == null || stock < 0) {
            return R.error("库存值无效");
        }
        boolean success = productService.updateProductStock(id, stock);
        if (success) {
            return R.success();
        }
        return R.error("库存更新失败");
    }

    /**
     * 获取所有品牌列表（用于前端下拉选择）
     */
    @GetMapping("/brands")
    public R<List<Brand>> getBrands() {
        List<Brand> brands = productService.getAllBrands();
        return R.success(brands);
    }

    /**
     * 根据品牌ID获取系列列表
     */
    @GetMapping("/series")
    public R<List<Series>> getSeriesByBrand(@RequestParam Integer brandId) {
        List<Series> series = productService.getSeriesByBrandId(brandId);
        return R.success(series);
    }

    /**
     * 根据品牌和系列名查询已存在的系列Logo
     */
    @GetMapping("/series-logo")
    public R<String> getSeriesLogo(@RequestParam String brand, @RequestParam String series) {
        String logo = productService.getSeriesLogo(brand, series);
        return R.success(logo);
    }

    /**
     * 根据品牌名称查询品牌信息（是否存在、品牌图片）
     */
    @GetMapping("/brand-info")
    public R<Map<String, Object>> getBrandInfo(@RequestParam String brand) {
        Map<String, Object> info = new HashMap<>();
        info.put("exists", productService.existsByBrand(brand));
        String brandImage = productService.getBrandImage(brand);
        info.put("brandImage", brandImage != null ? brandImage : "");
        return R.success(info);
    }
}
