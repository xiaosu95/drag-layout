import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams, SpiritType } from "@/types/config";
import { DragLayout } from "..";

export class AbsoluteSpirit extends BaseSpirit {
  type: SpiritType = 'absolute'
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'absolute_spirit'
    this.config.position = 'absolute'
  }

  handleMousedown (event: MouseEvent) {
    if ((event.target as any).getAttribute('data-resizable')) {
      this.handleResizable(event)
      return
    }

    const disX = event.clientX - this.config.left
    const disY = event.clientY - this.config.top
    this.active = true
    const onmousemove = (ev: MouseEvent) => {
      const clientX = ev.clientX
      const clientY = ev.clientY
      let l = clientX - disX
      let t = clientY - disY + this.panel.wheelDeltaY
      const maxL = this.screen.el.clientWidth - this.clientWidth
      const maxT = this.screen.el.clientHeight - this.clientHeight
      if (l > maxL) l = maxL
      if (l < 0) l = 0
      if (t > maxT) t = maxT
      if (t < 0) t = 0
      this.config.top = t
      this.config.left = l
      this.updateStyle()
    }

    const clear = () => {
      this.active = false
      document.removeEventListener('mousemove', onmousemove)
      document.removeEventListener('mouseup', clear)
    }
    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', clear)
  }
}