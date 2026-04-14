package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.ExchangeRecord;
import com.luxurywatch.entity.Product;
import com.luxurywatch.entity.ProductCategory;
import com.luxurywatch.entity.WxUser;
import com.luxurywatch.service.ExchangeRecordService;
import com.luxurywatch.service.ProductService;
import com.luxurywatch.service.ProductCategoryService;
import com.luxurywatch.service.WxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @Autowired
    private WxUserService wxUserService;

    @Autowired
    private ExchangeRecordService exchangeRecordService;

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
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand) {
        try {
            Page<Product> productPage = new Page<>(page, size);
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1);
            
            if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
                wrapper.eq("category", category);
            }
            
            if (brand != null && !brand.isEmpty() && !"all".equalsIgnoreCase(brand)) {
                wrapper.eq("brand", brand);
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
     * 获取所有品牌列表
     */
    @GetMapping("/brands")
    public R<List<String>> getAllBrands() {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .isNotNull("brand")
                   .ne("brand", "")
                   .select("DISTINCT brand");
            List<Product> products = productService.list(wrapper);
            
            List<String> brands = new ArrayList<>();
            if (products != null) {
                for (Product product : products) {
                    if (product.getBrand() != null && !product.getBrand().isEmpty()) {
                        brands.add(product.getBrand());
                    }
                }
            }
            Collections.sort(brands);
            
            return R.success(brands);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取品牌列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取精选商品
     */
    @GetMapping("/product/featured")
    public R<List<Product>> getFeaturedProducts(@RequestParam(required = false) String brand) {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1);
            
            if (brand != null && !brand.isEmpty() && !"all".equalsIgnoreCase(brand)) {
                wrapper.eq("brand", brand);
            }
            
            wrapper.orderByDesc("sales", "sort")
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

    /**
     * 获取当前登录用户信息（包含积分）
     */
    @GetMapping("/user/current")
    public R<WxUser> getCurrentUser() {
        try {
            // 检查是否登录
            if (!StpUtil.isLogin()) {
                return R.error("用户未登录");
            }

            // 获取当前登录用户ID
            Long userId = StpUtil.getLoginIdAsLong();

            // 查询用户信息
            WxUser user = wxUserService.getById(userId);
            if (user == null) {
                return R.error("用户不存在");
            }

            // 返回用户信息（可以只返回必要的字段，增强安全性）
            return R.success(user);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取用户信息失败: " + e.getMessage());
        }
    }

    /**
     * 获取可积分兑换的商品列表
     */
    @GetMapping("/product/redeemable")
    public R<List<Product>> getRedeemableProducts() {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)  // 只查询上架的商品
                   .eq("can_redeem_points", 1)  // 只查询可积分兑换的商品
                   .orderByDesc("sort", "create_time");

            List<Product> products = productService.list(wrapper);
            return R.success(products != null ? products : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取可兑换商品列表失败: " + e.getMessage());
        }
    }

    /**
     * 积分兑换商品
     */
    @PostMapping("/exchange")
    @Transactional(rollbackFor = Exception.class)
    public R<String> exchangeProduct(@RequestBody Map<String, Object> params) {
        try {
            // 检查用户是否登录
            if (!StpUtil.isLogin()) {
                return R.error("用户未登录");
            }

            // 获取参数
            Object productIdObj = params.get("productId");
            if (productIdObj == null) {
                return R.error("商品ID不能为空");
            }
            Long productId = Long.valueOf(productIdObj.toString());

            // 获取当前登录用户
            Long userId = StpUtil.getLoginIdAsLong();
            WxUser user = wxUserService.getById(userId);
            if (user == null) {
                return R.error("用户不存在");
            }

            // 查询商品信息
            Product product = productService.getById(productId);
            if (product == null) {
                return R.error("商品不存在");
            }

            // 检查商品是否可兑换
            if (product.getCanRedeemPoints() == null || product.getCanRedeemPoints() != 1) {
                return R.error("该商品不可积分兑换");
            }

            // 检查积分是否足够
            Integer pointsCost = product.getPointsCost();
            if (pointsCost == null || pointsCost <= 0) {
                return R.error("商品积分设置错误，请联系管理员");
            }

            Integer userPoints = user.getPoints();
            if (userPoints == null) {
                userPoints = 0;
            }

            if (userPoints < pointsCost) {
                return R.error("积分不足，当前积分：" + userPoints + "，需要积分：" + pointsCost);
            }

            // 扣除用户积分
            user.setPoints(userPoints - pointsCost);
            wxUserService.updateById(user);

            // 创建兑换记录，使用用户已保存的信息
            ExchangeRecord record = new ExchangeRecord();
            record.setUserId(userId);
            record.setUserName(user.getNickname() != null ? user.getNickname() : user.getUsername());
            record.setProductId(productId);
            record.setProductName(product.getName());
            record.setProductImage(product.getImage());
            record.setPoints(pointsCost);
            record.setPhone(user.getPhone());
            record.setExchangeTime(LocalDateTime.now());
            record.setStatus(0);  // 待处理
            exchangeRecordService.save(record);

            return R.success("兑换成功");
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return R.error("商品ID格式错误");
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("兑换失败: " + e.getMessage());
        }
    }

    /**
     * 获取当前用户的兑换记录列表
     */
    @GetMapping("/user/exchange-records")
    public R<List<ExchangeRecord>> getUserExchangeRecords() {
        try {
            // 检查用户是否登录
            if (!StpUtil.isLogin()) {
                return R.error("用户未登录");
            }

            // 获取当前登录用户ID
            Long userId = StpUtil.getLoginIdAsLong();

            // 查询用户的兑换记录
            QueryWrapper<ExchangeRecord> wrapper = new QueryWrapper<>();
            wrapper.eq("user_id", userId)
                   .orderByDesc("exchange_time");

            List<ExchangeRecord> records = exchangeRecordService.list(wrapper);
            return R.success(records != null ? records : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取兑换记录失败: " + e.getMessage());
        }
    }
}
