package com.luxurywatch.common;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

/**
 * 分页结果封装
 */
@Data
public class PageResult<T> implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private List<T> list;
    private long total;
    private int page;
    private int size;
    
    public PageResult() {
    }
    
    public PageResult(List<T> list, long total) {
        this.list = list;
        this.total = total;
    }
    
    public PageResult(List<T> list, long total, int page, int size) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
    }
}
