<template>
  <div class="page-container">
    <div class="page-header">
      <h1>订单管理</h1>
    </div>
    <div class="page-content">
      <el-table :data="tableData" stripe>
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="totalAmount" label="订单金额">
          <template #default="{ row }">
            ¥{{ row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
const tableData = [
  { id: 1, orderNo: 'ORDER202401010001', userId: 1, totalAmount: 85000, status: 1, createTime: '2024-01-01 10:00:00' },
  { id: 2, orderNo: 'ORDER202401010002', userId: 2, totalAmount: 45000, status: 2, createTime: '2024-01-01 11:00:00' },
]

const getStatusType = (status: number) => {
  const types: Record<number, string> = { 1: 'warning', 2: 'success', 3: 'info', 4: 'danger' }
  return types[status] || 'info'
}

const getStatusText = (status: number) => {
  const texts: Record<number, string> = { 1: '待支付', 2: '已支付', 3: '已完成', 4: '已取消' }
  return texts[status] || '未知'
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
