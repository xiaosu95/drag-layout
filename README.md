# 使用指南
## 安装
```sh
npm install -D drag-layout
# OR yarn add -D drag-layout
```
## 初始化
```html
<template>
  <div class="boxEle"></div>
</template>
```

```typescript
import { DragLayout } from "drag-layout";

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
  infoDataBridge: (config: IOuputConfig) => {
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

------

## API
## dragLayout实例
### 创建实例
```typescript
import { DragLayout } from 'drag-layout'
const dragLayout = new DragLayout(Ele, option)
```
- `Ele`: 初始化的容器
- `option`: 初始化参数
#### 初始化实例Option声明
- `infoDataBridge`: 获取容器配置时的hook，可以进行二次加工数据
- `screenWidth`: 屏幕宽度
- `firstScreenHeight`: 首屏高度
- `threshold`: 拖拽容器切换位置时触发的阈值(px)
- `adsorption`: 是否开启容器吸附功能
- `adsorptionThreshold`: 容器吸附的触发阈值(px)
- `handleResize`: 注册resize容器事件监听
- `handleMoved`: 注册容器移动事件监听
- `handleDrop`: 注册拖拽元素到屏幕时的事件监听，用于添加新容器
```typescript
interface IOption {
  firstScreenHeight?: number;
  threshold?: boolean;
  adsorption?: boolean;
  adsorptionThreshold?: number;
  screenWidth: number;
  infoDataBridge?: (ouputConfig: IOuputConfig) => any;
  handleResize?: (spirit: Spirit, ouputConfig: IOuputConfig) => void;
  handleMoved?: (spirit: Spirit, ouputConfig: IOuputConfig) => void;
  handleDrop?: (event: DragEvent, offset: {
    x: number;
    y: number;
  }) => void;
}
```
:::tip
 [ouputConfig的声明](#ouputconfig)
:::

### addSpirit
> 添加容器到屏幕内
```typescript
dragLayout.addSpirit(option)
```
#### Option
- `width`: 容器宽度
- `height`: 容器高度
- `type`: 容器类型
- `render`: 需要放置到容器内的元素或render方法
- `resizable`: 是否允许调整大小
- `left`: 容器的位置left
- `top`: 容器的位置top
- `right`: 容器的位置right
- `bottom`: 容器的位置bottom
- `handleResize`: 容器调整大小的事件监听
- `ext`: 容器输出配置时需要透传的数据
- `children`: 子容器
#### addSpirit的Option声明
```typescript
export interface ISpiritParams {
  width: string | number;
  height: string | number;
  type?: SpiritType;
  render: Element | (() => any);
  resizable?: boolean;
  left: number;
  top: number;
  right: number;
  bottom: number;
  handleResize: (ouput: IOuputConfig) => void;
  ext: any;
  children?: ISpiritParams[];
}
```

### setEditMode
- 类型: (mode: EditMode) => void
- 详细: <br>
  设置屏幕编辑模式，首屏或全屏<br>
  `首屏编辑模式`: 会显示容器类型为`FIXED`的容器，并且其拖拽的范围会限制一个屏幕的高度，超出首屏的部分会遮罩盖住<br>
  `全屏编辑模式`: 会隐藏容器类型为`FIXED`的容器，其它编辑正常
- 示例:
```typescript
import { EditMode } from 'drag-layout'
dragLayout.setEditMode(EditMode.DEFAULT)
```
:::tip
用到的枚举: [EditMode](#editmode)
:::

### setAdsorption
- 类型: (bool: boolean) => void
- 详情: <br>
  设置是否开启吸附模式<br>
  > 吸附仅对容器类型为`FIXED`和`ABSOLUTE`生效
- 示例:
```typescript
dragLayout.setAdsorption(true)
```

### getSpirit
- 类型: (uid: number | { x: number, y: number }) => spirit: Spirit
- 详情: <br>
  传入容器的uid或坐标获取匹配的容器
- 示例:
```typescript
const spirit = dragLayout.getSpirit(1)
const spirit = dragLayout.getSpirit({
  x: 100,
  y: 100
})
```

### updateAllStyle
- 类型: () => void
- 详情:<br>
  更新所有容器的状态，可以修改多个容器的位置或大小后，调用该方法更新屏幕render
- 示例:
```typescript
dragLayout.updateAllStyle()
```

### getInfo
- 类型: <T = IOuputConfig>() => T[]
- 详情: <br>
  获取所有容器的信息，不配置`infoDataBridge`的情况下默认返回容器的`ouputConfig`列表,配置`infoDataBridge`之后会返回处理过`ouputConfig`之后的值
- 示例:
```typescript
dragLayout.getInfo()
```

### loadSpirits
- 类型: (list: ISpiritParams) => void
- 详情:<br>
  通过配置列表批量加载容器，通常用于初始化工程
- 示例:
```typescript
draglayout.loadSpirits(list)
```

### switchScrrenMode
- 类型: (type: ScrrenType) => void
- 详情:<br>
  切换屏幕容器的布局模式，有flow和block两种模式，具体功能和对应容器一致
- 示例:
```typescript
draglayout.switchScrrenMode(type)
```
:::tip
用到的枚举: [ScrrenType](#scrrentype)
:::

:::tip
[ISpiritParams声明](#ispiritparams)
:::

## spirit实例方法
### setResizable
- 类型: (bool: boolean) => void
- 详情:<br>
  设置是否可以调整容器大小
- 示例
```typescript
spirit.setResizable(true)
```

### updateStyle
- 类型: () => void
- 详情:<br>
  更新容器配置
- 示例:
```typescript
spirit.config.height = 100
spirit.updateStyle()
```

## spirit实例属性
### ouputConfig
- 类型: IOuputConfig
- 详情:<br>
  获取容器的相关属性
- 属性:
>- `width`: number 宽度
>- `height`: number 高度
>- `left`: number 相对屏幕左边界的距离
>- `top`: number相对屏幕上边界的距离
>- `right`: number 相对屏幕右边界的距离
>- `bottom`: number相对屏幕下边界的距离
>- `type`: SpiritType 容器类型
>- `resizable`: boolean 容器是否可以调整大小
>- `ext`: any 透传的属性
>- `percentagePosition`: { top：number, right: number, left: number, bottom: number } 百分比的位置信息
- 示例:
```typescript
console.log(spirit.ouputConfig)
```



## 全局导出枚举
### EditMode
- 详情: 屏幕编辑模式
- 值:
>- `DEFAULT`: 全屏编辑模式
>- `FIXED`: 首屏编辑模式
- 示例:
```typescript
// 定义
enum SpiritType {
  DEFAULT = 0,
  FIXED = 1,
}
```
```typescript
// 使用
import { EditMode } from 'drag-layout'
```

### ScrrenType
- 详情: 屏幕容器模式
- 值:
>- `FLOW_CONTAINER`: FLOW基础容器
>- `BLOCK_CONTAINER`: BLOCK基础容器
- 示例:
```typescript
// 定义
enum ScrrenType {
  FLOW_CONTAINER = 5,
  BLOCK_CONTAINER = 6,
}
```
```typescript
// 使用
import { ScrrenType } from 'drag-layout'
```

### SpiritType
- 详情: 容器类型枚举
- 值:
> - `DEFAULT`: 默认自上而下布局
> - `ABSOLUTE`: 基于整个页面的定位布局，可以自由拖拽，不会受到其它容器影响
> - `FIXED`: 基于首屏定位，可以自由拖拽，不会受到其它容器影响
> - `FLEX_CONTAINER`: 布局属于`DEFAULT`，可以包含其它`DEFAULT`容器的父级容器，容器内部的布局方式为flex模式，子容器会均分父容器宽度
> - `BLOCK_CONTAINER`: 布局属于`DEFAULT`，可以包含其它`DEFAULT`容器的父级容器，容器内部的布局方式为block模式，每个子容器占用单行
> - `FLOW_CONTAINER`: 布局属于`DEFAULT`，可以包含其它`DEFAULT`容器的父级容器，容器内部的布局方式为flex模式，子容器可以自由放置到父容器内，布局规则是自上而下
> - `INLINE_CONTAINER`: 布局属于`DEFAULT`，可以包含其它`DEFAULT`容器的父级容器，容器内部的布局方式会把子容器变为inline-block的状态，由左向右自上而下排序
- 示例:
```typescript
// 定义
enum SpiritType {
  DEFAULT = 0,
  ABSOLUTE = 1,
  FIXED = 2,
  FLEX_CONTAINER = 3,
  INLINE_CONTAINER = 4,
  FLOW_CONTAINER = 5,
  BLOCK_CONTAINER = 6,
}
```
```typescript
// 使用
import { SpiritType } from 'drag-layout'
```