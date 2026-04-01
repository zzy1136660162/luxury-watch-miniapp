<template>
  <div class="page-container">
    <div class="page-header">
      <h1>小程序用户管理</h1>
      <div class="header-actions">
        <!-- 隐藏新增用户功能 -->
        <!-- <el-button type="primary" @click="handleAdd">新增用户</el-button> -->
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="searchForm.memberLevel" placeholder="请选择会员等级" clearable style="width: 140px">
            <el-option label="普通会员" :value="1" />
            <el-option label="银卡会员" :value="2" />
            <el-option label="金卡会员" :value="3" />
            <el-option label="钻卡会员" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100px">
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
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="memberLevel" label="会员等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getMemberLevelTagType(row.memberLevel)">
              {{ getMemberLevelText(row.memberLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ getGenderText(row.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handlePointsAdjust(row)">积分调整</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 用户编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="积分">
          <el-input-number v-model="formData.points" :min="0" />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="formData.memberLevel" placeholder="请选择会员等级" style="width: 100%">
            <el-option label="普通会员" :value="1" />
            <el-option label="银卡会员" :value="2" />
            <el-option label="金卡会员" :value="3" />
            <el-option label="钻卡会员" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="formData.birthday" type="date" placeholder="选择生日" style="width: 100%" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="formData.gender">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wxUserApi, { type WxUser } from '@/api/modules/wxuser'

interface SearchForm {
  username?: string
  phone?: string
  memberLevel?: number
  status?: number
}

const loading = ref(false)
const tableData = ref<WxUser[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive<SearchForm>({
  username: '',
  phone: '',
  memberLevel: undefined,
  status: undefined
})

const formData = reactive({
  id: 0,
  username: '',
  nickname: '',
  phone: '',
  points: 0,
  memberLevel: 1,
  birthday: '',
  gender: 0,
  status: 1
})

const dialogTitle = computed(() => isEdit.value ? '编辑小程序用户' : '新增小程序用户')

// 获取会员等级文本
const getMemberLevelText = (level: number) => {
  const levels: { [key: number]: string } = {
    1: '普通会员',
    2: '银卡会员',
    3: '金卡会员',
    4: '钻卡会员'
  }
  return levels[level] || '未知'
}

// 获取会员等级标签类型
const getMemberLevelTagType = (level: number) => {
  const types: { [key: number]: string } = {
    1: '',
    2: 'success',
    3: 'warning',
    4: 'danger'
  }
  return types[level] || ''
}

// 获取性别文本
const getGenderText = (gender: number) => {
  const genders = ['未知', '男', '女']
  return genders[gender] || '未知'
}

// 加载小程序用户列表
const loadWxUserList = async () => {
  try {
    loading.value = true
    const response = await wxUserApi.getWxUserList({
      keyword: searchForm.username,
      memberLevel: searchForm.memberLevel,
      status: searchForm.status
    })
    if (response.code === 200) {
      tableData.value = response.data.list || []
    } else {
      ElMessage.error(response.data.msg || '获取用户列表失败')
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试')
    console.error('加载小程序用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  loadWxUserList()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.memberLevel = undefined
  searchForm.status = undefined
  loadWxUserList()
}

// 新增（已禁用）
const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: WxUser) => {
  isEdit.value = true
  formData.id = row.id
  formData.username = row.username
  formData.nickname = row.nickname || ''
  formData.phone = row.phone || ''
  formData.points = row.points || 0
  formData.memberLevel = row.memberLevel || 1
  formData.birthday = row.birthday || ''
  formData.gender = row.gender || 0
  formData.status = row.status || 1
  dialogVisible.value = true
}

// 积分调整
const handlePointsAdjust = (row: WxUser) => {
  ElMessageBox.prompt('请输入调整积分（正数为增加，负数为减少）', '积分调整', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^-?\d+$/,
    inputErrorMessage: '请输入整数'
  })
    .then(async ({ value }) => {
      try {
        const response = await wxUserApi.adjustWxUserPoints(row.id, parseInt(value), '后台手动调整')
        if (response.code === 200) {
          ElMessage.success('积分调整成功')
          loadWxUserList()
        } else {
          ElMessage.error(response.data.msg || '积分调整失败')
        }
      } catch (error) {
        ElMessage.error('积分调整失败')
      }
    })
    .catch(() => { })
}

// 删除
const handleDelete = (row: WxUser) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const response = await wxUserApi.deleteWxUser(row.id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          loadWxUserList()
        } else {
          ElMessage.error(response.data.msg || '删除失败')
        }
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => { })
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await wxUserApi.updateWxUser(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      ElMessage.warning('新增用户功能已禁用')
      return
    }
    dialogVisible.value = false
    loadWxUserList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
  }
}

onMounted(() => {
  loadWxUserList()
})
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
