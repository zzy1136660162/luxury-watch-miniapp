package com.luxurywatch.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Store;
import com.luxurywatch.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 门店管理控制器
 */
@RestController
@RequestMapping("/admin/store")
public class StoreController {

    @Autowired
    private StoreService storeService;

    /**
     * 获取门店列表
     */
    @GetMapping("/list")
    @SaCheckPermission("store:list")
    public R<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name) {
        
        IPage<Store> storePage = storeService.getStorePage(page, size, name);
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", storePage.getRecords());
        result.put("total", storePage.getTotal());
        result.put("page", storePage.getCurrent());
        result.put("size", storePage.getSize());
        
        return R.success(result);
    }

    /**
     * 获取门店详情
     */
    @GetMapping("/{id}")
    @SaCheckPermission("store:list")
    public R<Store> detail(@PathVariable Long id) {
        Store store = storeService.getStoreById(id);
        if (store == null) {
            return R.error("门店不存在");
        }
        return R.success(store);
    }

    /**
     * 创建门店
     */
    @PostMapping
    @SaCheckPermission("store:add")
    public R<Void> create(@RequestBody Store store) {
        if (store.getName() == null || store.getName().trim().isEmpty()) {
            return R.error("门店名称不能为空");
        }
        if (store.getAddress() == null || store.getAddress().trim().isEmpty()) {
            return R.error("门店地址不能为空");
        }
        
        boolean success = storeService.createStore(store);
        if (success) {
            return R.success();
        }
        return R.error("创建失败");
    }

    /**
     * 更新门店
     */
    @PutMapping("/{id}")
    @SaCheckPermission("store:edit")
    public R<Void> update(@PathVariable Long id, @RequestBody Store store) {
        store.setId(id);
        boolean success = storeService.updateStore(store);
        if (success) {
            return R.success();
        }
        return R.error("更新失败");
    }

    /**
     * 删除门店
     */
    @DeleteMapping("/{id}")
    @SaCheckPermission("store:delete")
    public R<Void> delete(@PathVariable Long id) {
        boolean success = storeService.deleteStore(id);
        if (success) {
            return R.success();
        }
        return R.error("删除失败");
    }
}
