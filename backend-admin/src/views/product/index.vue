<template>
  <div class="page-container">
    <div class="page-header">
      <h1>商品管理</h1>
    </div>
    <div class="page-content">
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="price" label="价格">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
const tableData = [
  { id: 1, name: '劳力士潜航者', brand: 'Rolex', price: 85000, stock: 5, status: 1 },
  { id: 2, name: '欧米茄海马', brand: 'Omega', price: 45000, stock: 10, status: 1 },
]
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
