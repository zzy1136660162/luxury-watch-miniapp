<template>
  <div class="page-container">
    <div class="page-header">
      <h1>菜单管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增菜单</el-button>
      </div>
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
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 菜单表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径">
          <el-input v-model="formData.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="formData.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="formData.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="formData.menuType">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
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

interface MenuData {
  id: number
  name: string
  path: string
  component: string
  icon: string
  sort: number
  menuType: number
}

const tableData = ref<MenuData[]>([
  { id: 1, name: '系统管理', path: '/system', component: 'Layout', icon: 'Setting', sort: 100, menuType: 1 },
  { id: 2, name: '用户管理', path: '/system/user', component: '/system/user/index', icon: 'User', sort: 1, menuType: 2 },
  { id: 3, name: '角色管理', path: '/system/role', component: '/system/role/index', icon: 'Team', sort: 2, menuType: 2 },
  { id: 4, name: '菜单管理', path: '/system/menu', component: '/system/menu/index', icon: 'Menu', sort: 3, menuType: 2 },
])

const dialogVisible = ref(false)
const isEdit = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  menuType: 2
})

const dialogTitle = computed(() => isEdit.value ? '编辑菜单' : '新增菜单')

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: 0,
    name: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    menuType: 2
  })
  dialogVisible.value = true
}

const handleEdit = (row: MenuData) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row: MenuData) => {
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
