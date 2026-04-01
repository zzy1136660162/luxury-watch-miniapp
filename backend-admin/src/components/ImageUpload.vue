<template>
  <div class="image-upload">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :disabled="disabled"
      accept="image/jpeg,image/png,image/gif,image/webp"
    >
      <div v-if="imageUrl" class="avatar-wrapper">
        <img :src="fullImageUrl" class="avatar" />
        <div class="avatar-actions">
          <el-icon @click.stop="handlePreview"><View /></el-icon>
          <el-icon v-if="!disabled" @click.stop="handleRemove"><Delete /></el-icon>
        </div>
      </div>
      <div v-else class="upload-placeholder">
        <el-icon v-if="loading" class="upload-loading"><Loading /></el-icon>
        <template v-else>
          <el-icon class="upload-icon"><Plus /></el-icon>
          <div class="upload-text">{{ placeholder }}</div>
        </template>
      </div>
    </el-upload>
    <div v-if="tip" class="upload-tip">{{ tip }}</div>

    <el-image
      v-if="previewVisible"
      :src="fullImageUrl"
      :preview-src-list="[fullImageUrl]"
      :initial-index="0"
      preview-teleported
      class="preview-image"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Loading, View, Delete } from '@element-plus/icons-vue'

interface Props {
  modelValue?: string
  placeholder?: string
  tip?: string
  disabled?: boolean
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '点击上传',
  tip: '',
  disabled: false,
  maxSize: 10,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [url: string]
  'upload-error': [error: string]
}>()

const baseUrl = import.meta.env.VITE_APP_API_BASEURL || 'http://localhost:8081'
const isProxy = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY
const actualBaseUrl = isProxy ? '/proxy' : baseUrl
const uploadUrl = `${actualBaseUrl}/api/upload/image`

console.log('🌐 [ImageUpload] 上传配置:', {
  'VITE_APP_API_BASEURL': import.meta.env.VITE_APP_API_BASEURL,
  'VITE_OPEN_PROXY': import.meta.env.VITE_OPEN_PROXY,
  '开发模式': import.meta.env.DEV,
  '是否使用代理': isProxy,
  'baseUrl': baseUrl,
  'actualBaseUrl': actualBaseUrl,
  'uploadUrl': uploadUrl
})

const uploadHeaders = ref({
  Authorization: localStorage.getItem('token') || '',
})

const imageUrl = ref(props.modelValue)
const loading = ref(false)
const previewVisible = ref(false)

console.log('🔧 [ImageUpload] 组件初始化:', {
  'props.modelValue(原始值)': props.modelValue,
  'baseUrl': baseUrl,
  'uploadUrl': uploadUrl
})

const fullImageUrl = computed(() => {
  console.log('🖼️ [ImageUpload] 计算 fullImageUrl:', {
    'imageUrl.value': imageUrl.value,
    'baseUrl': baseUrl,
    '计算结果': !imageUrl.value ? '' : imageUrl.value.startsWith('http') ? imageUrl.value : `${baseUrl}${imageUrl.value}`
  })
  if (!imageUrl.value) return ''

  if (imageUrl.value.startsWith('http://') || imageUrl.value.startsWith('https://')) {
    return imageUrl.value
  }

  return `${baseUrl}${imageUrl.value}`
})

watch(() => props.modelValue, (newVal) => {
  console.log('👁️ [ImageUpload] props.modelValue 变化:', {
    '旧值': imageUrl.value,
    '新值': newVal
  })
  imageUrl.value = newVal
})



