<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="腕表名称" clearable />
        </el-form-item>
        <el-form-item label="系列">
          <el-select v-model="searchForm.seriesId" placeholder="全部系列" clearable>
            <el-option
              v-for="item in seriesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="title">腕表列表</span>
          <div class="actions">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增腕表
            </el-button>
            <el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchDelete">
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="腕表信息" min-width="280">
          <template #default="{ row }">
            <div class="watch-info">
              <el-image :src="row.mainImage" class="watch-image" fit="cover" />
              <div class="watch-detail">
                <div class="name">{{ row.name }}</div>
                <div class="name-en">{{ row.nameEn }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="所属系列" width="120" />
        <el-table-column label="价格" width="120">
          <template #default="{ row }">
            <span v-if="row.price">¥{{ row.price.toLocaleString() }}</span>
            <span v-else class="text-gray">暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.isHot" type="danger" size="small" class="mr-1">热门</el-tag>
            <el-tag v-if="row.isNew" type="success" size="small" class="mr-1">新品</el-tag>
            <el-tag v-if="row.isRecommend" type="warning" size="small">推荐</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(row.id, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleView(row)">详情</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <WatchFormDialog
      v-model:visible="dialogVisible"
      :type="dialogType"
      :data="currentRow"
      @success="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import type { Watch, WatchSeries } from '@/types'
import WatchFormDialog from './components/WatchFormDialog.vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  seriesId: undefined as number | undefined,
  status: undefined as number | undefined,
})

// 表格数据
const loading = ref(false)
const tableData = ref<Watch[]>([])
const selectedIds = ref<number[]>([])
const seriesList = ref<WatchSeries[]>([])

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentRow = ref<Partial<Watch>>({})

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    // TODO: 对接后端API
    // const res = await api.watch.getWatchList({
    //   page: pagination.page,
    //   size: pagination.size,
    //   ...searchForm,
    // })
    // tableData.value = res.data.list
    // pagination.total = res.data.total

    // 模拟数据
    tableData.value = [
      {
        id: 1,
        name: '星空系列 - 星辰',
        nameEn: 'Celestial - Stars',
        seriesId: 1,
        seriesName: '星空系列',
        mainImage: 'https://via.placeholder.com/80x80',
        price: 128000,
        isHot: true,
        isNew: true,
        isRecommend: true,
        status: 1,
      },
      {
        id: 2,
        name: '经典系列 - 永恒',
        nameEn: 'Classic - Eternity',
        seriesId: 2,
        seriesName: '经典系列',
        mainImage: 'https://via.placeholder.com/80x80',
        price: 88000,
        isHot: false,
        isNew: false,
        isRecommend: true,
        status: 1,
      },
    ]
    pagination.total = 2
  } finally {
    loading.value = false
  }
}

// 获取系列列表
const fetchSeriesList = async () => {
  // TODO: 对接后端API
  // const res = await api.watch.getAllSeries()
  // seriesList.value = res.data

  seriesList.value = [
    { id: 1, name: '星空系列' },
    { id: 2, name: '经典系列' },
    { id: 3, name: '运动系列' },
  ] as WatchSeries[]
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.seriesId = undefined
  searchForm.status = undefined
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection: Watch[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  currentRow.value = {}
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Watch) => {
  dialogType.value = 'edit'
  currentRow.value = { ...row }
  dialogVisible.value = true
}

// 查看详情
const handleView = (row: Watch) => {
  // TODO: 跳转到详情页或打开详情弹窗
  console.log('查看详情', row)
}

// 删除
const handleDelete = async (row: Watch) => {
  try {
    await ElMessageBox.confirm('确认删除该腕表？', '提示', {
      type: 'warning',
    })
    // TODO: 对接后端API
    // await api.watch.deleteWatch(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 取消删除
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个腕表？`, '提示', {
      type: 'warning',
    })
    // TODO: 对接后端API
    // await api.watch.batchDeleteWatch(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    // 取消删除
  }
}

// 状态变更
const handleStatusChange = async (id: number, status: number) => {
  try {
    // TODO: 对接后端API
    // await api.watch.updateWatchStatus(id, status)
    ElMessage.success('状态更新成功')
  } catch {
    // 恢复原状态
    fetchList()
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
  fetchSeriesList()
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

.watch-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .watch-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
  }

  .watch-detail {
    .name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .name-en {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.text-gray {
  color: var(--el-text-color-secondary);
}

.mr-1 {
  margin-right: 4px;
}
</style>
