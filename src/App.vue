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
          <el-divider content-position="left">设置</el-divider>
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
          <el-divider content-position="left">容器库</el-divider>
          <div class="containers_box">
            <div class="containers">
              <div
                draggable="true"
                data-component-type="flex-container"
                @dragstart="handleDragstart"
              >
                flex容器
              </div>
              <div
                draggable="true"
                data-component-type="inline-container"
                @dragstart="handleDragstart"
              >
                inline容器
              </div>
              <div
                draggable="true"
                data-component-type="flow-container"
                @dragstart="handleDragstart"
              >
                flow容器
              </div>
              <div
                draggable="true"
                data-component-type="block-container"
                @dragstart="handleDragstart"
              >
                block容器
              </div>
            </div>
          </div>
          <el-divider content-position="left">组件库</el-divider>
          <div class="components_box">
            <div class="components">
              <div
                draggable="true"
                data-component-type="banner"
                @dragstart="handleDragstart"
              >
                banner组件
              </div>
              <div
                draggable="true"
                data-component-type="calendar"
                @dragstart="handleDragstart"
              >
                日历组件
              </div>
              <div
                draggable="true"
                data-component-type="table"
                @dragstart="handleDragstart"
              >
                表格组件
              </div>
              <div
                draggable="true"
                data-component-type="tabs"
                @dragstart="handleDragstart"
              >
                tabs组件
              </div>
              <div
                draggable="true"
                data-component-type="backtop"
                @dragstart="handleDragstart"
              >
                backtop组件
              </div>
            </div>
          </div>
          <el-divider content-position="left">其它操作</el-divider>
          <el-button @click="getInfo" size="mini">获取配置</el-button>
          <el-divider content-position="left">屏幕模式</el-divider>
          <div>
            <el-radio-group
              v-model="scrrenType"
              size="mini"
              @change="switchScrrenMode"
            >
              <el-radio-button label="5">FLOW</el-radio-button>
              <el-radio-button label="6">BLOCK</el-radio-button>
            </el-radio-group>
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
import Tabs from "./components/test/tabs/index.vue";
import { ScrrenType, SpiritType } from "@/enums";
@Component
export default class App extends Vue {
  editMode = "default";
  adsorption = true;
  dragLayout: DragLayout;
  scrrenType = ScrrenType.BLOCK_CONTAINER;
  mounted() {
    this.dragLayout = new DragLayout(this.$refs.boxEle as HTMLDivElement, {
      screenWidth: 1280,
      // handleResize(a, b) {
      //   // console.log("handleResize", a, b);
      // },
      // handleMoved(a, b): void {
      //   // console.log("handleMoved", a, b);
      // },
      handleDrop: (event, offset): void => {
        const type = event.dataTransfer.getData("type");
        switch (type) {
          case "banner": {
            const $banner = new Banner({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              left: offset.x,
              top: offset.y,
              height: 200,
              width: 100,
              render: $banner.$el
            });
            break;
          }
          case "calendar": {
            const $calendar = new Calendar({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              left: offset.x,
              top: offset.y,
              height: 400,
              render: $calendar.$el
            });
            break;
          }
          case "table": {
            const $testTable = new TestTable({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              left: offset.x,
              top: offset.y,
              height: 300,
              render: $testTable.$el
            });
            break;
          }
          case "backtop": {
            const $backtop = new Backtop({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              resizable: false,
              type: SpiritType.FIXED,
              height: 50,
              width: 50,
              render: $backtop.$el,
              left: offset.x - 25,
              top: offset.y - 25
              // right: 100,
              // bottom: 100
            });
            break;
          }
          case "tabs": {
            const $tabs = new Tabs({
              el: document.createElement("div")
            });
            this.dragLayout.addSpirit({
              resizable: false,
              type: SpiritType.DEFAULT,
              height: 200,
              render: $tabs.$el,
              left: offset.x,
              top: offset.y
            });
            break;
          }
          case "flex-container": {
            this.dragLayout.addSpirit({
              resizable: true,
              type: SpiritType.FLEX_CONTAINER,
              height: 100,
              left: offset.x,
              top: offset.y
            });
            break;
          }
          case "inline-container": {
            this.dragLayout.addSpirit({
              resizable: true,
              type: SpiritType.INLINE_CONTAINER,
              height: 150,
              left: offset.x,
              top: offset.y
            });
            break;
          }
          case "flow-container": {
            this.dragLayout.addSpirit({
              resizable: true,
              type: SpiritType.FLOW_CONTAINER,
              height: 150,
              left: offset.x,
              top: offset.y
            });
            break;
          }
          case "block-container": {
            this.dragLayout.addSpirit({
              resizable: true,
              type: SpiritType.BLOCK_CONTAINER,
              height: 150,
              left: offset.x,
              top: offset.y
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
    //   type: SpiritType.INLINE_CONTAINER
    // });
    // this.dragLayout.addSpirit({
    //   height: "100px"
    // });
    // this.dragLayout.addSpirit({
    //   height: "150px",
    //   type: SpiritType.FLEX_CONTAINER,
    //   handleResize(ouput) {
    //     console.log(2342423, ouput);
    //   }
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
    console.log(event);
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

  getInfo() {
    console.log(this.dragLayout.getInfo());
  }

  switchScrrenMode(val: any) {
    this.dragLayout.switchScrrenMode(Number(val));
  }
}
</script>

<style lang="less">
@media (-webkit-max-device-pixel-ratio: 1) {
  /*美化滚动条*/
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #aaa;
    background-clip: padding-box;
    min-height: 28px;
    border-radius: 4px;
    &:hover {
      background-color: #999;
    }
  }
}
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
.containers_box {
  height: 220px;
  overflow: auto;
}
.components_box {
  height: calc(100% - 520px);
  overflow: auto;
}
.components,
.containers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  div {
    width: 120px;
    height: 100px;
    border: 1px #ddd solid;
    font-size: 12px;
    margin-bottom: 10px;
    line-height: 100px;
    text-align: center;
    background: #eee;
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
