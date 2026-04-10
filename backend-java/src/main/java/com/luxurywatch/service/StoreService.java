package com.luxurywatch.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.luxurywatch.entity.Store;
import java.util.List;

/**
 * 门店服务接口
 */
public interface StoreService {

    /**
     * 获取门店列表（分页）
     */
    IPage<Store> getStorePage(Integer page, Integer size, String name);

    /**
     * 根据ID获取门店
     */
    Store getStoreById(Long id);

    /**
     * 创建门店
     */
    boolean createStore(Store store);

    /**
     * 更新门店
     */
    boolean updateStore(Store store);

    /**
     * 删除门店
     */
    boolean deleteStore(Long id);

    /**
     * 获取所有正常门店（小程序用）
     */
    List<Store> getAllActiveStores();
}
