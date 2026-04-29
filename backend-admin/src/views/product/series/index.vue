<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import api from '@/api'
import SeriesFormDialog from './components/SeriesFormDialog.vue'

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '系列名称', minWidth: 150 },
  { prop: 'brandId', label: '品牌ID', width: 100 },
  { prop: 'logo', label: '系列Logo', width: 120 },
  { prop: 'createdAt', label: '创建时间', width: 180 },
  { prop: 'actions', label: '操作', width: 150, fixed: 'right' }
]

const data = ref<any[]>([])
const loading = ref(false)
const pagination = ref({ page: 1, pageSize: 10, total: 0 })
const showDialog = ref(false)
const isEdit = ref(false)
const currentItem = ref<any>(null)

const loadData = async () => {
  try {
    loading.value = true
    const res: any = await api.product.getSeriesList({
      page: pagination.value.page,
      size: pagination.value.pageSize
    })
    data.value = res.list || []
    pagination.value.total = res.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  currentItem.value = null
  showDialog.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  currentItem.value = { ...row }
  showDialog.value = true
}

const handleDelete = async (row: any) => {
  try {
    await api.product.deleteSeries(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSuccess = () => {
  showDialog.value = false
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
  <div class="series-management">
    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增系列
      </el-button>
    </div>

    <el-table :data="data" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="系列名称" min-width="150" />
      <el-table-column prop="brandId" label="品牌ID" width="100" />
      <el-table-column label="系列Logo" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.logo"
            :src="row.logo"
            fit="contain"
            style="width: 60px; height: 60px;"
            :preview-src-list="[row.logo]"
            preview-teleported
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ row.createdAt ? new Date(row.createdAt).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
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

    <SeriesFormDialog
      v-model="showDialog"
      :is-edit="isEdit"
      :data="currentItem"
      @success="handleSuccess"
    />
  </div>
</template>

<style scoped lang="scss">
.series-management {
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
