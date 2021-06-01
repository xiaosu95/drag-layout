<template>
  <div id="app">
    <el-container class="container">
      <el-header class="header">
        <h1>
          test
        </h1>
      </el-header>
      <el-container class="el-container_b">
        <el-aside style="width:280px;" class="tool_bar">
          asdfa
        </el-aside>
        <el-main>
          <el-card class="box-card">
            <div class="screen_box" ref="boxEle"></div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DragLayout } from "@/index";
@Component
export default class App extends Vue {
  mounted() {
    const d = new DragLayout({
      boxEle: this.$refs.boxEle as HTMLDivElement
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "200px"
    });
    d.addSpirit({
      height: "100px",
      type: "container"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "150px",
      type: "container"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "100px"
    });
    d.addSpirit({
      height: "100px"
    });

    d.addSpirit({
      height: "100px",
      width: "100px",
      type: "absolute"
    });
  }
}
</script>

<style lang="less">
body,
html {
  height: 100%;
}
li {
  list-style: none;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-container_b {
  min-height: 0;
}
.screen_box {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  padding: 0 5px 10px;
  .other {
    width: 1200px;
    margin: 0 auto;
  }
  .tool_bar {
    width: 150px;
  }
  .header {
    height: 60px;
    line-height: 60px;
    h1 {
      font-size: 20px;
      display: inline;
    }
    span {
      margin-left: 20px;
    }
  }
  .container {
    height: 100vh;
    .el-main {
      padding: 0;
    }
  }
  .box-card {
    position: relative;
    height: 100%;
    .el-card__body {
      height: 100%;
    }
    .tool {
      position: absolute;
      left: 30px;
      top: 30px;
      overflow: hidden;
      padding: 5px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 6px;
      span {
        float: left;
        font-size: 20px;
        color: #666;
        width: 30px;
        height: 30px;
        line-height: 28px;
        margin: 0 10px;
        cursor: pointer;
        &:hover {
          color: #333;
        }
      }
    }
  }
  .drawingBoard {
    height: 100%;
  }
  .link {
    margin-top: 20px;
    font-size: 16px;
    padding-left: 20px;
    a {
      font-weight: normal;
    }
  }
}
</style>
