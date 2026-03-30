<template>
  <div class="page-container">
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="分类名称">
          <el-input v-model="searchForm.name" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item label="分类状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
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

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span class="title">商品分类</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增分类
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="分类名称" prop="name" min-width="200" />
        <el-table-column label="分类图标" width="120">
          <template #default="{ row }">
            <el-image v-if="row.icon" :src="row.icon" class="category-icon" fit="cover" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增分类' : '编辑分类'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级分类">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryTree"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级分类"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图标">
          <el-input v-model="form.icon" placeholder="请输入图标链接" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined as number | undefined,
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const submitting = ref(false)

// 表单
const form = reactive({
  id: undefined as number | undefined,
  parentId: undefined as number | undefined,
  name: '',
  icon: '',
  sort: 0,
  status: 1,
})

// 分类树
const categoryTree = ref<any[]>([])

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

// 获取列表数据
const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // const res = await apiCategory.getList(searchForm)
    // tableData.value = res.data
    
    // 模拟数据
    tableData.value = [
      {
        id: 1,
        name: '腕表',
        icon: '',
        sort: 1,
        status: 1,
        createTime: '2026-03-30 10:00:00',
        children: [
          { id: 11, name: '机械表', icon: '', sort: 1, status: 1, createTime: '2026-03-30 10:00:00' },
          { id: 12, name: '石英表', icon: '', sort: 2, status: 1, createTime: '2026-03-30 10:00:00' },
        ],
      },
      {
        id: 2,
        name: '配件',
        icon: '',
        sort: 2,
        status: 1,
        createTime: '2026-03-30 10:00:00',
      },
    ]
    categoryTree.value = [{ id: 0, name: '顶级分类', children: tableData.value }]
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = undefined
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  form.id = undefined
  form.parentId = undefined
  form.name = ''
  form.icon = ''
  form.sort = 0
  form.status = 1
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.parentId = row.parentId
  form.name = row.name
  form.icon = row.icon
  form.sort = row.sort
  form.status = row.status
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除分类 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // TODO: 调用API删除
    // await apiCategory.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    // TODO: 调用API保存
    // if (dialogType.value === 'add') {
    //   await apiCategory.create(form)
    // } else {
    //   await apiCategory.update(form)
    // }
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 16px;
    font-weight: 500;
  }
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
</style>
