<template>
  <div class="images-upload">
    <div class="images-list">
      <div v-for="(img, index) in imageList" :key="index" class="image-item">
        <img :src="getFullUrl(img)" class="image-preview" />
        <div class="image-actions">
          <el-icon @click.stop="handlePreview(index)"><View /></el-icon>
          <el-icon v-if="!disabled" @click.stop="handleRemove(index)"><Delete /></el-icon>
        </div>
        <div v-if="!disabled" class="move-buttons">
          <el-icon class="move-up" @click.stop="handleMoveUp(index)" v-if="index > 0"><ArrowUp /></el-icon>
          <el-icon class="move-down" @click.stop="handleMoveDown(index)" v-if="index < imageList.length - 1"><ArrowDown /></el-icon>
        </div>
      </div>
      <el-upload
        v-if="!disabled && imageList.length < maxCount"
        class="upload-trigger"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :show-file-list="false"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
        accept="image/jpeg,image/png,image/gif,image/webp"
      >
        <div class="upload-placeholder">
          <el-icon v-if="loading" class="upload-loading"><Loading /></el-icon>
          <template v-else>
            <el-icon class="upload-icon"><Plus /></el-icon>
            <div class="upload-text">{{ placeholder }}</div>
          </template>
        </div>
      </el-upload>
    </div>
    <div v-if="tip" class="upload-tip">{{ tip }}</div>

    <el-image
      v-if="previewVisible"
      :src="previewUrl"
      :preview-src-list="previewList"
      :initial-index="previewIndex"
      preview-teleported
      class="preview-image"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Loading, View, Delete, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

interface Props {
  modelValue?: string
  placeholder?: string
  tip?: string
  disabled?: boolean
  maxCount?: number
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '点击上传',
  tip: '',
  disabled: false,
  maxCount: 9,
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

const uploadHeaders = ref({
  Authorization: localStorage.getItem('token') || '',
})

const imageList = ref<string[]>([])
const loading = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')
const previewIndex = ref(0)

const previewList = computed(() => imageList.value.map(img => getFullUrl(img)))

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    imageList.value = newVal.split(',').filter(Boolean)
  } else {
    imageList.value = []
  }
}, { immediate: true })

const getFullUrl = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img
  }
  return `${baseUrl}${img}`
}

const updateModelValue = () => {
  const value = imageList.value.join(',')
  emit('update:modelValue', value)
}

const handleBeforeUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB!`)
    return false
  }
  if (imageList.value.length >= props.maxCount) {
    ElMessage.error(`最多只能上传 ${props.maxCount} 张图片!`)
    return false
  }
  loading.value = true
  return true
}

const handleSuccess = (response: any) => {
  loading.value = false

  const resData = response
  if (resData && resData.code === 200) {
    const uploadedUrl = resData.data.url
    imageList.value.push(uploadedUrl)
    updateModelValue()
    emit('upload-success', uploadedUrl)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(resData?.msg || '图片上传失败')
    emit('upload-error', resData?.msg || '上传失败')
  }
}

const handleError = () => {
  loading.value = false
  ElMessage.error('图片上传失败')
}

const handlePreview = (index: number) => {
  previewIndex.value = index
  previewUrl.value = getFullUrl(imageList.value[index])
  previewVisible.value = true
}

const handleRemove = (index: number) => {
  imageList.value.splice(index, 1)
  updateModelValue()
}

const handleMoveUp = (index: number) => {
  if (index > 0) {
    const temp = imageList.value[index]
    imageList.value[index] = imageList.value[index - 1]
    imageList.value[index - 1] = temp
    updateModelValue()
  }
}

const handleMoveDown = (index: number) => {
  if (index < imageList.value.length - 1) {
    const temp = imageList.value[index]
    imageList.value[index] = imageList.value[index + 1]
    imageList.value[index + 1] = temp
    updateModelValue()
  }
}
</script>

<style scoped lang="scss">
.images-upload {
  width: 100%;
}

.images-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);

  .image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-actions {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.3s;

    .el-icon {
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.8);
      }
    }
  }

  .move-buttons {
    position: absolute;
    bottom: 4px;
    right: 4px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.3s;

    .el-icon {
      width: 20px;
      height: 20px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;

      &:hover {
        background: rgba(0, 0, 0, 0.8);
      }
    }
  }

  &:hover .image-actions,
  &:hover .move-buttons {
    opacity: 1;
  }
}

.upload-trigger {
  width: 100px;
  height: 100px;

  .upload-placeholder {
    width: 100px;
    height: 100px;
    border: 1px dashed var(--el-border-color);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-fill-color-light);
    }

    .upload-icon {
      font-size: 28px;
      color: var(--el-text-color-secondary);
    }

    .upload-text {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
    }
  }
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.preview-image {
  display: none;
}
</style>
