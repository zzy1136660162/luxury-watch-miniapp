<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增商品' : '编辑商品'"
    width="700px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="product-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入商品编码" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品分类" prop="category_id">
            <el-cascader
              v-model="categoryValue"
              :options="categoryOptions"
              :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
              placeholder="请选择分类"
              style="width: 100%"
              @change="handleCategoryChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库存数量" prop="stock">
            <el-input-number v-model="form.stock" :min="0" :precision="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商品图片" prop="image">
        <ImagesUpload
          v-model="form.image"
          placeholder="点击上传"
          tip="建议尺寸：800x800px，支持 jpg、png、gif、webp 格式，最多上传9张图片"
        />
      </el-form-item>

      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入商品描述"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Product } from '@/types'
import api from '@/api'
import ImagesUpload from '@/components/ImagesUpload.vue'

interface CategoryOption {
  id: number
  name: string
  code: string
  children?: CategoryOption[]
}

interface Props {
  visible: boolean
  type: 'add' | 'edit'
  data?: Partial<Product>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const formRef = ref<FormInstance>()
const submitting = ref(false)
const categoryValue = ref<number>()

// 分类选项数据
const categoryOptions = ref<CategoryOption[]>([
  {
    id: 1,
    name: '腕表',
    code: 'watch',
    children: [
      { id: 4, name: '经典', code: 'classic' },
      { id: 5, name: '运动', code: 'sport' },
      { id: 6, name: '复杂功能', code: 'complication' },
      { id: 7, name: '女士', code: 'ladies' },
    ]
  },
  { id: 2, name: '配件', code: 'accessory' },
  { id: 3, name: '礼品', code: 'gift' },
])

// 表单数据
const form = reactive<Partial<Product>>({
  name: '',
  code: '',
  category: '',
  category_id: undefined,
  price: 0,
  stock: 0,
  image: '',
  description: '',
  status: 1,
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
}

// 分类选择变化处理
const handleCategoryChange = (value: number) => {
  form.category_id = value
  // 根据选择的分类ID找到对应的code
  const findCategoryCode = (options: CategoryOption[], id: number): string | undefined => {
    for (const opt of options) {
      if (opt.id === id) return opt.code
      if (opt.children) {
        const found = findCategoryCode(opt.children, id)
        if (found) return found
      }
    }
    return undefined
  }
  const code = findCategoryCode(categoryOptions.value, value)
  if (code) {
    form.category = code
  }
}

// 初始化表单数据
watch(
  () => props.visible,
  (val) => {
    if (val && props.data) {
      Object.assign(form, props.data)
      categoryValue.value = props.data.category_id
    } else {
      formRef.value?.resetFields()
      categoryValue.value = undefined
      form.name = ''
      form.code = ''
      form.category = ''
      form.category_id = undefined
      form.price = 0
      form.stock = 0
      form.image = ''
      form.description = ''
      form.status = 1
    }
  }
)

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    if (props.type === 'add') {
      await api.product.createProduct(form)
      ElMessage.success('新增成功')
    } else {
      await api.product.updateProduct(form.id!, form)
      ElMessage.success('更新成功')
    }
    visible.value = false
    emit('success')
  } catch (error) {
    ElMessage.error(props.type === 'add' ? '新增失败' : '更新失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.product-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
