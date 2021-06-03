import { ContainerSpirit } from "@/spirit/container-spirit";
import { ISpiritConfig, ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from '../index';
import { throttle } from '../utils/common';
import { Base } from "./base";
let uid = 0
export class BaseSpirit extends Base {
  uid = uid++
  sort = 0
  subSort = 0
  type: SpiritType = 'relative'
  config: ISpiritConfig = {
    width: '100%',
    height: '100px',
    mode: 'flex',
    left: 0,
    top: 0,
    position: 'relative',
  }
  background = ''
  private _active = false
  resizableEl = document.createElement('div')
  private _parentSpirit: ContainerSpirit
  line = 0
  
  get parentSpirit () {
    return this._parentSpirit
  }
  set parentSpirit (s: ContainerSpirit) {
    this._parentSpirit = s
    s ? this.el.setAttribute('data-parent-type', s.type) : this.el.removeAttribute('data-parent-uid')
  }


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

  get centerLineX () {
    return (this.clientWidth / 2) + this.config.left
  }

  get centerLineY () {
    return (this.clientHeight / 2) + this.config.top
  }

  get style () {
    const { width, height, top, left } = this.config
    return `
      width: ${width};
      height: ${height};
      transform: translate(${left}px, ${top}px);
      background: ${this.background};
    `
  }

  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(dragLayout)
    this.config = {
      ...this.config,
      ...option,
    }
    this.el.innerHTML = this.uid + ''
    this.initResizableEl()
    this.updateStyle()
    this.el.className = 'drag_spirit'
    this.el.setAttribute('data-uid', String(this.uid))
    this.background = `RGBA(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())})`
  }

  initResizableEl () {
    this.resizableEl.className = 'drag_layout_resizable'
    this.resizableEl.innerHTML = `
      <span class="drag_layout_resizable_s" data-resizable="s"></span>
      <span class="drag_layout_resizable_e" data-resizable="e"></span>
      <span class="drag_layout_resizable_se" data-resizable="se"></span>
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
      if (type === 's' || type === 'se') {
        this.config.height = `${h}px`
      }
      if (type === 'se' || type === 'e') {
        this.config.width = `${w}px`
      }
      this.updateStyle()
      this.dragLayout.updateAllStyle()
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
    const onmousemove = throttle((ev: MouseEvent) => {
      const clientX = ev.clientX
      const clientY = ev.clientY
      let l = clientX - disX
      let t = clientY - disY + this.panel.wheelDeltaY
      this.screen.copySpirit.config.top = t
      this.screen.copySpirit.config.left = l
      this.screen.copySpirit.updateStyle()
      this.screen.checkNewSort(this)
    }, 20)
    const clear = () => {
      this.screen.removeCopySpirit()
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
      if (this.parentSpirit.type === 'container') {
        // this.config.width = '100%'
      }
      this.parentSpirit = undefined
      this.config.left = 0
      this.dragLayout.updateAllStyle()
    }
  }

  addParentSpirit (spirit: ContainerSpirit) {
    this.parentSpirit = spirit
    this.subSort = spirit.childrens.length
    // this.followParentStyle()
    spirit.childrens.push(this)
    this.dragLayout.updateAllStyle()
  }

  destroy () {
    this.el.remove();
  }
}
