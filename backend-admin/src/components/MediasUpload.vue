<template>
  <div class="medias-upload">
    <div class="medias-list">
      <div v-for="(media, index) in mediaList" :key="index" class="media-item">
        <video v-if="isVideo(media)" class="media-preview" :src="getFullUrl(media)" />
        <img v-else :src="getFullUrl(media)" class="media-preview" />
        <div class="media-actions">
          <el-icon @click.stop="handlePreview(index)"><View /></el-icon>
          <el-icon v-if="!disabled" @click.stop="handleRemove(index)"><Delete /></el-icon>
        </div>
        <div v-if="!disabled" class="move-buttons">
          <el-icon class="move-up" @click.stop="handleMoveUp(index)" v-if="index > 0"><ArrowUp /></el-icon>
          <el-icon class="move-down" @click.stop="handleMoveDown(index)" v-if="index < mediaList.length - 1"><ArrowDown /></el-icon>
        </div>
      </div>
      <div
        v-if="!disabled && mediaList.length < maxCount"
        class="upload-trigger"
        @click="triggerUpload"
      >
        <div class="upload-placeholder">
          <el-icon v-if="loading" class="upload-loading"><Loading /></el-icon>
          <template v-else>
            <el-icon class="upload-icon"><Plus /></el-icon>
            <div class="upload-text">{{ placeholder }}</div>
          </template>
        </div>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        :accept="acceptTypes"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
    <div v-if="tip" class="upload-tip">{{ tip }}</div>

    <el-dialog v-model="previewVisible" title="预览" width="60%" destroy-on-close>
      <div class="preview-container">
        <video v-if="isVideo(previewUrl)" class="preview-video" :src="getFullUrl(previewUrl)" controls autoplay />
        <img v-else :src="getFullUrl(previewUrl)" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Loading, View, Delete, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios'

interface Props {
  modelValue?: string
  placeholder?: string
  tip?: string
  disabled?: boolean
  maxCount?: number
  maxSize?: number
  acceptTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '点击上传',
  tip: '',
  disabled: false,
  maxCount: 9,
  maxSize: 500,
  acceptTypes: 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [url: string]
  'upload-error': [error: string]
}>()

const baseUrl = import.meta.env.VITE_APP_API_BASEURL || 'http://localhost:8081'
const uploadImageUrl = `${baseUrl}/api/upload/image`
const uploadVideoUrl = `${baseUrl}/api/upload/video`

const uploadHeaders = {
  Authorization: localStorage.getItem('token') || '',
}

const fileInputRef = ref<HTMLInputElement>()
const mediaList = ref<string[]>([])
const loading = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')
const previewIndex = ref(0)

const previewList = computed(() => mediaList.value.map(media => getFullUrl(media)))

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    mediaList.value = newVal.split(',').filter(Boolean)
  } else {
    mediaList.value = []
  }
}, { immediate: true })

const isVideo = (media: string) => {
  if (!media) return false
  const ext = media.toLowerCase().split('.').pop()
  return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext || '')
}

const getFullUrl = (media: string) => {
  if (!media) return ''
  if (media.startsWith('http://') || media.startsWith('https://')) {
    return media
  }
  return `${baseUrl}${media}`
}

const updateModelValue = () => {
  const value = mediaList.value.join(',')
  console.log('updateModelValue - 发送的值:', value)
  emit('update:modelValue', value)
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/')
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize

  if (!isMedia) {
    ElMessage.error('只能上传图片或视频文件!')
    return
  }
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB!`)
    return
  }
  if (mediaList.value.length >= props.maxCount) {
    ElMessage.error(`最多只能上传 ${props.maxCount} 个文件!`)
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const isVideoFile = file.type.startsWith('video/')
    const uploadUrl = isVideoFile ? uploadVideoUrl : uploadImageUrl

    const res = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...uploadHeaders
      }
    })

    if (res.data && res.data.code === 200) {
      const uploadedUrl = res.data.data.url
      console.log('上传成功，URL:', uploadedUrl)
      console.log('当前mediaList:', mediaList.value)
      mediaList.value.push(uploadedUrl)
      console.log('更新后mediaList:', mediaList.value)
      updateModelValue()
      emit('upload-success', uploadedUrl)
      ElMessage.success('上传成功')
    } else {
      console.error('上传失败，返回数据:', res.data)
      ElMessage.error(res.data?.msg || '上传失败')
      emit('upload-error', res.data?.msg || '上传失败')
    }
  } catch (error: any) {
    console.error('上传失败:', error)
    ElMessage.error(error.response?.data?.msg || error.message || '上传失败')
    emit('upload-error', error.response?.data?.msg || error.message || '上传失败')
  } finally {
    loading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const handlePreview = (index: number) => {
  previewIndex.value = index
  previewUrl.value = getFullUrl(mediaList.value[index])
  previewVisible.value = true
}

const handleRemove = (index: number) => {
  mediaList.value.splice(index, 1)
  updateModelValue()
}

const handleMoveUp = (index: number) => {
  if (index > 0) {
    const temp = mediaList.value[index]
    mediaList.value[index] = mediaList.value[index - 1]
    mediaList.value[index - 1] = temp
    updateModelValue()
  }
}

const handleMoveDown = (index: number) => {
  if (index < mediaList.value.length - 1) {
    const temp = mediaList.value[index]
    mediaList.value[index] = mediaList.value[index + 1]
    mediaList.value[index + 1] = temp
    updateModelValue()
  }
}
</script>

<style scoped lang="scss">
.medias-upload {
  width: 100%;
}

.medias-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.media-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);

  .media-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-actions {
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

  &:hover .media-actions,
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

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 70vh;

  .preview-video {
    max-width: 100%;
    max-height: 70vh;
  }

  .preview-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
}
</style>
