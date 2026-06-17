<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElSelect, ElOption, ElSpace, ElMessage, ElPagination } from 'element-plus'
import exchangeApi from '@/api/modules/exchange'
import { formatDateTime } from '@/utils'

const statusOptions = [
  { label: '全部', value: -1 },
  { label: '待处理', value: 0 },
  { label: '已兑换', value: 1 },
  { label: '已拒绝', value: 2 }
]

const data = ref<any[]>([])
const loading = ref(false)
const searchForm = ref({
  phone: '',
  status: -1 as number
})
const pagination = ref({ page: 1, pageSize: 10, total: 0 })

const loadData = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.value.page,
      size: pagination.value.pageSize,
      status: searchForm.value.status === -1 ? undefined : searchForm.value.status
    }
    if (searchForm.value.phone) {
      params.phone = searchForm.value.phone
    }
    const res: any = await exchangeApi.getExchangeList(params)
    data.value = res?.list || []
    pagination.value.total = res?.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: number) => {
  const statusMap: any = { 0: '待处理', 1: '已兑换', 2: '已拒绝' }
  return statusMap[status] || '未知'
}

const getStatusColor = (status: number) => {
  const colorMap: any = { 0: '#1890FF', 1: '#52C41A', 2: '#999' }
  return colorMap[status] || '#999'
}

const handleSearch = () => {
  pagination.value.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.value.phone = ''
  searchForm.value.status = -1
  pagination.value.page = 1
  loadData()
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  loadData()
}

const handleProcess = async (row: any) => {
  try {
    loading.value = true
    await exchangeApi.updateExchangeStatus(row.id, 1)
    ElMessage.success('处理成功')
    loadData()
  } catch (error) {
    console.error('处理失败:', error)
    ElMessage.error('处理失败')
  } finally {
    loading.value = false
  }
}

loadData()
</script>

<template>
  <div class="exchange-management">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="联系电话">
          <el-input v-model="searchForm.phone" placeholder="请输入联系电话" clearable @keyup.enter="handleSearch" style="width: 150px" />
        </el-form-item>
        <el-form-item label="兑换状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="data" :loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userName" label="用户名称" width="120" />
      <el-table-column prop="productName" label="兑换商品" width="150" />
      <el-table-column prop="points" label="消耗积分" width="100" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <span :style="{ color: getStatusColor(row.status) }">
            {{ getStatusText(row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.exchangeTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="收货地址" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" :disabled="row.status !== 0" @click="handleProcess(row)">
            处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.exchange-management {
  padding: 20px;
}

.table-toolbar {
  margin: 16px 0;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
