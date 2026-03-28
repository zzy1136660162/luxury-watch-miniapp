package com.luxurywatch.common;

import lombok.Data;

import java.io.Serializable;

@Data
public class R<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private int code;
    private String msg;
    private T data;

    public static <T> R<T> success() {
        return success(null);
    }

    public static <T> R<T> success(T data) {
        R<T> r = new R<>();
        r.setCode(200);
        r.setMsg("success");
        r.setData(data);
        return r;
    }

    public static <T> R<T> success(String msg, T data) {
        R<T> r = new R<>();
        r.setCode(200);
        r.setMsg(msg);
        r.setData(data);
        return r;
    }

    public static <T> R<T> error() {
        return error(500, "error");
    }

    public static <T> R<T> error(String msg) {
        return error(500, msg);
    }

    public static <T> R<T> error(int code, String msg) {
        R<T> r = new R<>();
        r.setCode(code);
        r.setMsg(msg);
        return r;
    }
}
