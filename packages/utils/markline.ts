import { Base } from "@/common/base";
import { DragLayout } from "..";

export class MarkLine extends Base {
  xEl = document.createElement("div");
  yEl = document.createElement("div");
  adsorptionX = 0;
  adsorptionY = 0;
  adsorptionXEl = document.createElement("div");
  adsorptionYEl = document.createElement("div");
  el = document.createElement("div");
  constructor(draglayout: DragLayout) {
    super(draglayout);
    this.el.className = "drag_layout_mark_line";
    this.xEl.className = "drag_layout_mark_line_x";
    this.yEl.className = "drag_layout_mark_line_y";
    this.adsorptionXEl.className = "drag_layout_mark_line_adsorption_x";
    this.adsorptionYEl.className = "drag_layout_mark_line_adsorption_y";
    this.init();
  }

  init() {
    this.el.appendChild(this.xEl);
    this.el.appendChild(this.yEl);
    this.screen.el.appendChild(this.adsorptionXEl);
    this.screen.el.appendChild(this.adsorptionYEl);
    this.panel.el.appendChild(this.el);
  }

  show() {
    this.el.setAttribute("data-show", "");
  }

  hide() {
    this.el.removeAttribute("data-show");
    this.hideAdsorptionXEl();
    this.hideAdsorptionYEl();
  }

  showAdsorptionYEl(x: number) {
    this.adsorptionYEl.setAttribute(
      "style",
      `
      transform: translateX(${x}px);
      display: block;
    `
    );
    this.adsorptionX = x;
  }

  hideAdsorptionYEl() {
    this.adsorptionYEl.setAttribute(
      "style",
      `
      display: none;
    `
    );
    this.adsorptionX = 0;
  }

  showAdsorptionXEl(y: number) {
    this.adsorptionXEl.setAttribute(
      "style",
      `
      transform: translateY(${y}px);
      display: block;
    `
    );
    this.adsorptionY = y;
  }

  hideAdsorptionXEl() {
    this.adsorptionXEl.setAttribute(
      "style",
      `
      display: none;
    `
    );
    this.adsorptionY = 0;
  }

  updateStyle() {
    this.xEl.setAttribute(
      "style",
      `
      transform: translateY(${this.activeSpirit.config.top +
        this.screen.config.top +
        30}px);
    `
    );
    this.yEl.setAttribute(
      "style",
      `
      transform: translateX(${this.activeSpirit.config.left +
        this.screen.config.left +
        30}px);
    `
    );
  }
}
