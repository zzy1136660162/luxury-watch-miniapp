package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.Series;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系列 Mapper 接口
 */
@Mapper
public interface SeriesMapper extends BaseMapper<Series> {
}
