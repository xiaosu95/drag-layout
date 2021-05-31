import { DragLayout } from '../index'
export class Panel {
  el = document.createElement('div')
  wheelDeltaY = 0

  get screen () {
    return this.dragLayout.scrren
  }

  constructor (el: HTMLDivElement, private dragLayout: DragLayout) {
    el.appendChild(this.el)
    this.el.className = 'drag_layout_pannel'
    this.initEvent()
  }

  initEvent () {
    this.el.onwheel = (event: WheelEvent) =>{
      this.screen.config.top -= event.deltaY
      this.screen.updateStyle()
      this.wheelDeltaY += event.deltaY
    }
    this.el.onmousedown = (event: MouseEvent) => {
      const disX = event.clientX - this.screen.config.left
      const disY = event.clientY - this.screen.config.top
      document.onmousemove = (ev: MouseEvent) => {
        const clientX = ev.clientX
        const clientY = ev.clientY
        let l = clientX - disX
        let t = clientY - disY
        this.screen.config.top = t
        this.screen.config.left = l
        this.screen.updateStyle()
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
    }
  }
}