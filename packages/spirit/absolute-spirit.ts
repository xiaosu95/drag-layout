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
  
  get maxL () {
    return this.screen.el.clientWidth - this.clientWidth
  }

  get maxT () {
    return this.screen.el.clientHeight - this.clientHeight
  }

  handleMousedown (event: MouseEvent) {
    if ((event.target as any).getAttribute('data-resizable')) {
      this.handleResizable(event)
      return
    }

    const disX = event.clientX - this.config.left
    const disY = event.clientY - this.config.top
    this.markLine.show()
    const onmousemove = (ev: MouseEvent) => {
      const clientX = ev.clientX
      const clientY = ev.clientY
      let l = clientX - disX
      let t = clientY - disY + this.panel.wheelDeltaY
      if (l > this.maxL) l = this.maxL
      if (l < 0) l = 0
      if (t > this.maxT) t = this.maxT
      if (t < 0) t = 0
      this.config.top = t
      this.config.left = l
      this.updateStyle()
      this.markLine.updateStyle()
      if (this.globalConfig.adsorption) {
        this.checkAdsorption()
      }
    }

    const clear = () => {
      if (this.markLine.adsorptionX) {
        this.config.left = this.markLine.adsorptionX
      }
      if (this.markLine.adsorptionY) {
        this.config.top = this.markLine.adsorptionY
      }
      this.markLine.hide()
      this.updateStyle()
      document.removeEventListener('mousemove', onmousemove)
      document.removeEventListener('mouseup', clear)
    }
    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', clear)
  }

  checkAdsorption () {
    const allSpiritCoordinates = this.dragLayout.allSpiritCoordinates
    let x = Infinity
    let y = Infinity
    for (let index = 0; index < allSpiritCoordinates.x.length; index++) {
      const elementX = allSpiritCoordinates.x[index];
      const elementY = allSpiritCoordinates.y[index];
      if (elementX < this.config.left && this.config.left - elementX < this.globalConfig.adsorptionThreshold) {
        if (x > elementX) x = elementX
      }
      if (elementY < this.config.top && this.config.top - elementY < this.globalConfig.adsorptionThreshold) {
        if (y > elementY) y = elementY
      }
    }
    if (x !== Infinity) {
      this.markLine.showAdsorptionYEl(x)
    } else {
      this.markLine.hideAdsorptionYEl()
    }
    if (y !== Infinity) {
      this.markLine.showAdsorptionXEl(y)
      this.config.top = y
    } else {
      this.markLine.hideAdsorptionXEl()
    }
  }
}