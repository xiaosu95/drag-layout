<template>
  <div class="banner">
    <el-carousel class="banner_box" height="100%">
      <el-carousel-item v-for="item in list" :key="item">
        <img :src="item" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Banner extends Vue {
  list = [
    "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
    "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
    "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
  ];
}
</script>

<style lang="less" scoped>
.banner {
  width: 100%;
  height: 100%;
  .banner_box {
    height: 100%;
  }
}
</style>
