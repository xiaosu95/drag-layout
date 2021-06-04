<template>
  <div class="backtop">
    <div>
      UP
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Backtop extends Vue {}
</script>

<style lang="less" scoped>
.backtop {
  width: 100%;
  height: 100%;
  div {
    height: 100%;
    width: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 50px;
    color: #1989fa;
  }
}
</style>
