import { ISpiritConfig, ISpiritParams } from "@/types/config";
import { DragLayout } from '../index';
let uid = 0
export class BaseSpirit {
  uid = uid++
  sort = 0
  config:ISpiritConfig = {
    width: '100%',
    height: '100px',
    mode: 'flex',
    left: 0,
    top: 0,
    position: 'relative'
  }
  el: HTMLDivElement = document.createElement('div')
  childrens: BaseSpirit
  background = ''
  _active = false
  resizableEl = document.createElement('div')


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

  constructor (option: Partial<ISpiritParams> = {}, private dragLayout: DragLayout) {
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
      <span class="drag_layout_resizable_bottom" />
    `
    this.el.appendChild(this.resizableEl)
  }

  updateStyle () {
    this.el.setAttribute('style', this.style)
  }

  handleMousedown (e: MouseEvent) {
    console.log(e)
  }

  destroy () {
    this.el.remove();
  }
}
