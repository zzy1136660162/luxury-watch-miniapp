package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Brand;
import com.luxurywatch.entity.ExchangeRecord;
import com.luxurywatch.entity.Product;
import com.luxurywatch.entity.ProductCategory;
import com.luxurywatch.entity.Series;
import com.luxurywatch.entity.WxUser;
import com.luxurywatch.mapper.BrandMapper;
import com.luxurywatch.mapper.SeriesMapper;
import com.luxurywatch.service.ExchangeRecordService;
import com.luxurywatch.service.ProductService;
import com.luxurywatch.service.ProductCategoryService;
import com.luxurywatch.service.WxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private BrandMapper brandMapper;

    @Autowired
    private SeriesMapper seriesMapper;

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
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String caseSize,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String strap,
            @RequestParam(required = false) String waterResistance,
            @RequestParam(required = false) String powerReserve) {
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
            
            // 价格筛选
            if (price != null && !price.isEmpty()) {
                wrapper = parsePriceRange(wrapper, price);
            }
            
            // 表盘直径筛选
            if (caseSize != null && !caseSize.isEmpty()) {
                wrapper = parseCaseSizeRange(wrapper, caseSize);
            }
            
            // 材质筛选
            if (material != null && !material.isEmpty()) {
                wrapper.like("material", material);
            }
            
            // 表带筛选
            if (strap != null && !strap.isEmpty()) {
                wrapper.like("strap", strap);
            }
            
            // 防水筛选
            if (waterResistance != null && !waterResistance.isEmpty()) {
                wrapper = parseWaterResistanceRange(wrapper, waterResistance);
            }
            
            // 动力储备筛选
            if (powerReserve != null && !powerReserve.isEmpty()) {
                wrapper = parsePowerReserveRange(wrapper, powerReserve);
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
     * 获取所有品牌列表（从 brand 表）
     */
    @GetMapping("/brands")
    public R<List<Brand>> getAllBrands() {
        try {
            // 从 brand 表查询所有品牌
            List<Brand> brands = brandMapper.selectList(null);
            return R.success(brands);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取品牌列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据品牌名称获取该品牌的所有系列
     */
    @GetMapping("/series/by-brand")
    public R<List<String>> getSeriesByBrand(@RequestParam String brand) {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1)
                   .eq("brand", brand)
                   .isNotNull("series")
                   .ne("series", "");
            
            List<Product> products = productService.list(wrapper);
            
            // 使用 Set 去重
            Set<String> seriesSet = new LinkedHashSet<>();
            if (products != null) {
                for (Product product : products) {
                    if (product.getSeries() != null && !product.getSeries().isEmpty()) {
                        seriesSet.add(product.getSeries());
                    }
                }
            }
            
            List<String> series = new ArrayList<>(seriesSet);
            Collections.sort(series);
            
            return R.success(series);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取品牌系列失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有系列列表（从 series 表）
     */
    @GetMapping("/series/all")
    public R<List<Map<String, Object>>> getAllSeries() {
        try {
            List<Series> seriesList = seriesMapper.selectList(null);

            // 获取品牌名称映射
            List<Integer> brandIds = seriesList.stream()
                    .map(Series::getBrandId)
                    .distinct()
                    .collect(Collectors.toList());

            Map<Integer, String> brandNameMap = new HashMap<>();
            if (!brandIds.isEmpty()) {
                List<Brand> brands = brandMapper.selectBatchIds(brandIds);
                brandNameMap = brands.stream()
                        .collect(Collectors.toMap(Brand::getId, Brand::getName));
            }

            // 转换为返回格式
            List<Map<String, Object>> result = new ArrayList<>();
            for (Series series : seriesList) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", series.getId());
                item.put("brandId", series.getBrandId());
                item.put("brand", brandNameMap.getOrDefault(series.getBrandId(), ""));
                item.put("series", series.getName());
                item.put("name", series.getName());
                if (series.getLogo() != null && !series.getLogo().isEmpty()) {
                    item.put("logo", series.getLogo());
                }
                result.add(item);
            }

            return R.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取系列列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取热门系列（从 series 表，返回所有系列）
     */
    @GetMapping("/series/hot")
    public R<List<Map<String, Object>>> getHotSeries() {
        try {
            // 查询所有系列（不限于有logo的）
            List<Series> seriesList = seriesMapper.selectList(
                    new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Series>()
                            .orderByDesc(Series::getId)
                            .last("LIMIT 10")
            );

            // 获取品牌名称映射
            List<Integer> brandIds = seriesList.stream()
                    .map(Series::getBrandId)
                    .distinct()
                    .collect(Collectors.toList());

            Map<Integer, String> brandNameMap = new HashMap<>();
            if (!brandIds.isEmpty()) {
                List<Brand> brands = brandMapper.selectBatchIds(brandIds);
                brandNameMap = brands.stream()
                        .collect(Collectors.toMap(Brand::getId, Brand::getName));
            }

            // 转换为返回格式
            List<Map<String, Object>> result = new ArrayList<>();
            for (Series series : seriesList) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", series.getId());
                item.put("brandId", series.getBrandId());
                item.put("brand", brandNameMap.getOrDefault(series.getBrandId(), ""));
                item.put("series", series.getName());
                item.put("name", series.getName());
                item.put("logo", series.getLogo());
                result.add(item);
            }

            return R.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取热门系列失败: " + e.getMessage());
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
            // 优先使用传入的地址，其次使用用户已保存的地址
            String address = params.get("address") != null ? params.get("address").toString() : user.getAddress();
            record.setPhone(params.get("phone") != null ? params.get("phone").toString() : user.getPhone());
            record.setAddress(address);
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

    /**
     * 更新用户信息
     */
    @PostMapping("/user/update")
    public R<Boolean> updateUserInfo(@RequestBody Map<String, String> params) {
        try {
            // 检查用户是否登录
            if (!StpUtil.isLogin()) {
                return R.error("用户未登录");
            }

            // 获取当前登录用户ID
            Long userId = StpUtil.getLoginIdAsLong();

            // 获取用户信息
            WxUser user = wxUserService.getById(userId);
            if (user == null) {
                return R.error("用户不存在");
            }

            // 更新地址
            if (params.containsKey("address")) {
                user.setAddress(params.get("address"));
            }

            // 保存更新
            boolean success = wxUserService.updateById(user);
            return R.success(success);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("更新用户信息失败: " + e.getMessage());
        }
    }

    /**
     * 搜索商品
     */
    @GetMapping("/product/search")
    public R<List<Product>> searchProducts(@RequestParam String keyword) {
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return R.error("搜索关键词不能为空");
            }

            // 模糊查询商品
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.like("name", keyword.trim())
                   .or()
                   .like("name_en", keyword.trim())
                   .or()
                   .like("code", keyword.trim())
                   .or()
                   .like("brand", keyword.trim())
                   .or()
                   .like("series", keyword.trim())
                   .or()
                   .like("description", keyword.trim())
                   .eq("status", 1)  // 只查询上架的商品
                   .orderByDesc("sort", "create_time");

            List<Product> products = productService.list(wrapper);
            return R.success(products != null ? products : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("搜索失败: " + e.getMessage());
        }
    }

    /**
     * 高级筛选商品
     */
    @GetMapping("/product/filter")
    public R<List<Product>> filterProducts(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String series,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String caseSize,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String strap,
            @RequestParam(required = false) String waterResistance,
            @RequestParam(required = false) String powerReserve) {
        try {
            QueryWrapper<Product> wrapper = new QueryWrapper<>();
            wrapper.eq("status", 1);

            if (brand != null && !brand.trim().isEmpty()) {
                wrapper.eq("brand", brand.trim());
            }

            if (series != null && !series.trim().isEmpty()) {
                wrapper.eq("series", series.trim());
            }

            if (price != null && !price.trim().isEmpty()) {
                wrapper = parsePriceRange(wrapper, price.trim());
            }

            if (caseSize != null && !caseSize.trim().isEmpty()) {
                wrapper = parseCaseSizeRange(wrapper, caseSize.trim());
            }

            if (material != null && !material.trim().isEmpty()) {
                wrapper.like("material", material.trim());
            }

            if (strap != null && !strap.trim().isEmpty()) {
                wrapper.like("strap", strap.trim());
            }

            if (waterResistance != null && !waterResistance.trim().isEmpty()) {
                wrapper = parseWaterResistanceRange(wrapper, waterResistance.trim());
            }

            if (powerReserve != null && !powerReserve.trim().isEmpty()) {
                wrapper = parsePowerReserveRange(wrapper, powerReserve.trim());
            }

            wrapper.orderByDesc("sort", "create_time");

            List<Product> products = productService.list(wrapper);
            return R.success(products != null ? products : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("筛选失败: " + e.getMessage());
        }
    }

    /**
     * 解析价格区间
     */
    private QueryWrapper<Product> parsePriceRange(QueryWrapper<Product> wrapper, String priceRange) {
        BigDecimal minPrice, maxPrice;

        switch (priceRange) {
            case "0-5000":
                minPrice = BigDecimal.ZERO;
                maxPrice = new BigDecimal("5000");
                break;
            case "5000-10000":
                minPrice = new BigDecimal("5000");
                maxPrice = new BigDecimal("10000");
                break;
            case "10000-20000":
                minPrice = new BigDecimal("10000");
                maxPrice = new BigDecimal("20000");
                break;
            case "20000-50000":
                minPrice = new BigDecimal("20000");
                maxPrice = new BigDecimal("50000");
                break;
            case "50000-150000":
                minPrice = new BigDecimal("50000");
                maxPrice = new BigDecimal("150000");
                break;
            case "150000-300000":
                minPrice = new BigDecimal("150000");
                maxPrice = new BigDecimal("300000");
                break;
            case "300000-1000000":
                minPrice = new BigDecimal("300000");
                maxPrice = new BigDecimal("1000000");
                break;
            case "1000000+":
                minPrice = new BigDecimal("1000000");
                maxPrice = null;
                break;
            default:
                return wrapper;
        }

        wrapper.ge("price", minPrice);
        if (maxPrice != null) {
            wrapper.le("price", maxPrice);
        }

        return wrapper;
    }

    /**
     * 解析表盘直径区间
     */
    private QueryWrapper<Product> parseCaseSizeRange(QueryWrapper<Product> wrapper, String caseSizeRange) {
        Integer minSize, maxSize;

        switch (caseSizeRange) {
            case "0-36":
                minSize = 0;
                maxSize = 36;
                break;
            case "36-39":
                minSize = 36;
                maxSize = 39;
                break;
            case "39-42":
                minSize = 39;
                maxSize = 42;
                break;
            case "42-45":
                minSize = 42;
                maxSize = 45;
                break;
            case "45+":
                minSize = 45;
                maxSize = null;
                break;
            default:
                return wrapper;
        }

        wrapper.apply("CAST(REGEXP_REPLACE(case_size, '[^0-9]', '') AS UNSIGNED) >= {0}", minSize);
        if (maxSize != null) {
            wrapper.apply("CAST(REGEXP_REPLACE(case_size, '[^0-9]', '') AS UNSIGNED) <= {0}", maxSize);
        }

        return wrapper;
    }

    /**
     * 解析防水性能区间
     */
    private QueryWrapper<Product> parseWaterResistanceRange(QueryWrapper<Product> wrapper, String waterRange) {
        Integer minWater, maxWater;

        switch (waterRange) {
            case "0":
                minWater = 0;
                maxWater = 0;
                break;
            case "0-100":
                minWater = 0;
                maxWater = 100;
                break;
            case "100-300":
                minWater = 100;
                maxWater = 300;
                break;
            case "300-1000":
                minWater = 300;
                maxWater = 1000;
                break;
            case "1000-3000":
                minWater = 1000;
                maxWater = 3000;
                break;
            case "3000+":
                minWater = 3000;
                maxWater = null;
                break;
            default:
                return wrapper;
        }

        wrapper.ge("water_resistance", minWater);
        if (maxWater != null) {
            wrapper.le("water_resistance", maxWater);
        }

        return wrapper;
    }

    /**
     * 解析动力储备区间
     */
    private QueryWrapper<Product> parsePowerReserveRange(QueryWrapper<Product> wrapper, String powerRange) {
        Integer minPower, maxPower;

        switch (powerRange) {
            case "0-40":
                minPower = 0;
                maxPower = 40;
                break;
            case "40-80":
                minPower = 40;
                maxPower = 80;
                break;
            case "80-120":
                minPower = 80;
                maxPower = 120;
                break;
            case "120+":
                minPower = 120;
                maxPower = null;
                break;
            default:
                return wrapper;
        }

        wrapper.apply("CAST(REGEXP_REPLACE(power_reserve, '[^0-9]', '') AS UNSIGNED) >= {0}", minPower);
        if (maxPower != null) {
            wrapper.apply("CAST(REGEXP_REPLACE(power_reserve, '[^0-9]', '') AS UNSIGNED) <= {0}", maxPower);
        }

        return wrapper;
    }

    /**
     * 获取品牌下所有系列详情（带商品）
     */
    @GetMapping("/series/brand-detail")
    public R<Map<String, Object>> getBrandSeriesDetail(@RequestParam String brand) {
        try {
            // URL解码品牌名
            try {
                brand = java.net.URLDecoder.decode(brand, "UTF-8");
            } catch (Exception e) {
                // 解码失败，使用原始值
            }

            // 获取品牌信息
            Brand brandInfo = brandMapper.selectOne(
                    new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Brand>()
                            .eq(Brand::getName, brand)
            );

            if (brandInfo == null) {
                return R.error("品牌不存在");
            }

            Map<String, Object> result = new LinkedHashMap<>();

            // 品牌信息
            Map<String, Object> brandData = new LinkedHashMap<>();
            brandData.put("id", brandInfo.getId());
            brandData.put("name", brandInfo.getName());
            brandData.put("logo", brandInfo.getLogo());
            brandData.put("content", brandInfo.getContent());
            result.put("brand", brandData);

            // 获取该品牌下所有系列
            List<Series> seriesList = seriesMapper.selectList(
                    new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Series>()
                            .eq(Series::getBrandId, brandInfo.getId())
                            .orderByAsc(Series::getId)
            );

            // 轮播图列表（使用系列logo）
            List<String> bannerImages = seriesList.stream()
                    .map(Series::getLogo)
                    .filter(logo -> logo != null && !logo.isEmpty())
                    .collect(Collectors.toList());
            result.put("bannerImages", bannerImages);

            // 系列详情列表
            List<Map<String, Object>> seriesDetailList = new ArrayList<>();
            for (Series series : seriesList) {
                Map<String, Object> seriesItem = new LinkedHashMap<>();
                seriesItem.put("id", series.getId());
                seriesItem.put("name", series.getName());
                seriesItem.put("logo", series.getLogo());
                seriesItem.put("videoUrl", series.getVideoUrl());
                seriesItem.put("content", series.getContent());

                // 获取该系列的商品（前3个）
                QueryWrapper<Product> productWrapper = new QueryWrapper<>();
                productWrapper.eq("status", 1)
                        .eq("series_id", series.getId())
                        .orderByDesc("sales", "sort")
                        .last("LIMIT 3");
                List<Product> products = productService.list(productWrapper);

                // 转换商品格式
                List<Map<String, Object>> productList = products.stream().map(p -> {
                    Map<String, Object> productMap = new LinkedHashMap<>();
                    productMap.put("id", p.getId());
                    productMap.put("name", p.getName());
                    productMap.put("image", p.getImage());
                    productMap.put("price", p.getPrice());
                    return productMap;
                }).collect(Collectors.toList());

                seriesItem.put("products", productList);
                seriesDetailList.add(seriesItem);
            }

            result.put("seriesList", seriesDetailList);
            result.put("currentSeriesIndex", 0);

            return R.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取品牌系列详情失败: " + e.getMessage());
        }
    }
}
