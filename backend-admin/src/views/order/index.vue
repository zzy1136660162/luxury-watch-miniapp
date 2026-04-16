<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.productName" placeholder="请输入商品名称" clearable @clear="handleReset" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model.number="searchForm.userId" placeholder="请输入用户ID" clearable type="number" @clear="handleReset" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="searchForm.phone" placeholder="请输入电话" clearable @clear="handleReset" />
        </el-form-item>
        <el-form-item label="兑换状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px" @clear="handleReset">
            <el-option label="待处理" :value="0" />
            <el-option label="已完成" :value="1" />
            <el-option label="已取消" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="title">兑换记录列表</span>
          <div class="actions">
            <el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchDelete">
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="记录ID" width="80" />
        <el-table-column label="用户信息" min-width="150">
          <template #default="{ row }">
            <div class="user-info">
              <div class="user-id">用户ID: {{ row.userId }}</div>
              <div v-if="row.userName" class="user-name">{{ row.userName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电话" min-width="120">
          <template #default="{ row }">
            <div v-if="row.phone" class="user-phone">{{ row.phone }}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="200">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                v-if="row.productImage"
                :src="row.productImage"
                :preview-src-list="[row.productImage]"
                fit="cover"
                class="product-image"
              />
              <div class="product-name">{{ row.productName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="兑换积分" width="100">
          <template #default="{ row }">
            <span class="points">{{ row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column label="兑换状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="exchangeTime" label="兑换时间" width="180" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 0" link type="success" @click="handleCompleteExchange(row)">完成兑换</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete } from '@element-plus/icons-vue'
import apiOrder from '@/api/modules/order'
import type { ExchangeRecord } from '@/types'

// 状态文本映射
const StatusText: Record<number, string> = {
  0: '待处理',
  1: '已完成',
  2: '已取消',
}

// 状态类型映射
const StatusType: Record<number, string> = {
  0: 'warning',
  1: 'success',
  2: 'danger',
}

// 搜索表单
const searchForm = reactive({
  productName: '',
  userId: undefined as number | undefined,
  phone: '',
  status: undefined as number | undefined,
})

// 表格数据
const loading = ref(false)
const tableData = ref<ExchangeRecord[]>([])
const selectedIds = ref<number[]>([])

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// 获取状态文本
const getStatusText = (status: number) => {
  return StatusText[status] || '未知'
}

// 获取状态类型
const getStatusType = (status: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  return (StatusType[status] || 'info') as 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      userId: searchForm.userId,
      status: searchForm.status,
      productName: searchForm.productName || undefined,
      phone: searchForm.phone || undefined,
    }

    const res = await apiOrder.getOrderList(params)

    if (res) {
      tableData.value = res.list || []
      pagination.total = res.total || 0
    }
  } catch (error) {
    console.error('获取兑换记录列表失败:', error)
    ElMessage.error('获取兑换记录列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

// 重置
const handleReset = () => {
  searchForm.productName = ''
  searchForm.userId = undefined
  searchForm.phone = ''
  searchForm.status = undefined
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection: ExchangeRecord[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 完成兑换
const handleCompleteExchange = async (row: ExchangeRecord) => {
  try {
    await ElMessageBox.confirm(`确认完成兑换"${row.productName}"？`, '提示', {
      type: 'warning',
    })

    await apiOrder.updateOrderStatus(row.id, 1)
    ElMessage.success('完成兑换成功')
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('完成兑换失败:', error)
      ElMessage.error('完成兑换失败')
    }
  }
}

// 删除
const handleDelete = async (row: ExchangeRecord) => {
  try {
    await ElMessageBox.confirm(`确认删除兑换记录"${row.productName}"？`, '提示', {
      type: 'warning',
    })

    await apiOrder.deleteOrder(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个兑换记录？`, '提示', {
      type: 'warning',
    })

    await apiOrder.batchDeleteOrder(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.size = size
  fetchList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 10px;
    }
  }
}

.user-info {
  .user-id {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .user-name {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }

  .user-phone {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;

  .product-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
  }

  .product-name {
    flex: 1;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
}

.points {
  color: var(--el-color-primary);
  font-weight: 500;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

<route lang="yaml">
meta:
  title: 兑换记录列表
  layout: true
  constant: false
  enabled: true
</route>