const handleSuccess = (response: any, file: any) => {
  loading.value = false

  console.log('🔍 [ImageUpload] ====== 上传成功回调触发 ======')
  console.log('📦 [ImageUpload] 原始 response 完整对象:', JSON.stringify(response, null, 2))
  console.log('')
  console.log('📋 [ImageUpload] ====== response 详细结构 ======')
  console.log('1. response.status:', response.status)
  console.log('2. response.statusText:', response.statusText)
  console.log('3. response.data:', response.data)
  console.log('4. response.data?.code:', response.data?.code)
  console.log('5. response.data?.data:', response.data?.data)
  console.log('6. response.data?.data?.url:', response.data?.data?.url)
  console.log('')

  // el-upload success 回调接收 axios 的原始 response
  // API 拦截器返回的是 response.data（整个响应体）
  const resData = response

  console.log('🎯 [ImageUpload] ====== 解析后的 resData ======')
  console.log('resData:', resData)
  console.log('resData?.code:', resData?.code)
  console.log('resData?.data?.url:', resData?.data?.url)
  console.log('')

  if (resData && resData.code === 200) {
    const uploadedUrl = resData.data.url
    console.log('✅ [ImageUpload] ====== 上传成功 ======')
    console.log('✅ 图片URL:', uploadedUrl)
    console.log('========================================')
    imageUrl.value = uploadedUrl
    emit('update:modelValue', uploadedUrl)
    emit('upload-success', uploadedUrl)
    ElMessage.success('图片上传成功')
  } else {
    console.error('❌ [ImageUpload] ====== 上传失败 ======')
    console.error('❌ 错误信息:', resData?.msg || '未知错误')
    console.error('========================================')
    ElMessage.error(resData?.msg || '图片上传失败')
    emit('upload-error', resData?.msg || '上传失败')
  }
}

const handleError = (error: any) => {
  loading.value = false

  console.error('❌❌❌ [ImageUpload] ====== handleError 触发 ======')
  console.error('❌❌❌ 注意：请求进入了错误回调！')
  console.error('==========================================')
  console.error('❌ 错误对象:', error)
  console.error('')
  console.error('📋 错误详情:')
  console.error('1. error.message:', error?.message)
  console.error('2. error.code:', error?.code)
  console.error('3. error.status:', error?.status)
  console.error('4. error.response:', error?.response)
  console.error('5. error.response?.status:', error?.response?.status)
  console.error('6. error.response?.statusText:', error?.response?.statusText)
  console.error('7. error.response?.data:', error?.response?.data)
  console.error('8. error.request:', error?.request)
  console.error('')
  console.error('==========================================')

  // 尝试提取有用的错误信息
  let errorMsg = '图片上传失败，请重试'
  if (error?.response?.data?.msg) {
    errorMsg = error.response.data.msg
  } else if (error?.response?.statusText) {
    errorMsg = `请求失败: ${error.response.statusText}`
  } else if (error?.message) {
    errorMsg = error.message
  }

  console.error('❌ 最终错误信息:', errorMsg)
  console.error('==========================================')

  ElMessage.error(errorMsg)
  emit('upload-error', errorMsg)
}

const handlePreview = () => {
  if (imageUrl.value) {
    previewVisible.value = true
  }
}

const handleRemove = () => {
  console.log('🗑️ [ImageUpload] 删除图片，当前 imageUrl:', imageUrl.value)
  imageUrl.value = ''
  console.log('🗑️ [ImageUpload] 已清空图片')
  emit('update:modelValue', '')
  emit('upload-success', '')
}
</script>

<style scoped lang="scss">
.image-upload {
  display: inline-block;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;

    &:hover {
      border-color: #d4af37;
    }
  }
}

.avatar-wrapper {
  position: relative;
  width: 148px;
  height: 148px;

  .avatar {
    width: 148px;
    height: 148px;
    display: block;
    object-fit: cover;
  }

  .avatar-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    opacity: 0;
    transition: opacity 0.3s;

    .el-icon {
      font-size: 24px;
      color: #fff;
      cursor: pointer;

      &:hover {
        color: #d4af37;
      }
    }
  }

  &:hover .avatar-actions {
    opacity: 1;
  }
}

.avatar {
  width: 148px;
  height: 148px;
  display: block;
  object-fit: cover;
}

.upload-placeholder {
  width: 148px;
  height: 148px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .upload-loading {
    font-size: 28px;
    color: #8c939d;
    animation: rotating 2s linear infinite;
  }

  .upload-text {
    margin-top: 8px;
    font-size: 12px;
    color: #8c939d;
  }
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
