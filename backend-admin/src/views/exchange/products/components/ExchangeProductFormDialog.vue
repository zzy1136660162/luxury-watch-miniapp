<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增兑换商品' : '编辑兑换商品'"
    width="600px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入商品名称" />
      </el-form-item>

      <el-form-item label="商品编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入商品编码" />
      </el-form-item>

      <el-form-item label="所需积分" prop="pointsCost">
        <el-input-number v-model="form.pointsCost" :min="0" :precision="0" style="width: 100%" />
      </el-form-item>

      <el-form-item label="库存数量" prop="stock">
        <el-input-number v-model="form.stock" :min="0" :precision="0" style="width: 100%" />
      </el-form-item>

      <el-form-item label="商品状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>

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
import exchangeApi from '@/api/modules/exchange'
import ImagesUpload from '@/components/ImagesUpload.vue'

interface Props {
  visible: boolean
  type: 'add' | 'edit'
  data?: any
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

const form = reactive<any>({
  name: '',
  code: '',
  pointsCost: 0,
  stock: 0,
  status: 1,
  image: '',
  description: '',
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  pointsCost: [{ required: true, message: '请输入所需积分', trigger: 'blur' }],
}

// 监听数据变化，回填表单
watch(() => props.data, (newData) => {
  if (newData && props.type === 'edit') {
    Object.assign(form, {
      id: newData.id,
      name: newData.name || '',
      code: newData.code || '',
      pointsCost: newData.pointsCost || 0,
      stock: newData.stock || 0,
      status: newData.status ?? 1,
      image: newData.image || '',
      description: newData.description || '',
    })
  } else {
    // 重置表单
    Object.assign(form, {
      name: '',
      code: '',
      pointsCost: 0,
      stock: 0,
      status: 1,
      image: '',
      description: '',
    })
  }
}, {
  immediate: true,
})

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (props.type === 'add') {
      await exchangeApi.createExchangeProduct(form)
      ElMessage.success('新增成功')
    } else {
      await exchangeApi.updateExchangeProduct(form.id, form)
      ElMessage.success('编辑成功')
    }

    emit('success')
    visible.value = false
  } catch (error: any) {
    if (error !== false) {
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>
