import { IScreenConfig } from "@/types/config";
import { CopySpirit } from "@/spirit/copy-spirit";
import { DragLayout } from "..";
import { BaseSpirit } from "./base-spirit";
import { getSpiritDom } from "@/utils/common";

export class Screen {
  threshold = 40
  el = document.createElement('div')
  config: IScreenConfig = {
    width: '375px',
    height: '100%',
    boxEle: null,
    left: 0,
    top: 0,
  }
  copySpirit: BaseSpirit | undefined = undefined
  wheelDeltaY = 0 // 滚动y值

  get style () {
    const { width, height, left, top } = this.config
    return `
      width: ${width};
      height: ${this.screenHeight ? `${this.screenHeight}px` : height};
      transform: translate(${left}px, ${top}px);
    `
  }

  get relativeSpirits () {
    return this.dragLayout.relativeSpirits
  }

  get screenHeight () {
    return this.relativeSpirits.reduce((a, b) => a + b.clientHeight, 0)
  }

  constructor (option:Partial<IScreenConfig>, private dragLayout: DragLayout) {
    this.config = {
      ...this.config,
      ...option,
    }
    this.el.className = 'drag_layout_screen'
    this.config.boxEle.appendChild(this.el)
    this.updateStyle()
    this.initEvent()
  }

  updateStyle () {
    this.el.setAttribute('style', this.style)
  }

  initEvent () {
    this.el.onmousedown = this.handleMousedown.bind(this)
  }

  handleMousedown (e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const spiritDom = getSpiritDom(e.target as HTMLElement)
    console.log(spiritDom)
    const target = this.dragLayout.spirits.find(ele => ele.el === spiritDom)
    this.wheelDeltaY = 0
    if (target) {
      const disX = e.clientX - target.config.left
      const disY = e.clientY - target.config.top
      target.active = true
      switch (target.config.position) {
        case 'absolute':
          document.onmousemove = (ev: MouseEvent) => {
            const clientX = ev.clientX
            const clientY = ev.clientY
            let l = clientX - disX
            let t = clientY - disY + this.wheelDeltaY
            const maxL = this.el.clientWidth - target.clientWidth
            const maxT = this.el.clientHeight - target.clientHeight
            if (l > maxL) l = maxL
            if (l < 0) l = 0
            if (t > maxT) t = maxT
            if (t < 0) t = 0
            target.config.top = t
            target.config.left = l
            target.updateStyle()
          }
          break;
        default:
          this.createCopySpirit(target)
          document.onmousemove = (ev: MouseEvent) => {
            const clientX = ev.clientX
            const clientY = ev.clientY
            let l = clientX - disX
            let t = clientY - disY + this.wheelDeltaY
            this.copySpirit.config.top = t
            this.copySpirit.config.left = l
            this.copySpirit.updateStyle()
            this.checkNewSort(target)
          }
          break;
      }
      document.onmouseup = () => {
        document.onmouseup = document.onmousemove = null
        this.removeCopySpirit()
        target.active = false
      }
    }
  }

  createCopySpirit (spirit: BaseSpirit) {
    this.copySpirit = new CopySpirit({}, this.dragLayout)
    this.copySpirit.el.innerHTML = spirit.el.innerHTML
    this.copySpirit.config = {
      ...spirit.config
    }
    this.copySpirit.updateStyle()
    this.el.appendChild(this.copySpirit.el)
  }

  removeCopySpirit () {
    if (this.copySpirit) {
      this.copySpirit.destroy()
      this.copySpirit = undefined
    }
  }

  checkNewSort (target: BaseSpirit) {
    if (this.copySpirit) {
      const s = this.relativeSpirits.find(ele => ele !== target && Math.abs(ele.config.top - this.copySpirit.config.top) < this.threshold)
      if (s) {
        target.sort = s.sort - .5
      } else {
        const lastSpirit = this.relativeSpirits[this.relativeSpirits.length - 1]
        if (lastSpirit !== target && Math.abs(lastSpirit.bottomPosition - this.copySpirit.config.top) < this.threshold) {
          target.sort = lastSpirit.sort + .5
        }
      }
      this.dragLayout.resetPosition()
      this.dragLayout.calculateSort()
    }
  }
}