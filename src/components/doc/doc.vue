<template>
  <div class="doc">
    <!-- <div v-html="content" v-highlight></div> -->
    <api-md v-highlight></api-md>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "highlight.js/styles/atom-one-dark.css";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const apiMd = require("../apis/drawingBoard.md").default;
@Component({
  components: {
    apiMd
  }
})
export default class Doc extends Vue {
  md = "";
  content = "";
  created() {
    //
  }
}
</script>

<style lang="less">
.doc {
  @import "./md.less";
  margin-top: 30px;
  padding: 0 20px 20px;
  li {
    list-style: initial;
  }
  code {
    font-size: 16px;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
      Courier New, monospace;
  }
}
</style>
