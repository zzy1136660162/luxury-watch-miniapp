<template>
  <div class="page-container">
    <div class="page-header">
      <h1>角色管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </div>
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
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handlePermissionConfig(row)">权限配置</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 角色表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="formData.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface RoleData {
  id: number
  roleName: string
  roleCode: string
  description: string
  status: number
  createTime: string
}

const tableData = ref<RoleData[]>([
  { id: 1, roleName: '超级管理员', roleCode: 'SUPER_ADMIN', description: '拥有所有权限', status: 1, createTime: '2024-01-01' },
  { id: 2, roleName: '普通管理员', roleCode: 'ADMIN', description: '普通管理权限', status: 1, createTime: '2024-01-01' },
])

const dialogVisible = ref(false)
const isEdit = ref(false)
const formData = reactive({
  id: 0,
  roleName: '',
  roleCode: '',
  description: '',
  status: 1
})

const dialogTitle = computed(() => isEdit.value ? '编辑角色' : '新增角色')

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: 0,
    roleName: '',
    roleCode: '',
    description: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: RoleData) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handlePermissionConfig = (row: RoleData) => {
  // 权限配置逻辑
  console.log('权限配置:', row)
}

const handleDelete = (row: RoleData) => {
  // 删除逻辑
  console.log('删除:', row)
}

const handleSubmit = () => {
  // 提交逻辑
  console.log('提交:', formData)
  dialogVisible.value = false
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
.header-actions {
  display: flex;
  gap: 10px;
}
</style>
