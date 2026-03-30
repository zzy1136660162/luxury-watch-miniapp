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
          <el-form-item label="商品分类" prop="category">
            <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
              <el-option label="腕表" value="watch" />
              <el-option label="配件" value="accessory" />
              <el-option label="礼品" value="gift" />
            </el-select>
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
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="form.image" :src="form.image" class="avatar" />
          <div v-else class="upload-placeholder">
            <el-icon class="upload-icon"><Plus /></el-icon>
            <div class="upload-text">点击上传</div>
          </div>
        </el-upload>
        <div class="upload-tip">建议尺寸：800x800px，支持 jpg、png 格式</div>
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
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, UploadRawFile } from 'element-plus'
import type { Product } from '@/types'

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

// 表单数据
const form = reactive<Partial<Product>>({
  name: '',
  code: '',
  category: '',
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
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
}

// 初始化表单数据
watch(
  () => props.visible,
  (val) => {
    if (val && props.data) {
      Object.assign(form, props.data)
    } else {
      formRef.value?.resetFields()
      form.name = ''
      form.code = ''
      form.category = ''
      form.price = 0
      form.stock = 0
      form.image = ''
      form.description = ''
      form.status = 1
    }
  }
)

// 上传前校验
const beforeUpload = (file: UploadRawFile) => {
  // TODO: 实现图片上传逻辑
  console.log('上传图片', file)
  // 模拟上传成功
  form.image = 'https://via.placeholder.com/200x200'
  return false
}

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    if (props.type === 'add') {
      // TODO: 对接后端API
      // await api.product.createProduct(form)
      ElMessage.success('新增成功')
    } else {
      // TODO: 对接后端API
      // await api.product.updateProduct(form.id!, form)
      ElMessage.success('更新成功')
    }
    visible.value = false
    emit('success')
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

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 150px;
    height: 150px;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .upload-text {
    font-size: 12px;
    color: #8c939d;
    margin-top: 8px;
  }
}

.avatar {
  width: 150px;
  height: 150px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}
</style>
