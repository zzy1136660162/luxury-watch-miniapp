<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import api from '@/api'
import Editor from '@tinymce/tinymce-vue'

interface Props {
  modelValue: boolean
  isEdit: boolean
  data?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const formRef = ref<FormInstance>()
const submitting = ref(false)
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const form = reactive({
  id: null as number | null,
  name: '',
  logo: '',
  content: ''
})

const rules = {
  name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
}

// 上传配置
const baseUrl = import.meta.env.VITE_APP_API_BASEURL || 'http://localhost:8081'
const isProxy = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY
const uploadUrl = isProxy ? '/proxy/api/upload/image' : '/api/upload/image'

// 富文本图片上传
const handleImageUpload = (blobInfo: any, progress: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token') || ''
      }
    }).then(res => {
      if (res.data && res.data.code === 200) {
        const uploadedUrl = res.data.data.url
        resolve(uploadedUrl)
      } else {
        reject(new Error(res.data?.msg || res.data?.message || '上传失败'))
      }
    }).catch(err => {
      console.error('图片上传失败:', err)
      reject(new Error(err.response?.data?.msg || err.message || '上传失败'))
    })
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.data) {
      Object.assign(form, props.data)
    } else {
      formRef.value?.resetFields()
      form.id = null
      form.name = ''
      form.logo = ''
      form.content = ''
    }
  }
)

// 触发文件选择
const triggerUpload = () => {
  fileInputRef.value?.click()
}

// 处理文件上传
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（最大 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token') || ''
      }
    })

    if (res.data && res.data.code === 200) {
      form.logo = res.data.data.url
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.data?.msg || '上传失败')
    }
  } catch (error: any) {
    console.error('上传失败:', error)
    ElMessage.error(error.response?.data?.msg || error.message || '上传失败')
  } finally {
    uploading.value = false
    // 清空 input，允许重复选择同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

// 删除 Logo
const handleRemoveLogo = () => {
  form.logo = ''
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true

  try {
    if (props.isEdit) {
      await api.product.updateBrand(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await api.product.createBrand(form)
      ElMessage.success('创建成功')
    }
    visible.value = false
    emit('success')
  } catch (error) {
    ElMessage.error(props.isEdit ? '更新失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑品牌' : '新增品牌'"
    width="700px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入品牌名称" />
      </el-form-item>

      <el-form-item label="品牌Logo">
        <div class="logo-upload">
          <div v-if="form.logo" class="logo-preview">
            <el-image
              :src="form.logo"
              fit="contain"
              class="logo-image"
              :preview-src-list="[form.logo]"
            />
            <div class="logo-actions">
              <el-button size="small" type="primary" @click="triggerUpload" :loading="uploading">
                {{ uploading ? '上传中...' : '更换' }}
              </el-button>
              <el-button size="small" type="danger" @click="handleRemoveLogo">删除</el-button>
            </div>
          </div>
          <div v-else class="logo-placeholder" @click="triggerUpload">
            <el-icon v-if="!uploading" class="upload-icon"><Plus /></el-icon>
            <el-icon v-else class="upload-icon is-loading"><Loading /></el-icon>
            <span>{{ uploading ? '上传中...' : '点击上传Logo' }}</span>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
      </el-form-item>

      <el-form-item label="品牌介绍" prop="content">
        <Editor
          v-model="form.content"
          license-key="gpl"
          :tinymce-script-src="'/tinymce/tinymce.min.js'"
          :init="{
            height: 400,
            menubar: true,
            plugins: 'anchor lists advlist autolink charmap code media help link image',
            toolbar: 'undo redo | styles | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
            branding: false,
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; }',
            images_upload_handler: handleImageUpload,
            convert_urls: false,
            relative_urls: false,
            remove_script_host: false,
          }"
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

<style scoped lang="scss">
.logo-upload {
  .logo-preview {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-image {
      width: 80px;
      height: 80px;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      overflow: hidden;
    }

    .logo-actions {
      display: flex;
      gap: 8px;
    }
  }

  .logo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 80px;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
      color: #409eff;
    }

    .upload-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    span {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
