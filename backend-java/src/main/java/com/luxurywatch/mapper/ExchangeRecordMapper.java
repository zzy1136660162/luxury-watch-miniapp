package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.ExchangeRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 积分兑换记录Mapper
 */
@Mapper
public interface ExchangeRecordMapper extends BaseMapper<ExchangeRecord> {

    /**
     * 查询兑换记录列表（包含用户信息）
     */
    @Select("SELECT er.*, wu.nickname as userName " +
            "FROM exchange_record er " +
            "LEFT JOIN wx_user wu ON er.user_id = wu.id " +
            "WHERE er.is_deleted = 0 " +
            "ORDER BY er.create_time DESC")
    List<Map<String, Object>> selectExchangeRecordList();

    /**
     * 根据条件查询兑换记录
     */
    List<Map<String, Object>> selectByCondition(@Param("userId") Long userId,
                                                 @Param("status") Integer status,
                                                 @Param("productName") String productName,
                                                 @Param("phone") String phone);
}
