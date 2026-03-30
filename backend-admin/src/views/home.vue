<template>
  <div class="page-container">
    <div class="page-header">
      <h1>首页</h1>
    </div>
    <div class="page-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>总用户数</span>
              </div>
            </template>
            <div class="card-content">
              <span class="number">1,234</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>总订单数</span>
              </div>
            </template>
            <div class="card-content">
              <span class="number">5,678</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>总销售额</span>
              </div>
            </template>
            <div class="card-content">
              <span class="number">¥12,345,678</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>今日访问</span>
              </div>
            </template>
            <div class="card-content">
              <span class="number">999</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}
.card-content {
  text-align: center;
  padding: 20px 0;
}
.number {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-color-primary);
}
</style>
