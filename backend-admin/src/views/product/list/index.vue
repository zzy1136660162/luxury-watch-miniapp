<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 160px">
            <el-option-group label="腕表">
              <el-option label="全部腕表" value="watch" />
              <el-option label="经典" value="classic" />
              <el-option label="运动" value="sport" />
              <el-option label="复杂功能" value="complication" />
              <el-option label="女士" value="ladies" />
            </el-option-group>
            <el-option label="配件" value="accessory" />
            <el-option label="礼品" value="gift" />
          </el-select>
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
          <span class="title">商品列表</span>
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
        <el-table-column label="商品信息" min-width="280">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                v-if="row.image"
                :src="getImageUrl(row.image)"
                class="product-image"
                fit="cover"
                :preview-src-list="[getImageUrl(row.image)]"
                preview-teleported
                :initial-index="0"
              />
              <div v-else class="product-image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
              <div class="product-detail">
                <div class="name">{{ row.name }}</div>
                <div class="code">编码: {{ row.code }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryText(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
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
    <ProductFormDialog
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
import api from '@/api'
import type { Product } from '@/types'
import ProductFormDialog from './components/ProductFormDialog.vue'

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

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  status: undefined as number | undefined,
})

// 表格数据
const loading = ref(false)
const tableData = ref<Product[]>([])
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
const currentRow = ref<Partial<Product>>({})

// 分类映射（包含二级分类）
const categoryMap: Record<string, string> = {
  watch: '腕表',
  accessory: '配件',
  gift: '礼品',
  classic: '经典',
  sport: '运动',
  complication: '复杂功能',
  ladies: '女士',
}

// 获取分类文本
const getCategoryText = (category: string) => {
  return categoryMap[category] || category
}

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const res = await api.product.getProductList({
      page: pagination.page,
      size: pagination.size,
      ...searchForm,
    })
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取商品列表失败')
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
  searchForm.category = ''
  searchForm.status = undefined
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection: Product[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  currentRow.value = {}
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Product) => {
  dialogType.value = 'edit'
  currentRow.value = { ...row }
  dialogVisible.value = true
}

// 查看
const handleView = (row: Product) => {
  console.log('查看商品', row)
}

// 删除
const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(`确认删除商品"${row.name}"？`, '提示', {
      type: 'warning',
    })
    await api.product.deleteProduct(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // 取消删除
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个商品？`, '提示', {
      type: 'warning',
    })
    await api.product.batchDeleteProduct(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchList()
  } catch {
    // 取消删除
  }
}

// 状态变更
const handleStatusChange = async (id: number, status: number) => {
  try {
    await api.product.updateProductStatus(id, status)
    ElMessage.success('状态更新成功')
  } catch {
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

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .product-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    cursor: pointer;
  }

  .product-image-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    background-color: var(--el-fill-color-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-placeholder);
    font-size: 24px;
  }

  .product-detail {
    .name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .code {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.price {
  color: var(--el-color-danger);
  font-weight: 500;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
