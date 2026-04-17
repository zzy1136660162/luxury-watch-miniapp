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
          <el-form-item label="商品品牌" prop="brand">
            <el-input v-model="form.brand" placeholder="请输入品牌名称，如：劳力士、欧米茄" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品系列" prop="series">
            <el-input v-model="form.series" placeholder="请输入系列名称，如：Submariner、Seamaster" @blur="handleSeriesBlur" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机芯编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入机芯编码" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="系列Logo" prop="seriesLogo">
            <div class="series-logo-upload">
              <div v-if="form.seriesLogo" class="logo-preview">
                <el-image
                  :src="form.seriesLogo"
                  fit="contain"
                  class="logo-image"
                  :preview-src-list="[form.seriesLogo]"
                />
                <div class="logo-actions">
                  <el-button size="small" type="primary" @click="triggerLogoUpload">更换</el-button>
                  <el-button size="small" type="danger" @click="form.seriesLogo = ''">删除</el-button>
                </div>
              </div>
              <div v-else class="logo-placeholder" @click="triggerLogoUpload">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <span>上传Logo</span>
              </div>
              <input
                ref="logoInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleLogoChange"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌图片" prop="brandImage">
            <div class="series-logo-upload">
              <div v-if="form.brandImage" class="logo-preview">
                <el-image
                  :src="form.brandImage"
                  fit="contain"
                  class="logo-image"
                  :preview-src-list="[form.brandImage]"
                />
                <div class="logo-actions">
                  <el-button size="small" type="primary" @click="triggerBrandImageUpload">更换</el-button>
                  <el-button size="small" type="danger" @click="form.brandImage = ''">删除</el-button>
                </div>
              </div>
              <div v-else class="logo-placeholder" @click="triggerBrandImageUpload">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <span>上传品牌图片</span>
              </div>
              <input
                ref="brandImageInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleBrandImageChange"
              />
            </div>
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
      </el-row>

      <el-row :gutter="20">
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
        <el-col :span="12">
          <el-form-item label="积分兑换" prop="canRedeemPoints">
            <el-radio-group v-model="form.canRedeemPoints">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.canRedeemPoints === 1" :span="12">
          <el-form-item label="兑换积分" prop="pointsCost">
            <el-input-number
              v-model="form.pointsCost"
              :min="0"
              :precision="0"
              style="width: 100%"
              placeholder="请输入所需积分"
            />
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

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="表壳尺寸" prop="caseSize">
            <el-input v-model="form.caseSize" placeholder="如：40毫米/10毫米厚度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="续航时长" prop="powerReserve">
            <el-input v-model="form.powerReserve" placeholder="如：72小时" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="防水深度" prop="waterResistance">
            <el-input-number
              v-model="form.waterResistance"
              :min="0"
              :precision="0"
              style="width: 100%"
              placeholder="默认单位：米"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质" prop="material">
            <el-input v-model="form.material" placeholder="如：18K玫瑰金、蓝宝石水晶玻璃" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="表带材质" prop="strap">
            <el-input v-model="form.strap" placeholder="如：真皮表带、钢带、橡胶表带" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入商品描述，此描述将会展示在商品卡中作为商品介绍"
        />
      </el-form-item>

      <el-form-item label="品牌故事" prop="brandStory">
        <Editor
          v-model="form.brandStory"
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

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Product } from '@/types'
import api from '@/api'
import ImagesUpload from '@/components/ImagesUpload.vue'
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'
import { Plus } from '@element-plus/icons-vue'

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
const logoInputRef = ref<HTMLInputElement>()
const brandImageInputRef = ref<HTMLInputElement>()

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
  brand: '',
  series: '',
  seriesLogo: '',
  brandImage: '',
  price: 0,
  stock: 0,
  image: '',
  description: '',
  status: 1,
  caseSize: '',
  powerReserve: '',
  waterResistance: undefined as number | undefined,
  material: '',
  strap: '',
  canRedeemPoints: 0,
  pointsCost: undefined as number | undefined,
  brandStory: '',
})

// 图片上传处理函数
const baseUrl = import.meta.env.VITE_APP_API_BASEURL || 'http://localhost:8081'
const isProxy = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY
const uploadUrl = isProxy ? '/proxy/api/upload/image' : '/api/upload/image'

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
        // 后端返回完整URL，直接使用
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

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入机芯编码', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  brand: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  waterResistance: [{ type: 'number', message: '请输入数字', trigger: 'blur' }],
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

// 系列输入框失焦时查询logo
const handleSeriesBlur = async () => {
  if (form.brand && form.series) {
    try {
      const res = await api.product.getSeriesLogo(form.brand, form.series)
      if (res.data && res.data.code === 200 && res.data.data) {
        form.seriesLogo = res.data.data
        ElMessage.success('已自动匹配到系列Logo')
      }
    } catch (error) {
      console.error('查询系列Logo失败:', error)
    }
  }
}

// 触发logo上传
const triggerLogoUpload = () => {
  logoInputRef.value?.click()
}

// 触发品牌图片上传
const triggerBrandImageUpload = () => {
  brandImageInputRef.value?.click()
}

// 处理品牌图片上传
const handleBrandImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（限制5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }

  // 创建FormData上传
  const formData = new FormData()
  formData.append('file', file)

  axios.post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': localStorage.getItem('token') || ''
    }
  }).then(res => {
    if (res.data && res.data.code === 200) {
      form.brandImage = res.data.data.url
      ElMessage.success('品牌图片上传成功')
    } else {
      ElMessage.error(res.data?.msg || '上传失败')
    }
  }).catch(err => {
    console.error('品牌图片上传失败:', err)
    ElMessage.error(err.response?.data?.msg || '上传失败')
  }).finally(() => {
    // 清空input
    if (target) {
      target.value = ''
    }
  })
}

// 处理logo上传
const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（限制5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }

  // 创建FormData上传
  const formData = new FormData()
  formData.append('file', file)

  axios.post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': localStorage.getItem('token') || ''
    }
  }).then(res => {
    if (res.data && res.data.code === 200) {
      form.seriesLogo = res.data.data.url
      ElMessage.success('Logo上传成功')
    } else {
      ElMessage.error(res.data?.msg || '上传失败')
    }
  }).catch(err => {
    console.error('Logo上传失败:', err)
    ElMessage.error(err.response?.data?.msg || '上传失败')
  }).finally(() => {
    // 清空input
    if (target) {
      target.value = ''
    }
  })
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
      form.brand = ''
      form.series = ''
      form.seriesLogo = ''
      form.brandImage = ''
      form.price = 0
      form.stock = 0
      form.image = ''
      form.description = ''
      form.status = 1
      form.caseSize = ''
      form.powerReserve = ''
      form.waterResistance = undefined
      form.material = ''
      form.strap = ''
      form.canRedeemPoints = 0
      form.pointsCost = undefined
      form.brandStory = ''
    }
  }
)

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true

  // 处理防水深度：如果为0则设为undefined（存入空值）
  const submitData = { ...form }
  if (submitData.waterResistance === 0) {
    submitData.waterResistance = undefined
  }

  try {
    if (props.type === 'add') {
      await api.product.createProduct(submitData)
      ElMessage.success('新增成功')
    } else {
      await api.product.updateProduct(submitData.id!, submitData)
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

.series-logo-upload {
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
    width: 80px;
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
    }
  }
}
</style>
