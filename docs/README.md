# 使用指南
## 初始化
```html
<template>
  <div class="boxEle"></div>
</template>
```

```javascript
import { DragLayout } from "dragLayout";

const boxEle = document.querySelector('.boxEle')
const dragLayout = new DragLayout(boxEle, {
  screenWidth: 375,
  handleResize(spirit, ouputConfig) {
    // ...
  },
  handleMoved(spirit, ouputConfig) {
    // ...
  },
  handleDrop(event, offset) {
    // ...
  },
})
```
> 通过DragLayout创建实例，