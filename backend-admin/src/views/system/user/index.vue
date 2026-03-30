<template>
  <div class="page-container">
    <div class="page-header">
      <h1>用户管理</h1>
    </div>
    <div class="page-content">
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
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
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', phone: '13800138000', status: 1, createTime: '2024-01-01' },
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
