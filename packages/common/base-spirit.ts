import { ContainerSpirit } from "@/spirit/container-spirit";
import { ISpiritConfig, ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from '../index';
let uid = 0
export class BaseSpirit {
  uid = uid++
  sort = 0
  type: SpiritType = 'relative'
  config: ISpiritConfig = {
    width: '100%',
    height: '100px',
    mode: 'flex',
    left: 0,
    top: 0,
    position: 'relative',
  }
  el: HTMLDivElement = document.createElement('div')
  background = ''
  _active = false
  resizableEl = document.createElement('div')
  parentSpirit: ContainerSpirit


  get active () {
    return this._active
  }

  set active (bool: boolean) {
    this._active = bool
    this.el.setAttribute('data-active', String(bool))
  }

  get bottomPosition () {
    return this.config.top + this.el.clientHeight
  }

  get rightPosition () {
    return this.config.left + this.el.clientWidth
  }

  get clientHeight () {
    return this.el.clientHeight
  }

  get clientWidth () {
    return this.el.clientWidth
  }

  get screen () {
    return this.dragLayout.scrren
  }

  get panel () {
    return this.dragLayout.panel
  }

  get centerLineX () {
    return (this.clientWidth / 2) + this.config.left
  }

  get centerLineY () {
    return (this.clientHeight / 2) + this.config.top
  }

  get style () {
    if (!this.background) {
      this.background = `RGBA(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())})`
    }
    const { width, height, top, left } = this.config
    return `
      width: ${width};
      height: ${height};
      left: 0;
      top: 0;
      position: absolute;
      transform: translate(${left}px, ${top}px);
      background: ${this.background}
    `
  }

  constructor (option: Partial<ISpiritParams> = {}, public dragLayout: DragLayout) {
    this.config = {
      ...this.config,
      ...option,
    }
    this.el.innerHTML = this.uid + ''
    this.initResizableEl()
    this.updateStyle()
    this.el.className = 'drag_spirit'
    this.el.setAttribute('data-uid', String(this.uid))
  }

  initResizableEl () {
    this.resizableEl.className = 'drag_layout_resizable'
    this.resizableEl.innerHTML = `
      <span class="drag_layout_resizable_bottom" data-resizable="bottom" />
      <span class="drag_layout_resizable_right" data-resizable="right" />
      <span class="drag_layout_resizable_right" data-resizable="corner" />
    `
    this.el.appendChild(this.resizableEl)
  }

  updateStyle () {
    this.el.setAttribute('style', this.style)
  }
  handleResizable (event: MouseEvent) {
    const target = event.target as HTMLSpanElement
    const type = target.getAttribute('data-resizable')
    const disX = event.clientX - this.clientWidth
    const disY = event.clientY - this.clientHeight
    const maxW = this.screen.clientWidth - this.config.left
    document.onmousemove = (ev: MouseEvent) => {
      const clientX = ev.clientX
      const clientY = ev.clientY
      let w = clientX - disX
      let h = clientY - disY
      if (h < 30 ) h = 30
      if (w < 30 ) w = 30
      else if (w > maxW) {
        w = maxW
      }
      if (type === 'bottom' || type === 'corner') {
        this.config.height = `${h}px`
      }
      if (type === 'corner' || type === 'right') {
        this.config.width = `${w}px`
      }
      this.updateStyle()
      this.dragLayout.resetPosition()
    }
    document.onmouseup = () => {
      document.onmouseup = document.onmousemove = null
    }
  }

  handleMousedown (event: MouseEvent) {
    if ((event.target as any).getAttribute('data-resizable')) {
      this.handleResizable(event)
      return
    }

    const disX = event.clientX - this.config.left
    const disY = event.clientY - this.config.top
    this.screen.createCopySpirit(this)
    this.active = true
    const onmousemove = (ev: MouseEvent) => {
      const clientX = ev.clientX
      const clientY = ev.clientY
      let l = clientX - disX
      let t = clientY - disY + this.panel.wheelDeltaY
      this.screen.copySpirit.config.top = t
      this.screen.copySpirit.config.left = l
      this.screen.copySpirit.updateStyle()
      this.screen.checkNewSort(this)
    }
    const clear = () => {
      this.screen.removeCopySpirit()
      this.active = false
      document.removeEventListener('mousemove', onmousemove)
      document.removeEventListener('mouseup', clear)
    }
    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', clear)
  }

  removeParentSpirit () {
    if (this.parentSpirit) {
      const idx = this.parentSpirit.childrens.findIndex(ele => ele === this)
      if (idx !== -1) {
        this.parentSpirit.childrens.splice(idx, 1)
      }
    }
    this.parentSpirit = undefined
  }

  addParentSpirit (spirit: ContainerSpirit) {
    this.parentSpirit = spirit
    spirit.childrens.push(this)
    this.sort = spirit.childrens.length
  }

  followParentPosition () {
    if (this.parentSpirit) {
      const { config: {left, top}, clientHeight, clientWidth } = this.parentSpirit
      const prev = this.parentSpirit.childrens[this.sort - 1]
      const needNewline = !prev || prev.rightPosition + this.clientWidth > clientWidth
      this.config.left = needNewline ? left : prev.rightPosition
      // this.config.top = prev ? needNewline ? prev.bottomPosition :  : left + prev.config.left
    }
  }

  destroy () {
    this.el.remove();
  }
}
