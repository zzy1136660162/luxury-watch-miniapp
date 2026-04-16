<template>
  <div class="page-container">
    <!-- 类型切换 -->
    <el-card class="type-card" shadow="never">
      <div class="type-tabs">
        <el-button 
          v-for="type in listTypes" 
          :key="type.value"
          :type="activeType === type.value ? 'primary' : 'default'"
          @click="switchType(type.value)"
        >
          {{ type.label }}
        </el-button