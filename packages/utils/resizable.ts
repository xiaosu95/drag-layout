import { Base } from "@/common/base";
import { DragLayout } from "..";

export class Resizable extends Base {
  constructor(dragLayout: DragLayout) {
    super(dragLayout);
    this.initRender();
  }

  initRender() {
    this.el.className = "drag_layout_resizable";
    this.el.innerHTML = `
      <span class="drag_layout_resizable_s" data-resizable="s"></span>
      <span class="drag_layout_resizable_e" data-resizable="e"></span>
      <span class="drag_layout_resizable_se" data-resizable="se"></span>
    `;
    this.el.appendChild(this.el);
  }

  handleMousemove(event: MouseEvent) {
    const target = event.target as HTMLSpanElement;
    const type = target.getAttribute("data-resizable");
    const disX = event.clientX - this.clientWidth;
    const disY = event.clientY - this.clientHeight;
    const maxW = this.screen.clientWidth - this.activeSpirit.config.left;
    const handleMousemove = (ev: MouseEvent) => {
      const clientX = ev.clientX;
      const clientY = ev.clientY;
      let w = clientX - disX;
      let h = clientY - disY;
      if (h < 30) h = 30;
      if (w < 30) w = 30;
      else if (w > maxW) {
        w = maxW;
      }
      if (type === "s" || type === "se") {
        this.activeSpirit.config.height = `${h}px`;
      }
      if (type === "se" || type === "e") {
        this.activeSpirit.config.width = `${w}px`;
      }
      this.activeSpirit.updateStyle();
      this.dragLayout.updateAllStyle();
    };
    const clear = () => {
      this.activeSpirit.config.handleResize?.(this.activeSpirit.ouputConfig);
      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mouseup", clear);
    };
    document.addEventListener("mousemove", handleMousemove);
    document.addEventListener("mouseup", clear);
  }
}
