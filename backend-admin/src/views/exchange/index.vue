<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElSelect, ElOption, ElSpace, ElMessage, ElPagination } from 'element-plus'

const statusOptions = [
  { label: '全部', value: -1 },
  { label: '待处理', value: 0 },
  { label: '已兑换', value: 1 },
  { label: '已拒绝', value: 2 }
]

const data = ref<any[]>([
  { id: 1, userName: '张三', productName: '劳力士腕表', points: 10000, status: 0, exchangeTime: '2024-01-15 10:30:00', address: '北京市朝阳区' },
  { id: 2, userName: '李四', productName: '欧米茄腕表', points: 8000, status: 1, exchangeTime: '2024-01-14 15:20:00', address: '上海市浦东新区' },
  { id: 3, userName: '王五', productName: '卡地亚腕表', points: 12000, status: 2, exchangeTime: '2024-01-13 09:45:00', address: '广州市天河区' }
])
const loading = ref(false)
const queryParams = ref({
  status: -1
})
const pagination = ref({ page: 1, pageSize: 10, total: 3 })

const loadData = async () => {
  try {
    loading.value = true
    // TODO: 调用兑换记录接口
    // const res: any = await exchangeApi.list(queryParams.value)
    // data.value = res.list || []
    // pagination.value.total = res.total || 0
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

const handleQuery = () => {
  pagination.value.page = 1
  loadData()
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  loadData()
}

loadData()
</script>

<template>
  <div class="exchange-management">
    <div class="table-toolbar">
      <el-space>
        <el-select
          v-model="queryParams.status"
          placeholder="兑换状态"
          clearable
          style="width: 150px"
          @change="handleQuery"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button @click="loadData">
          <i class="el-icon-search"></i>
          刷新
        </el-button>
      </el-space>
    </div>

    <el-table :data="data" :loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userName" label="用户名称" width="120" />
      <el-table-column prop="productName" label="兑换商品" width="150" />
      <el-table-column prop="points" label="消耗积分" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <span :style="{ color: getStatusColor(row.status) }">
            {{ getStatusText(row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="exchangeTime" label="兑换时间" width="180" />
      <el-table-column prop="address" label="收货地址" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" :disabled="row.status !== 0">
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
  margin-bottom: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
