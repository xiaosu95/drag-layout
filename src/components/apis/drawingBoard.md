## API(暂未写完)
#### SDK功能描述
- 该插件目前实现的功能块有图片、多种几何图形、自由画笔、视频、文本、视频、背景样式、取色器
- 插件实现了各精灵元素的拖动、旋转、缩放；可以通过复选框选中多个精灵进行集体缩放旋转
- 插件对拖动精灵时，无需重新渲染的图层进行合并优化，减少图层的重绘。
- 线条绘制后会转为图片以优化性能，缩放线条时再通过数据进行缩放重新绘制线条。

### <font style="background:#ccc;padding:5px 10px;">▲初始化画板:</font>
```javascript
const drawingBoard = new DrawingBoard(params);
```
#### 初始化参数params
|字段名|类型|描述|是否必填
|----|----|----|----|
|box|HTMLDivElement|初始化容器|true|
|option|Option|可选参数|false|
#### 可选参数Option
|字段名|类型|描述|
|----|----|----|
|bgOption|bgOption|背景配置|
|--bgColor|string|背景色|
|--bgPic|string|背景图|
|--pixelSize|number|像素格大小|
|--picMode|(0,1,2)|背景图模式|
|bgType|(0,1,2,3)|背景模式|
|mode|('cascade','autoHierarchy')|画板操作模式|
|mouseMode|('none', 'pen', 'text', 'rubber', 'geometry', 'colorPicker')|画笔模式|
|geometryOption|GeometryOption|几何模式下的初始参数|
|textOption|TextParams|文本模式下初始参数|
### 实例属性:
- background: 控制画板背景的对象
- dom: 控制画板dom的对象
- targetSpirit: 当前选中的精灵
- spirits: 画板内所有精灵

----

### <font style="background:#ccc;padding:5px 10px;">▲background的Methods:</font>
##### background.setBgModel(type):void
设置画板模式type:
|type|描述|
|----|----|
|0|背景为纯色|
|1|背景为图片|
|2|无背景图|
|3|像素格|

##### background.setBaseColor(color):void
- 设置背景色color值类型hex / rgba,支持透明背景
- 例如#f00,rgba(255,0,0,0.5)

##### background.changeBgPic(pic):void
设置画板模式pic:
|pic类型|描述|
|----|----|
|url|图片url|
|image|图片dom|
example:
```javascript
self.background.changeBgPic('https://pic.png')
const img = document.createElement('img')
img.src = 'https://pic.png'
self.background.changeBgPic(img)
```

----

### <font style="background:#ccc;padding:5px 10px;">▲dom的Methods:</font>
##### dom.exportPic():Promise
以Promise方式导出画板图片的blob。
example:
```javascript
// 下载导出的画板图片
self.dom.exportPic().then(res => {
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(res);
  const filename = "pic.png";
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
})
```

----

### <font style="background:#ccc;padding:5px 10px;">▲实例Methods:</font>
##### self.painting():void
刷新画板，重新绘制精灵

##### self.setMouseMode(mode):void
设置鼠标模式
|mode值|描述|
|----|----|
|none|无操作，可以选中画板内的精灵|
|pen|画笔模式|
|text|文本模式|
|geometry|几何模式|
|colorPicker|颜色选择器|
example:
```javascript
// 切换为画板模式
self.setMouseMode("pen");
```

##### self.setBaseColor(color):void
- 设置画板所有的颜色color值类型hex / rgba,支持透明背景
- 例如#f00,rgba(255,0,0,0.5)
example:
```javascript
// 切换所有颜色为半透明红色和红色
self.setBaseColor("rgba(255,0,0,.5)");
self.setBaseColor("#f00");
```

##### self.addPhotoSpirit(url):void
添加图片精灵
example:
```javascript
// 切换所有颜色为半透明红色
self.addPhotoSpirit('https://pic.png');
```

##### self.addVideoSpirit(url):void
添加视频精灵
example:
```javascript
// 切换所有颜色为半透明红色
self.addVideoSpirit('https://video.mp4');
```

##### self.addRectSpirit(mode: string, params: Object):void
添加矩形精灵
|mode值|描述|
|----|----|
|fill|填充模式|
|stroke|非填充模式|
params参数值
|字段名|类型|描述|
|----|----|----|
|color|矩形颜色|

##### self.addRectSpirit(mode: string, params: Object):void
添加矩形精灵
|mode值|描述|
|----|----|
|fill|填充模式|
|stroke|非填充模式|
params参数值
|字段名|类型|描述|
|----|----|----|
|color|hex / rgba|矩形颜色|
|natural_w|number|宽度|
|natural_h|number|高度|
|x|number|X坐标|
|y|number|Y坐标|
|rotate|number|旋转角度，x轴正半轴|
|hierarchy|number|层级|
|scaleX|number|宽度的缩放比例|
|scaleY|number|高度的缩放比例|

##### self.removeSpirit(id):void
- 移除对应id的精灵

##### self.getSpirit(id):Spirit
- 获得对应id的精灵对象

##### self.on(onEvent: string, func: Function):void
- onEvent：监听的事件
- func: 触发的方法
- 可以监听的事件列表:

|eventName|描述|
|----|----|
|onSpiritLoad|精灵加载事件|
|onDrawingBoardLoad|画板加载资源事件|
|onMousedown|鼠标按下事件|
|onMousemove|鼠标移动事件|
|onMouseup|鼠标松开事件|
|onDblclick|双击事件|
|onColorPickerSelect|选中颜色选择器|

##### self.unbind(onEvent: string, func: Function):void
- onEvent：监听的事件
- func: 移除的方法（不写则移除所有监听的方法）

##### self.setHandleMode(mode): void
设置画笔操作模式
|mode|描述|
|----|----|
|cascade|固定层级|
|autoHierarchy|自动计算层级|

##### self.setHandleMode(mode): void
设置画笔操作模式
|mode|描述|
|----|----|
|cascade|固定层级|
|autoHierarchy|自动计算层级|

----

### <font style="background:#ccc;padding:5px 10px;">▲targetSpirit的Methods:</font>
##### targetSpirit.removeSelf():void
- 移除自己

----

### <font style="background:#ccc;padding:5px 10px;">▲targetSpirit的Property:</font>
##### 1.targetSpirit.params: SpiritBaseParams | GeometrySpristParams | PhotoSpristParams | PolygonSpiritParmas
- 下面是精灵参数的类型声明:

``` javascript
/** 精灵绘制参数 */
interface SpiritBaseParams {
  /** 真实宽度 */
  natural_w?: number
  /** 真实高度 */
  natural_h?: number
  x?: number
  y?: number
  /** 旋转角度，x轴正半轴 */
  rotate?: number
  /** 层级 */
  hierarchy?: number
  scaleX?: number
  scaleY?: number
  display?: display
  id?: number
  name?: string
}
/** 几何图形精灵参数 */
interface GeometrySpristParams extends SpiritBaseParams {
  color?: string
  mode?: Spirit.GeometryMode
}
/** 图片精灵参数 */
interface PhotoSpristParams extends SpiritBaseParams {
  img: HTMLImageElement
}
/** 多边形精灵参数 */
interface PolygonSpiritParmas extends GeometrySpristParams {
  edgeNum?: number
}
```