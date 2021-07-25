import { Base } from "../common/base";
import { DragLayout } from "../index";
export class Panel extends Base {
  el = document.createElement("div");
  wheelDeltaY = 0;

  get screen() {
    return this.dragLayout.scrren;
  }

  get style() {
    return `
      transform: scale(${this.globalConfig.scale});
    `;
  }

  constructor(el: HTMLDivElement, dragLayout: DragLayout) {
    super(dragLayout);
    el.appendChild(this.el);
    this.el.className = "drag_layout_pannel";
    this.initEvent();
    this.setScale();
  }

  initEvent() {
    this.el.onwheel = (event: WheelEvent) => {
      if (
        (this.screen.config.top < -this.screen.clientHeight &&
          event.deltaY > 0) ||
        (this.screen.config.top > this.clientHeight && event.deltaY < 0)
      ) {
        return;
      }
      this.screen.config.top -= event.deltaY;
      this.screen.updateStyle();
      this.wheelDeltaY += event.deltaY;
    };
    this.el.onmousedown = (event: MouseEvent) => {
      const disX = event.clientX - this.screen.config.left;
      const disY = event.clientY - this.screen.config.top;
      this.dragLayout.activeSpirit = undefined;
      document.onmousemove = (ev: MouseEvent) => {
        const clientX = ev.clientX;
        const clientY = ev.clientY;
        let l = clientX - disX;
        let t = clientY - disY;
        if (l < -this.screen.clientWidth) l = -this.screen.clientWidth;
        else if (l > this.clientWidth) l = this.clientWidth;
        if (t < -this.screen.clientHeight) t = -this.screen.clientHeight;
        else if (t > this.clientHeight) t = this.clientHeight;
        this.screen.config.top = t;
        this.screen.config.left = l;
        this.screen.updateStyle();
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
    };
  }

  setScale(val: number = this.globalConfig.scale) {
    this.globalConfig.scale = val;
    this.el.setAttribute("style", this.style);
  }

  getScale() {
    return this.globalConfig.scale;
  }
}
