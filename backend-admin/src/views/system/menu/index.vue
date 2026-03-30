<template>
  <div class="page-container">
    <div class="page-header">
      <h1>菜单管理</h1>
    </div>
    <div class="page-content">
      <el-table :data="tableData" stripe row-key="id">
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="menuType" label="类型">
          <template #default="{ row }">
            <el-tag v-if="row.menuType === 1" type="warning">目录</el-tag>
            <el-tag v-else-if="row.menuType === 2" type="success">菜单</el-tag>
            <el-tag v-else type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
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
  { id: 1, name: '系统管理', path: '/system', component: 'Layout', icon: 'Setting', sort: 100, menuType: 1 },
  { id: 2, name: '用户管理', path: '/system/user', component: '/system/user/index', icon: 'User', sort: 1, menuType: 2 },
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
