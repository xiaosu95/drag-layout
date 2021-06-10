<template>
  <div class="tabs">
    <el-tabs type="border-card" class="card">
      <el-tab-pane label="用户管理">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Tabs extends Vue {}
</script>

<style lang="less" scoped>
.tabs {
  width: 100%;
  height: 100%;
  .card {
    height: 100%;
  }
}
</style>
