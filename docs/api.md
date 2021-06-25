# API
## 创建实例
```typescript
const dragLayout = new DragLayout(Ele, option)
```
- `Ele`: 初始化的容器
- `option`: 初始化参数
### 初始化实例Option声明
- `screenWidth`: 屏幕宽度
- `handleResize`: 注册resize容器事件监听
- `handleMoved`: 注册容器移动事件监听
- `handleDrop`: 注册拖拽元素到屏幕时的事件监听，用于添加新容器
```typescript
interface IOption {
  screenWidth: number;
  handleResize: (spirit: Spirit, ouputConfig: IOuputConfig) => void;
  handleMoved: (spirit: Spirit, ouputConfig: IOuputConfig) => void;
  handleDrop: (event: DragEvent, offset: {
    x: number;
    y: number;
  }) => void;
}
```

## addSpirit
> 添加容器到屏幕内
```typescript
dragLayout.addSpirit(option)
```
### Option
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
### addSpirit的Option声明
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

## 容器类型
### SpiritType枚举
```typescript
import { SpiritType } from 'Draglayout'
SpiritType.DEFAULT // 0
SpiritType.ABSOLUTE // 1
SpiritType.FIXED // 2
SpiritType.FLEX_CONTAINER // 3
SpiritType.INLINE_CONTAINER // 4
```
- `DEFAULT`: 默认自上而下布局
- `ABSOLUTE`: 基于整个页面的定位布局，可以自由拖拽，不会受到其它容器影响
- `FIXED`: 基于首屏定位，可以自由拖拽，不会受到其它容器影响
- `FLEX_CONTAINER`: 布局属于`DEFAULT`，可以包含其它`DEFAULT`容器的父级容器，容器内部的布局方式为flex模式，子容器会均分父容器宽度
- `INLINE_CONTAINER`: 布局属于`DEFAULT`，可以包含其它`DEFAULT`容器的父级容器，容器内部的布局方式会把子容器变为inline-block的状态，由左向右自上而下排序

