<template>
  <div class="page-container">
    <div class="page-header">
      <h1>管理员管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增管理员</el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-content">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="roleName" label="角色" />
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
            <el-button link type="primary" size="small" @click="handleRoleConfig(row)">角色配置</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 管理员表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="80px" :rules="formRules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option label="超级管理员" :value="1" />
            <el-option label="普通管理员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface AdminData {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  roleId: number
  roleName: string
  status: number
  createTime: string
}

interface SearchForm {
  username: string
  status: number | null
}

// 响应式数据
const loading = ref(false)
const tableData = ref<AdminData[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive<SearchForm>({
  username: '',
  status: null
})

// 表单数据
const formData = reactive({
  id: 0,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  roleId: 1,
  status: 1
})

// 表单验证规则
const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 计算属性
const dialogTitle = computed(() => isEdit.value ? '编辑管理员' : '新增管理员')

// 模拟数据
const mockData: AdminData[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    roleId: 1,
    roleName: '超级管理员',
    status: 1,
    createTime: '2024-01-01'
  },
  {
    id: 2,
    username: 'test',
    nickname: '测试管理员',
    email: 'test@example.com',
    phone: '13800138001',
    roleId: 2,
    roleName: '普通管理员',
    status: 1,
    createTime: '2024-01-01'
  }
]

// 生命周期
onMounted(() => {
  loadAdminList()
})

// 加载管理员列表
const loadAdminList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = mockData
  } catch (error) {
    ElMessage.error('加载管理员列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  loadAdminList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    status: null
  })
  loadAdminList()
}

// 新增管理员
const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: 0,
    username: '',
    nickname: '',
    email: '',
    phone: '',
    roleId: 1,
    status: 1
  })
  dialogVisible.value = true
}

// 编辑管理员
const handleEdit = (row: AdminData) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 角色配置
const handleRoleConfig = (row: AdminData) => {
  ElMessage.info('角色配置功能待实现')
}

// 删除管理员
const handleDelete = async (row: AdminData) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除管理员 "${row.nickname}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // 模拟删除操作
    ElMessage.success('删除成功')
    loadAdminList()
  } catch {
    // 用户取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    // 模拟提交操作
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isEdit.value) {
      ElMessage.success('编辑管理员成功')
    } else {
      ElMessage.success('新增管理员成功')
    }

    dialogVisible.value = false
    loadAdminList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
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
.search-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.page-content {
  margin-top: 20px;
}
</style>
