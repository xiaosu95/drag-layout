import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  type: SpiritType = 'container'
  childrens: BaseSpirit[] = []
  auxiliaryDragEl = document.createElement('div')
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'container_spirit'
    this.background = 'linear-gradient(45deg, black, transparent)'
    this.initAuxiliaryDrag()
  }

  handleMousedown (event: MouseEvent) {
    super.handleMousedown(event)
  }

  initAuxiliaryDrag () {
    this.auxiliaryDragEl.className = 'drag_layout_auxiliary_drag'
    this.auxiliaryDragEl.innerHTML = `
      <span></span>
    `
    this.el.appendChild(this.auxiliaryDragEl)
  }

  updateStyle () {
    super.updateStyle()
    this.childrens && this.childrens.sort((a, b) => a.subSort - b.subSort)
    this.syncChildrensStyle()
  }

  syncChildrensStyle () {
    if (this.childrens) {
      this.childrens.forEach((ele, idx) => {
        const { config: { left, top, height } } = this
        const prev = this.childrens[idx - 1]
        ele.config.left = prev ? prev.rightPosition : left
        ele.config.top = top
        ele.config.width = `${100 / this.childrens.length}%`
        ele.config.height = height
        ele.updateStyle()
      })
    }
  }

  calculateChildSort () {
    this.childrens.sort((a, b) => a.config.left - b.config.left)
    this.childrens.forEach((ele, idx) => {
      ele.subSort = idx
    })
  }

  checkCanInsert () {
    const { copySpirit } = this.screen
    const { config: { left, top } } = copySpirit
    const { activeSpirit } = this.dragLayout
    if (this.uid === copySpirit.copyUid) return
    let w = Math.abs(this.centerLineX - left) < (this.clientWidth / 2 - 10) && Math.abs(this.centerLineY - top) < (this.clientHeight / 2 - 10)
    if (activeSpirit.parentSpirit !== this) {
      if (w) {
        activeSpirit.removeParentSpirit()
        activeSpirit.addParentSpirit(this)
        return true
      }
      return false
    } else {
      return w
    }
  }

  checkNewSort () {
    const { scrren: { copySpirit }, activeSpirit } = this.dragLayout
    const s = this.childrens.find(ele => {
      const offset = Math.abs(ele.config.left - copySpirit.config.left)
      return ele !== activeSpirit && offset < this.globalConfig.threshold && copySpirit.config.top > ele.config.top && copySpirit.config.top < ele.bottomPosition
    })
    if (s) {
      activeSpirit.subSort = s.subSort - .5
    } else {
      const lastSpirit = this.childrens[this.childrens.length - 1]
      if (lastSpirit !== activeSpirit && Math.abs(lastSpirit.rightPosition - copySpirit.config.left) < this.globalConfig.threshold) {
        activeSpirit.subSort = lastSpirit.subSort + .5
      }
    }
    this.updateStyle()
    this.calculateChildSort()
  }
}
