<script setup lang="ts">
import { appointmentApi } from '@/api/modules/appointment'
import { ElButton, ElTable, ElTableColumn, ElSelect, ElOption, ElSpace, ElMessage, ElDatePicker } from 'element-plus'
import { ref } from 'vue'
import { formatDateTime } from '@/utils'
import type { DateModelType } from 'element-plus'

const statusOptions = [
  { label: '全部', value: -1 },
  { label: '正常', value: 0 },
  { label: '已完成', value: 1 },
  { label: '已取消', value: 2 }
]

const data = ref<any[]>([])
const loading = ref(false)
const searchForm = ref({
  userName: '',
  status: -1 as number,
  startDate: '' as string,
  endDate: '' as string
})
const pagination = ref({ page: 1, pageSize: 10, total: 0 })

const loadData = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.value.page,
      size: pagination.value.pageSize
    }
    if (searchForm.value.userName) {
      params.userName = searchForm.value.userName
    }
    if (searchForm.value.status !== -1) {
      params.status = searchForm.value.status
    }
    if (searchForm.value.startDate) {
      params.startDate = searchForm.value.startDate
    }
    if (searchForm.value.endDate) {
      params.endDate = searchForm.value.endDate
    }
    const res: any = await appointmentApi.list(params)
    data.value = res.list || []
    pagination.value.total = res.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleConfirm = async (id: number) => {
  try {
    await appointmentApi.confirm(id)
    ElMessage.success('已确认到店')
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const getStatusText = (status: number) => {
  const statusMap: any = { 0: '正常', 1: '已完成', 2: '已取消' }
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
  searchForm.value.userName = ''
  searchForm.value.status = -1
  searchForm.value.startDate = ''
  searchForm.value.endDate = ''
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

loadData()
</script>

<template>
  <div class="appointment-management">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="预约状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 150px"
            value-format="YYYY-MM-DD"
            :clearable="true"
          />
          <span style="margin: 0 5px;">至</span>
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="结束日期"
            style="width: 150px"
            value-format="YYYY-MM-DD"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="data" :loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="userPhone" label="用户电话" width="130" />
      <el-table-column prop="storeName" label="预约门店" />
      <el-table-column prop="storeAddress" label="门店地址" min-width="200" />
      <el-table-column label="预约时间" width="150">
        <template #default="{ row }">
          {{ row.appointmentDateDisplay }} {{ row.appointmentTime }}
        </template>
      </el-table-column>
      <el-table-column label="预约状态" width="100">
        <template #default="{ row }">
          <span :style="{ color: getStatusColor(row.status) }">
            {{ getStatusText(row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 0"
            size="small"
            type="primary"
            @click="handleConfirm(row.id)"
          >
            确认到店
          </el-button>
          <span v-else style="color: #999;">-</span>
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
.appointment-management {
  padding: 20px;
}

.table-toolbar {
  margin: 20px 0;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
