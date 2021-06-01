import { IScreenConfig } from "@/types/config";
import { CopySpirit } from "@/spirit/copy-spirit";
import { DragLayout } from "..";
import { BaseSpirit } from "./base-spirit";
import { getSpiritDom } from "@/utils/common";
import { ContainerSpirit } from "@/spirit/container-spirit";

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
  copySpirit: CopySpirit = undefined
  wheelDeltaY = 0 // 滚动y值

  get clientHeight () {
    return this.el.clientHeight
  }

  get clientWidth () {
    return this.el.clientWidth
  }

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

  get panel () {
    return this.dragLayout.panel
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
    const target = this.dragLayout.spirits.find(ele => ele.el === spiritDom)
    this.panel.wheelDeltaY = 0
    if (target) {
      target.handleMousedown(e)
    }
  }

  createCopySpirit (spirit: BaseSpirit) {
    this.copySpirit = new CopySpirit({}, this.dragLayout, spirit)
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
      // 处理容器
      for (let index = 0; index < this.dragLayout.containerSpirits.length; index++) {
        if (this.dragLayout.containerSpirits[index].checkCanInsert()) {
          return
        }
      }
      const s = this.relativeSpirits.find(ele => {
        const offset = ele.config.top - this.copySpirit.config.top
        return ele !== target && offset > 0 && offset < this.threshold
      })
      if (s) {
        if (s.type === 'relative' || s.type === 'container' || s.type === 'flex') {
          target.removeParentSpirit()
          target.sort = s.sort - .5
        }
      } else {
        const lastSpirit = this.relativeSpirits[this.relativeSpirits.length - 1]
        if (lastSpirit !== target && Math.abs(lastSpirit.bottomPosition - this.copySpirit.config.top) < this.threshold) {
          target.sort = lastSpirit.sort + .5
        }
      }
      this.dragLayout.updateAllStyle()
      this.dragLayout.calculateSort()
    }
  }
}