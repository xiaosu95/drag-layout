<template>
  <div class="calendar">
    <el-calendar :range="['2019-03-04', '2019-03-24']"> </el-calendar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Calendar extends Vue {}
</script>

<style lang="less" scoped>
.calendar {
  width: 100%;
  height: 100%;
}
</style>
