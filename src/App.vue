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
          <div>
            <el-switch
              v-model="editMode"
              active-value="fixed"
              inactive-value="default"
              active-text="首屏模式"
              @change="changeEditMode"
              inactive-text="全部内容"
            >
            </el-switch>
          </div>
          <div>
            <el-switch
              v-model="adsorption"
              active-text="吸附模式"
              @change="changeAdsorption"
            >
            </el-switch>
          </div>
          <div class="components">
            <div
              draggable="true"
              data-component-type="banner"
              @dragstart="handleDragstart"
            >
              我是一个组件
            </div>
            <div
              draggable="true"
              data-component-type="calendar"
              @dragstart="handleDragstart"
            >
              我是一个日历组件
            </div>
            <div
              draggable="true"
              data-component-type="table"
              @dragstart="handleDragstart"
            >
              我是一个表格组件
            </div>
            <div
              draggable="true"
              data-component-type="backtop"
              @dragstart="handleDragstart"
            >
              我是一个backtop组件
            </div>
          </div>
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
import Banner from "./components/test/banner/index.vue";
import Calendar from "./components/test/calendar/index.vue";
import TestTable from "./components/test/table/index.vue";
import Backtop from "./components/test/backtop/index.vue";
@Component
export default class App extends Vue {
  editMode = "default";
  adsorption = true;
  dragLayout: DragLayout;
  mounted() {
    this.dragLayout = new DragLayout(this.$refs.boxEle as HTMLDivElement, {
      handleDrop: (event: DragEvent) => {
        console.log(324234, event);
        const type = event.dataTransfer.getData("type");
        switch (type) {
          case "banner": {
            const $banner = new Banner({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              height: "300px",
              render: $banner.$el
            });
            break;
          }
          case "calendar": {
            const $calendar = new Calendar({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              height: "400px",
              render: $calendar.$el
            });
            break;
          }
          case "table": {
            const $testTable = new TestTable({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              height: "300px",
              render: $testTable.$el
            });
            break;
          }
          case "backtop": {
            const $backtop = new Backtop({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              disableResizable: true,
              type: "fixed",
              height: "50px",
              width: "50px",
              render: $backtop.$el,
              left: event.offsetX,
              top: event.offsetY
            });
            break;
          }
          default:
            break;
        }
      }
    });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "200px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px",
    //   type: "flex"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "150px",
    //   type: "container"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });

    // this.dragLayout.addSpirit({
    //   height: "100px",
    //   width: "100px",
    //   type: "absolute"
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px",
    //   width: "100px",
    //   type: "fixed"
    // });
  }

  handleDragstart(event: DragEvent) {
    event.dataTransfer.setData(
      "type",
      (event.target as any).getAttribute("data-component-type")
    );
  }

  changeEditMode(val: any) {
    this.dragLayout.setEditMode(val);
  }

  changeAdsorption(bool: boolean) {
    this.dragLayout.setAdsorption(bool);
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
.components {
  div {
    width: 100px;
    height: 100px;
    border: 1px #ddd solid;
    font-size: 12px;
  }
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
