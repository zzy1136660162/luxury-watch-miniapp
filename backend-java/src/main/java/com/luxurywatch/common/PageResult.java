package com.luxurywatch.common;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private long total;
    private List<T> list;

    public PageResult() {
    }

    public PageResult(List<T> list, long total) {
        this.list = list;
        this.total = total;
    }
}
