package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.entity.Store;
import com.luxurywatch.mapper.StoreMapper;
import com.luxurywatch.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 门店服务实现
 */
@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreMapper storeMapper;

    @Override
    public IPage<Store> getStorePage(Integer page, Integer size, String name) {
        Page<Store> storePage = new Page<>(page, size);
        QueryWrapper<Store> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0);
        if (name != null && !name.isEmpty()) {
            wrapper.like("name", name);
        }
        wrapper.orderByAsc("sort");
        return storeMapper.selectPage(storePage, wrapper);
    }

    @Override
    public Store getStoreById(Long id) {
        return storeMapper.selectById(id);
    }

    @Override
    public boolean createStore(Store store) {
        store.setStatus(1);
        return storeMapper.insert(store) > 0;
    }

    @Override
    public boolean updateStore(Store store) {
        return storeMapper.updateById(store) > 0;
    }

    @Override
    public boolean deleteStore(Long id) {
        Store store = storeMapper.selectById(id);
        if (store == null) {
            return false;
        }
        store.setStatus(0);
        int result = storeMapper.updateById(store);
        return result > 0;
    }

    @Override
    public List<Store> getAllActiveStores() {
        QueryWrapper<Store> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0).eq("status", 1).orderByAsc("sort");
        return storeMapper.selectList(wrapper);
    }
}
