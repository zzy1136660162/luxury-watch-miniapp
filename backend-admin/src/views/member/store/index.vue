<script setup lang="ts">
import { storeApi } from '@/api/modules/store'
import { ElButton, ElTable, ElForm, ElFormItem, ElInput, ElInputNumber, ElDialog, ElSpace, ElSwitch, ElMessage } from 'element-plus'
import { h, ref } from 'vue'
import { formatDateTime } from '@/utils'

const columns = [
  { prop: 'name', label: '门店名称' },
  { prop: 'address', label: '门店地址' },
  { prop: 'phone', label: '联系电话' },
  { prop: 'sort', label: '排序', width: 80 },
  {
    prop: 'status',
    label: '状态',
    width: 80,
    render: (row: any) => row.status === 1 ? '正常' : '禁用'
  },
  { prop: 'createTime', label: '创建时间', width: 180, render: (row: any) => formatDateTime(row.createTime) },
  {
    prop: 'actions',
    label: '操作',
    width: 150,
    render: (row: any) => [
      h(ElButton, { size: 'small', onClick: () => handleEdit(row) }, () => '编辑'),
      h(ElButton, { size: 'small', type: 'danger', onClick: () => handleDelete(row.id), style: 'margin-left: 8px' }, () => '删除')
    ]
  }
]

const data = ref<any[]>([])
const loading = ref(false)
const pagination = ref({ page: 1, pageSize: 10, total: 0 })

const showDialog = ref(false)
const isEdit = ref(false)
const formData = ref({
  id: null as number | null,
  name: '',
  address: '',
  phone: '',
  sort: 0,
  status: 1
})

const searchForm = ref({
  name: '',
  status: null as number | null
})

const loadData = async () => {
  try {
    loading.value = true
    const res: any = await storeApi.list({
      page: pagination.value.page,
      size: pagination.value.pageSize,
      name: searchForm.value.name || undefined,
      status: searchForm.value.status
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

const handleSearch = () => {
  pagination.value.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.value.name = ''
  searchForm.value.status = null
  pagination.value.page = 1
  loadData()
}

const handleAdd = () => {
  isEdit.value = false
  formData.value = {
    id: null,
    name: '',
    address: '',
    phone: '',
    sort: 0,
    status: 1
  }
  showDialog.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  formData.value = { ...row }
  showDialog.value = true
}

const handleSubmit = async () => {
  if (!formData.value.name) {
    ElMessage.error('请输入门店名称')
    return
  }
  if (!formData.value.address) {
    ElMessage.error('请输入门店地址')
    return
  }

  try {
    if (isEdit.value) {
      await storeApi.update(formData.value.id, formData.value)
    } else {
      await storeApi.create(formData.value)
    }
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    showDialog.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await storeApi.delete(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
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
  <div class="store-management">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="门店名称">
          <el-input v-model="searchForm.name" placeholder="请输入门店名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="门店状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增门店
      </el-button>
    </div>

    <el-table :data="data" :loading="loading" stripe>
      <el-table-column v-for="col in columns" :key="col.prop" v-bind="col">
        <template v-if="col.prop === 'status'" #default="{ row }">
          {{ row.status === 1 ? '正常' : '禁用' }}
        </template>
        <template v-else-if="col.prop === 'actions'" #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
        <template v-else-if="col.prop === 'createTime'" #default="{ row }">
          {{ formatDateTime(row.createTime) }}
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

    <el-dialog v-model="showDialog" :title="isEdit ? '编辑门店' : '新增门店'" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="门店名称" required>
          <el-input v-model="formData.name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店地址" required>
          <el-input v-model="formData.address" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.store-management {
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
