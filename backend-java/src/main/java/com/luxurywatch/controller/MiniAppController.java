package com.luxurywatch.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Product;
import com.luxurywatch.entity.ProductCategory;
import com.luxurywatch.service.ProductService;
import com.luxurywatch.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 小程序API控制器
 * 提供给微信小程序的公开API
 */
@RestController
@RequestMapping("/api")
public class MiniAppController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductCategoryService productCategoryService;

    /**
     * 获取首页数据
     */
    @GetMapping("/home/data")
    public R<Map<String, Object>> getHomeData() {
        try {
            Map<String, Object> data = new HashMap<>();
            
            // 首页轮播图
            data.put("heroImage", "/api/images/heroImage.jpg");
            
            // 品牌故事图片
            data.put("brandStoryImage", "/api/images/brandStoryImage.jpg");
            
            // 系列页面轮播图（与首页区分）
            data.put("collectionHeroImage", "/api/images/2026-04/1775007840866_be6515c4.png");
            
            // 获取新品推荐（最新上架的商品）
            QueryWrapper<Product> newArrivalsWrapper = new QueryWrapper<>();
            newArrivalsWrapper.eq("status", 1)
                             .orderByDesc("create_time")
                             .last("LIMIT 4");
            List<Product> newArrivals = productService.list(newArrivalsWrapper);
            data.put("newArrivals", newArrivals != null ? newArrivals : new ArrayList<>());
            
            // 获取精选商品
            QueryWrapper<Product> featuredWrapper = new QueryWrapper<>();
            featuredWrapper.eq("status", 1)
                          .orderByDesc("sales", "sort")
                          .last("LIMIT 6");
            List<Product> featuredProducts = productService.list(featuredWrapper);
            data.put("featuredProducts", featuredProducts != null ? featuredProducts : new ArrayList<>());
            
            // 获取热门系列（改为展示商品，数量4~6个）
            QueryWrapper<Product> hotSeriesWrapper = new QueryWrapper<>();
            hotSeriesWrapper.eq("status", 1)
                          .orderByDesc("sales", "sort")
                          .last("LIMIT 6");
            List<Product> hotSeries = productService.list(hotSeriesWrapper);
            data.put("hotSeries", hotSeries != null ? hotSeries : new ArrayList<>());
            
            return R.success(data);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取首页数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取新品推荐
     */
    @GetMapping("/home/new-arrivals")
    public R<List<Product>> getNewArrivals() {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .orderByDesc("create_time")
                   .last("LIMIT 4");
            
            List<Product> products = productService.list(wrapper);
            return R.success(products != null ? products : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取新品推荐失败: " + e.getMessage());
        }
    }

    /**
     * 获取热门系列
     */
    @GetMapping("/home/featured-collections")
    public R<List<ProductCategory>> getFeaturedCollections() {
        try {
            QueryWrapper<ProductCategory> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .orderByAsc("sort")
                   .last("LIMIT 6");
            List<ProductCategory> categories = productCategoryService.list(wrapper);
            return R.success(categories != null ? categories : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取热门系列失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有分类（只返回经典、运动、复杂功能、女士）
     */
    @GetMapping("/collection/list")
    public R<List<ProductCategory>> getAllCollections() {
        try {
            QueryWrapper<ProductCategory> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .in("code", Arrays.asList("classic", "sport", "complication", "ladies"))
                   .orderByAsc("sort");
            List<ProductCategory> categories = productCategoryService.list(wrapper);
            return R.success(categories != null ? categories : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取分类列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取指定分类下的商品
     */
    @GetMapping("/collection/{category}")
    public R<Map<String, Object>> getProductsByCollection(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Page<Product> productPage = new Page<>(page, size);
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .eq("category", category)
                   .orderByDesc("sort", "create_time");
            
            Page<Product> result = productService.page(productPage, wrapper);
            
            Map<String, Object> data = new HashMap<>();
            data.put("list", result.getRecords() != null ? result.getRecords() : new ArrayList<>());
            data.put("total", result.getTotal());
            data.put("page", result.getCurrent());
            data.put("size", result.getSize());
            
            return R.success(data);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取分类商品失败: " + e.getMessage());
        }
    }

    /**
     * 获取商品列表
     */
    @GetMapping("/product/online/list")
    public R<Map<String, Object>> getOnlineProductList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String category) {
        try {
            Page<Product> productPage = new Page<>(page, size);
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1);
            
            if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
                wrapper.eq("category", category);
            }
            
            wrapper.orderByDesc("sort", "create_time");
            Page<Product> result = productService.page(productPage, wrapper);
            
            Map<String, Object> data = new HashMap<>();
            data.put("list", result.getRecords() != null ? result.getRecords() : new ArrayList<>());
            data.put("total", result.getTotal());
            data.put("page", result.getCurrent());
            data.put("size", result.getSize());
            
            return R.success(data);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取商品列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取精选商品
     */
    @GetMapping("/product/featured")
    public R<List<Product>> getFeaturedProducts() {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .orderByDesc("sales", "sort")
                   .last("LIMIT 6");
            
            List<Product> products = productService.list(wrapper);
            return R.success(products != null ? products : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取精选商品失败: " + e.getMessage());
        }
    }

    /**
     * 获取商品详情
     */
    @GetMapping("/product/{id}")
    public R<Product> getProductDetail(@PathVariable Long id) {
        try {
            Product product = productService.getById(id);
            if (product == null) {
                return R.error("商品不存在");
            }
            return R.success(product);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取商品详情失败: " + e.getMessage());
        }
    }
}
