import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  type: SpiritType = 'container'
  childrens: BaseSpirit[]
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'container_spirit'
  }

  handleMousedown (event: MouseEvent) {
    super.handleMousedown(event)
  }

  checkCanInsert () {
    const { copySpirit } = this.screen
    const { config: { left, top } } = copySpirit
    const { activeSpirit } = this.dragLayout
    if (activeSpirit !== this && Math.abs(this.centerLineX - left) < (this.clientWidth / 2 - 50) && Math.abs(this.centerLineY - top) < (this.clientHeight / 2 - 50)) {
      activeSpirit.removeParentSpirit()
      activeSpirit.addParentSpirit(this)
    }
  }
}
