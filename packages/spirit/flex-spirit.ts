import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from "..";
import { ContainerSpirit } from "./container-spirit";

export class FlexSpirit extends ContainerSpirit {
  type: SpiritType = 'flex'
  childrens: BaseSpirit[] = []
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'flex_spirit'
    this.background = 'linear-gradient(45deg, #f70000, transparent)'
  }

  updateStyle () {
    this.syncChildrensStyle()
    super.updateStyle()
  }
  // 获取idx之前的最大bottomPosition
  getchildrenMaxBottom (idx) {
    if (idx === -1 || !this.childrens.length) return this.config.top
    return Math.max(...this.childrens.filter((ele, _idx) => _idx <= idx).map(ele => ele.bottomPosition))
  }

  calculateChildSort () {
    this.childrens.sort((a, b) => (a.line * this.clientWidth + a.config.left) - (b.line * this.clientWidth + b.config.left))
    this.childrens.forEach((ele, idx) => {
      ele.subSort = idx
    })
  }
  
  syncChildrensStyle () {
    if (this.childrens) {
      let line = 0
      this.childrens.forEach((ele, idx) => {
        const { config: {left, top, height}, clientHeight, clientWidth } = this
        const prev = this.childrens[idx - 1]
        if (prev) {
          const isNewLine = (prev.rightPosition + ele.clientWidth) > this.rightPosition
          if (isNewLine) {
            ele.config.left = left
            ele.config.top = this.getchildrenMaxBottom(idx - 1)
            line++
          } else {
            ele.config.left = prev.rightPosition
            ele.config.top = prev.config.top
          }
        } else {
          ele.config.left = left
          ele.config.top = top
        }
        ele.line = line
        ele.updateStyle()
      })
      this.config.height = ((this.getchildrenMaxBottom(this.childrens.length) - this.config.top) || 100) + 'px'
    }
  }
}
