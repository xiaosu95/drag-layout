# API
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
- `scrrenType`: 屏幕基础容器模式，可以为`block`和`flow`两种
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
  scrrenType?:ScrrenType;
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