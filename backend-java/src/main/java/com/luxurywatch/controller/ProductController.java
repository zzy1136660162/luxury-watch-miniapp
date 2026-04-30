package com.luxurywatch.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Brand;
import com.luxurywatch.entity.Product;
import com.luxurywatch.entity.ProductCategory;
import com.luxurywatch.entity.Series;
import com.luxurywatch.mapper.BrandMapper;
import com.luxurywatch.mapper.SeriesMapper;
import com.luxurywatch.service.ProductCategoryService;
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

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private BrandMapper brandMapper;

    @Autowired
    private SeriesMapper seriesMapper;

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
        // 根据brandId获取品牌名称
        if (product.getBrandId() != null) {
            Brand brand = brandMapper.selectById(product.getBrandId());
            if (brand != null) {
                product.setBrand(brand.getName());
            }
        }
        // 根据seriesId获取系列名称
        if (product.getSeriesId() != null) {
            Series series = seriesMapper.selectById(product.getSeriesId());
            if (series != null) {
                product.setSeries(series.getName());
            }
        }
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
        // 根据brandId获取品牌名称
        if (product.getBrandId() != null) {
            Brand brand = brandMapper.selectById(product.getBrandId());
            if (brand != null) {
                product.setBrand(brand.getName());
            }
        }
        // 根据seriesId获取系列名称
        if (product.getSeriesId() != null) {
            Series series = seriesMapper.selectById(product.getSeriesId());
            if (series != null) {
                product.setSeries(series.getName());
            }
        }
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
     * 获取品牌列表（用于Autocomplete搜索）
     * 支持根据query模糊搜索，返回品牌名称和商品数量
     */
    @GetMapping("/brands")
    public R<List<Map<String, Object>>> getBrands(@RequestParam(required = false) String query) {
        List<Map<String, Object>> brands = productService.searchBrands(query);
        return R.success(brands);
    }

    /**
     * 获取系列列表（用于Autocomplete搜索）
     * 根据品牌筛选，支持根据query模糊搜索，返回系列名称和商品数量
     */
    @GetMapping("/series")
    public R<List<Map<String, Object>>> getSeries(
            @RequestParam String brand,
            @RequestParam(required = false) String query) {
        List<Map<String, Object>> series = productService.searchSeries(brand, query);
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

    // ==================== 商品分类管理 ====================

    /**
     * 获取商品分类列表
     */
    @GetMapping("/category/list")
    @SaCheckPermission("product:list")
    public R<List<ProductCategory>> getCategoryList() {
        List<ProductCategory> list = productCategoryService.list();
        return R.success(list);
    }

    /**
     * 获取商品分类详情
     */
    @GetMapping("/category/{id}")
    @SaCheckPermission("product:list")
    public R<ProductCategory> getCategoryDetail(@PathVariable Long id) {
        ProductCategory category = productCategoryService.getById(id);
        if (category == null) {
            return R.error("分类不存在");
        }
        return R.success(category);
    }

    /**
     * 创建商品分类
     */
    @PostMapping("/category")
    @SaCheckPermission("product:add")
    public R<Void> createCategory(@RequestBody ProductCategory category) {
        // 如果没有传入code，自动生成
        if (category.getCode() == null || category.getCode().trim().isEmpty()) {
            category.setCode(generateCode(category.getName()));
        }
        productCategoryService.save(category);
        return R.success();
    }

    /**
     * 根据分类名称生成编码
     */
    private String generateCode(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "CATEGORY_" + System.currentTimeMillis();
        }
        // 取拼音首字母 + 时间戳
        StringBuilder code = new StringBuilder();
        for (char c : name.toCharArray()) {
            if (Character.isLetter(c)) {
                code.append(Character.toUpperCase(c));
                if (code.length() >= 4) break;
            }
        }
        if (code.length() == 0) {
            code.append("CAT");
        }
        return code.toString() + "_" + System.currentTimeMillis();
    }

    /**
     * 更新商品分类
     */
    @PutMapping("/category/{id}")
    @SaCheckPermission("product:edit")
    public R<Void> updateCategory(@PathVariable Long id, @RequestBody ProductCategory category) {
        category.setId(id);
        productCategoryService.updateById(category);
        return R.success();
    }

    /**
     * 删除商品分类
     */
    @DeleteMapping("/category/{id}")
    @SaCheckPermission("product:delete")
    public R<Void> deleteCategory(@PathVariable Long id) {
        productCategoryService.removeById(id);
        return R.success();
    }
}
