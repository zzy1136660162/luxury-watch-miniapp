<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
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
          <span class="title">兑换商品列表</span>
          <div class="actions">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增商品
            </el-button>
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
        <el-table-column label="商品图片" width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="getImageUrl(getFirstImage(row.image))"
              class="product-image"
              fit="cover"
              :preview-src-list="getImagePreviewList(row.image)"
              preview-teleported
            />
            <div v-else class="product-image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="pointsCost" label="所需积分" width="120">
          <template #default="{ row }">
            <span class="points">{{ row.pointsCost || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存数量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
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
          @-current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <ExchangeProductFormDialog
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
import { Search, Plus, Delete, Picture } from '@element-plus/icons-vue'
import exchangeApi from '@/api/modules/exchange'
import ExchangeProductFormDialog from './components/ExchangeProductFormDialog.vue'

// 图片预览基础URL
const imagePreviewBaseUrl = import.meta.env.VITE_APP_IMAGE_PREVIEW_BASEURL || import.meta.env.VITE_APP_API_BASEURL || 'http://localhost:8081'

// 获取完整的图片URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${imagePreviewBaseUrl}${imagePath}`
}

// 将逗号分隔的图片字符串转换为数组
const getImageList = (imageStr: string) => {
  if (!imageStr) return []
  return imageStr.split(',').filter(Boolean)
}

// 获取图片预览列表
const getImagePreviewList = (imageStr: string) => {
  return getImageList(imageStr).map(img => getImageUrl(img))
}

// 获取第一张图片
const getFirstImage = (imageStr: string) => {
  const list = getImageList(imageStr)
  return list.length > 0 ? list[0] : ''
}

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined as number | undefined,
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const selectedIds = ref<number[]>([])

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentRow = ref<any>({})

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const res = await exchangeApi.getExchangeProductList({
      page: pagination.page,
      size: pagination.size,
      ...searchForm,
    })
    tableData.value = res.list || []
    pagination.total = res.total || 0
  } catch (error) {
    console.error('获取兑换商品列表失败:', error)
    ElMessage.error('获取兑换商品列表失败')
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
  searchForm.name = ''
  searchForm.status = undefined
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  currentRow.value = {}
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  currentRow.value = { ...row }
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await exchangeApi.deleteExchangeProduct(row.id)
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
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await exchangeApi.batchDeleteExchangeProduct(selectedIds.value)
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
const handleSizeChange = () => {
  pagination.page = 1
  fetchList()
}

const handlePageChange = () => {
  fetchList()
}

// 初始化
onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 16px;
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
  }
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.product-image-placeholder {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  color: var(--el-text-color-placeholder);
  font-size: 24px;
}

.points {
  color: var(--el-color-warning);
  font-weight: 600;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
