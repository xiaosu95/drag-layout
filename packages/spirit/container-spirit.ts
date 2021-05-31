import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  type: SpiritType = 'container'
  childrens: BaseSpirit[] = []
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'container_spirit'
  }

  handleMousedown (event: MouseEvent) {
    super.handleMousedown(event)
  }

  updateStyle () {
    super.updateStyle()
    this.childrens && this.childrens.forEach(ele => {
      ele.followParentPosition()
    })
  }

  checkCanInsert () {
    const { copySpirit } = this.screen
    const { config: { left, top } } = copySpirit
    const { activeSpirit } = this.dragLayout
    if (activeSpirit.parentSpirit !== this && Math.abs(this.centerLineX - left) < (this.clientWidth / 2 - 10) && Math.abs(this.centerLineY - top) < (this.clientHeight / 2 - 10)) {
      activeSpirit.removeParentSpirit()
      activeSpirit.addParentSpirit(this)
    }
  }
}
