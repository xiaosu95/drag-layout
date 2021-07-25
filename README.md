# 使用指南
## 安装
```sh
npm install -D drag-layout
```
## 文档
[查看文档](https://doc.suyuanli.cn/drag-layout/)
## 示例
[基础集成示例](https://www.suyuanli.cn/example/drag-layout)
## 初始化
```html
<template>
  <div class="boxEle"></div>
</template>
```

```typescript
import { DragLayout, ScrrenType } from "drag-layout";

const boxEle = document.querySelector('.boxEle')
const dragLayout = new DragLayout(boxEle, {
  screenWidth: 375,
  firstScreenHeight: 1000,
  threshold: 40,
  adsorption: true,
  adsorptionThreshold: 20,
  handleResize(spirit, ouputConfig) {
    // 容器调整大小监听
  },
  handleMoved(spirit, ouputConfig) {
    // 容器移动监听
  },
  handleDrop(event, offset) {
    // 屏幕的原生ondrop事件监听
    // 可以通过该事件进行添加容器
  },
  scrrenType: ScrrenType.BLOCK_CONTAINER,
})
```
::: tip
通过`DragLayout`创建实例，绑定到`.boxEle`的dom进行初始化面板。<br>
通过config配置屏幕的模式和其它功能
:::

## 添加容器到屏幕
- 描述: 将已有的dom元素添加到屏幕内，可选定容器的类型
- 示例:
```typescript
import { SpiritType } from 'drag-layout'
const ele = document.createElement('div')
ele.height = '100%'
ele.style.background = '#f00'
dragLayout.addSpirit({
  resizable: false,
  type: SpiritType.DEFAULT,
  height: 200,
  render: ele,
  left: 0,
  top: 0
});
```
:::tip
上述代码将会再屏幕顶端添加一个高度为200px的红色容器
:::

## 结合html拖拽属性添加容器
- 描述: 通过`draggable`给组件列表添加拖拽属性，再通过初始化实例时注册的`handleDrop`事件添加到屏幕中
- 实现思路:<br>
>- 给组件列表添加`draggable`属性
>- 通过自定义属性给组件添加组件类型标识
>- 通过`dragstart`事件给拖拽事件透传组件类型
>- 监听`handleDrop`事件，获取`dragstart`透传的组件类型和拖拽的坐标
>- 根据组件类型和坐标将新的容器添加到目标位置
- 示例:
```html
<div class="boxEle"></div>
<div
  draggable="true"
  data-component-type="banner"
  ondragstart="handleDragstart"
>
  我是一个banner组件
</div>
```
```typescript
import { SpiritType, DragLayout } from 'drag-layout'
const boxEle = document.querySelector('.boxEle')
// 通过ondragstart透传需要创建的组件类型
function handleDragstart (event: DragEvent) {
  event.dataTransfer.setData(
    "type",
    (event.target as any).getAttribute("data-component-type")
  );
}

const dragLayout = new DragLayout(boxEle, {
  screenWidth: 375,
  firstScreenHeight: 1000,
  threshold: 40,
  adsorption: true,
  adsorptionThreshold: 20,
  handleResize(spirit, ouputConfig) {
    // 容器调整大小监听
  },
  handleMoved(spirit, ouputConfig) {
    // 容器移动监听
  },
  handleDrop(event, offset) {
    // 屏幕的原生ondrop事件监听
    const type = event.dataTransfer.getData("type");
    switch (type) {
      const bannerEl = document.createElement('div')
      // ...bannerEl的一系列封装
      case "banner": {
        dragLayout.addSpirit({
          left: offset.x,
          top: offset.y,
          height: 300,
          render: bannerEl
        });
        break;
      }
    }
  },
})
```

## 获取所有配置信息
- 描述: 获取所有配置信息，包括所有容器的配置和屏幕相关配置，可以用于保存到服务端用以下次恢复
- 示例:
```typescript
const info = dragLayout.getInfo()
console.log(info)
```

## 使用infoDataBridge对配置做处理
- 描述: 考虑到实际应用场景下数据结构比较复杂，可以通过配置`infoDataBridge`对数据进行预处理，`infoDataBridge`方法会传入容器的配置参数
- 示例:
```typescript
new DragLayout(boxEle, {
  screenWidth: 375,
  infoDataBridge: (config: IOuputSpiritConfig) => {
    const _config = { ...config }
    _config.width *= 10
    _config.height *= 10
    return _config
  }
})
```
:::tip
上述例子将会将所有容器的宽高*10后输出
:::


## 获取选中容器的配置信息
- 描述: 通过容器的实例获取其当前的配置信息
- 示例:
```typescript
const spirit = dragLayout.addSpirit({
  left: 10,
  top: 10,
  height: 300,
  render: el
});
console.log(spirit.ouputConfig)
```

## 载入配置
- 描述: 屏幕相关的全局配置通过实例化`DragLayout`时注入，而容器可以通`loadSpirits`方法批量导入
- 示例:
```html
<div class=".boxEle"></div>
```
```typescript 
import { DragLayout } from 'drag-layout'
const config = {
  ...
} // 服务端拿到的配置文件
const dragLayout = new DragLayout(boxEle, {
  screenWidth: config.screenWidth,
  firstScreenHeight: config.firstScreenHeight,
  threshold: config.threshold,
  adsorption: config.adsorption,
  adsorptionThreshold: config.adsorptionThreshold,
  handleResize(spirit, ouputConfig) {
    // 容器调整大小监听
  },
  handleMoved(spirit, ouputConfig) {
    // 容器移动监听
  },
  handleDrop(event, offset) {
    // 屏幕的原生ondrop事件监听
    // 可以通过该事件进行添加容器
  },
})
dragLayout.loadSpirits(config.list)
```

## 设置屏幕缩放比例
- 描述: 通过设置屏幕的缩放比例可以更好显示不同屏幕尺寸下的内容
- 示例:
```typescript
dragLayout.setScale(0.7)
```
