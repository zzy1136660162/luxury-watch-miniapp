<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增腕表' : '编辑腕表'"
    width="900px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="watch-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="腕表名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入腕表名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="form.nameEn" placeholder="请输入英文名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="副标题" prop="subtitle">
            <el-input v-model="form.subtitle" placeholder="请输入副标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文副标题" prop="subtitleEn">
            <el-input v-model="form.subtitleEn" placeholder="请输入英文副标题" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属系列" prop="seriesId">
            <el-select v-model="form.seriesId" placeholder="请选择系列" style="width: 100%">
              <el-option
                v-for="item in seriesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考价格" prop="price">
            <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="腕表标签">
        <el-checkbox-group v-model="tags">
          <el-checkbox :label="1">热门</el-checkbox>
          <el-checkbox :label="2">新品</el-checkbox>
          <el-checkbox :label="3">推荐</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="主图" prop="mainImage">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="form.mainImage" :src="form.mainImage" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="腕表参数">
        <el-card shadow="never" class="params-card">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="表壳尺寸">
                <el-input v-model="form.caseSize" placeholder="如：40mm" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表壳材质">
                <el-input v-model="form.caseMaterial" placeholder="如：精钢" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="表盘颜色">
                <el-input v-model="form.dialColor" placeholder="如：黑色" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机芯类型">
                <el-input v-model="form.movementType" placeholder="如：自动机械" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="机芯型号">
                <el-input v-model="form.movementModel" placeholder="如：Cal.3235" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="动力储存">
                <el-input v-model="form.powerReserve" placeholder="如：70小时" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="防水性能">
                <el-input v-model="form.waterResistance" placeholder="如：100米" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表带材质">
                <el-input v-model="form.strapMaterial" placeholder="如：鳄鱼皮" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="表镜材质">
                <el-input v-model="form.crystal" placeholder="如：蓝宝石水晶玻璃" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="功能">
                <el-input v-model="form.functions" placeholder="如：日期显示、计时" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form-item>

      <el-form-item label="腕表详情">
        <!-- TODO: 集成富文本编辑器 -->
        <el-input
          v-model="form.detail"
          type="textarea"
          :rows="6"
          placeholder="请输入腕表详情描述"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
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
import type { Watch, WatchSeries } from '@/types'

interface Props {
  visible: boolean
  type: 'add' | 'edit'
  data?: Partial<Watch>
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
const seriesList = ref<WatchSeries[]>([])

// 表单数据
const form = reactive<Partial<Watch>>({
  name: '',
  nameEn: '',
  subtitle: '',
  subtitleEn: '',
  seriesId: undefined,
  price: undefined,
  mainImage: '',
  caseSize: '',
  caseMaterial: '',
  dialColor: '',
  movementType: '',
  movementModel: '',
  powerReserve: '',
  waterResistance: '',
  strapMaterial: '',
  crystal: '',
  functions: '',
  detail: '',
  status: 1,
  isHot: false,
  isNew: false,
  isRecommend: false,
})

// 标签
const tags = ref<number[]>([])

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入腕表名称', trigger: 'blur' }],
  seriesId: [{ required: true, message: '请选择所属系列', trigger: 'change' }],
}

// 初始化表单数据
watch(
  () => props.visible,
  (val) => {
    if (val && props.data) {
      Object.assign(form, props.data)
      tags.value = []
      if (props.data.isHot) tags.value.push(1)
      if (props.data.isNew) tags.value.push(2)
      if (props.data.isRecommend) tags.value.push(3)
    } else {
      formRef.value?.resetFields()
      tags.value = []
    }
  }
)

// 获取系列列表
const fetchSeriesList = async () => {
  // TODO: 对接后端API
  seriesList.value = [
    { id: 1, name: '星空系列' },
    { id: 2, name: '经典系列' },
    { id: 3, name: '运动系列' },
  ] as WatchSeries[]
}

fetchSeriesList()

// 上传前校验
const beforeUpload = (file: UploadRawFile) => {
  // TODO: 实现图片上传逻辑
  console.log('上传图片', file)
  return false
}

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  // 处理标签
  form.isHot = tags.value.includes(1)
  form.isNew = tags.value.includes(2)
  form.isRecommend = tags.value.includes(3)

  submitting.value = true
  try {
    if (props.type === 'add') {
      // TODO: 对接后端API
      // await api.watch.createWatch(form)
      ElMessage.success('新增成功')
    } else {
      // TODO: 对接后端API
      // await api.watch.updateWatch(form.id!, form)
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
.watch-form {
  max-height: 60vh;
  overflow-y: auto;
}

.params-card {
  background-color: var(--el-fill-color-light);

  :deep(.el-form-item) {
    margin-bottom: 18px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}
</style>
