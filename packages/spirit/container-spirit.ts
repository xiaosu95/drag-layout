import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  type: SpiritType = 'container'
  childrens: BaseSpirit[] = []
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'container_spirit'
    this.background = 'linear-gradient(45deg, black, transparent)'
  }

  handleMousedown (event: MouseEvent) {
    super.handleMousedown(event)
  }

  updateStyle () {
    super.updateStyle()
    this.syncChildrensStyle()
  }
  
  syncChildrensStyle () {
    if (this.childrens) {
      this.calculateChildSort()
      this.childrens.forEach((ele, idx) => {
        const { config: {left, top, height}, clientHeight, clientWidth } = this
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
}
