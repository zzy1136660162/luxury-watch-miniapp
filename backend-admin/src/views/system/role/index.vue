<template>
  <div class="page-container">
    <div class="page-header">
      <h1>角色管理</h1>
    </div>
    <div class="page-content">
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="description" label="描述" />
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
            <el-button link type="primary" size="small">权限配置</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
const tableData = [
  { id: 1, roleName: '超级管理员', roleCode: 'SUPER_ADMIN', description: '拥有所有权限', status: 1, createTime: '2024-01-01' },
  { id: 2, roleName: '管理员', roleCode: 'ADMIN', description: '普通管理员', status: 1, createTime: '2024-01-01' },
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
