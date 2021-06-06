import { SpiritType } from "@/enums";
import { ContainerSpirit } from "@/spirit/container-spirit";
import { IOuputConfig, ISpiritConfig, ISpiritParams } from "@/types/config";
import { DragLayout } from "../index";
import { throttle } from "../utils/common";
import { Base } from "./base";
let uid = 0;
export class BaseSpirit extends Base {
  uid = uid++;
  sort = 0;
  subSort = 0;
  type: SpiritType = SpiritType.DEFAULT;
  config: ISpiritConfig = {
    width: "100%",
    height: "100px",
    left: 0,
    top: 0,
    position: "relative",
    render: undefined,
    resizable: true,
    handleResize: undefined
  };
  background = "";
  private _active = false;
  resizableEl = document.createElement("div");
  private _parentSpirit: ContainerSpirit;
  line = 0;

  get parentSpirit() {
    return this._parentSpirit;
  }
  set parentSpirit(s: ContainerSpirit) {
    this._parentSpirit = s;
    s
      ? this.el.setAttribute(
          "data-parent-type",
          SpiritType[s.type].toLocaleLowerCase()
        )
      : this.el.removeAttribute("data-parent-type");
  }

  get active() {
    return this._active;
  }

  set active(bool: boolean) {
    this._active = bool;
    this.el.setAttribute("data-active", String(bool));
  }

  get bottomPosition() {
    return this.config.top + this.el.clientHeight;
  }

  get rightPosition() {
    return this.config.left + this.el.clientWidth;
  }

  get centerLineX() {
    return this.clientWidth / 2 + this.config.left;
  }

  get centerLineY() {
    return this.clientHeight / 2 + this.config.top;
  }

  get style() {
    const { width, height, top, left } = this.config;
    return `
      width: ${width};
      height: ${height};
      transform: translate(${left}px, ${top}px);
      background: ${this.background};
    `;
  }

  get ouputConfig(): IOuputConfig {
    return {
      width: this.clientWidth,
      height: this.clientHeight,
      x: this.config.left,
      y: this.config.top,
      type: this.type,
      resizable: this.config.resizable
    };
  }

  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(dragLayout);
    this.config = {
      ...this.config,
      ...option
    };
    this.initResizableEl();
    this.updateStyle();
    this.el.className = "drag_spirit drag_default_spirit";
    this.el.setAttribute("data-uid", String(this.uid));
    // this.background = `RGBA(${Math.floor(255 * Math.random())}, ${Math.floor(
    //   255 * Math.random()
    // )}, ${Math.floor(255 * Math.random())})`;
    this.initRender();
    this.screen.el.appendChild(this.el);
  }

  initRender() {
    if (typeof this.config.render === "function") {
      this.el.appendChild(this.config.render());
    } else if (this.config.render instanceof HTMLElement) {
      this.el.appendChild(this.config.render);
    }
  }

  initResizableEl() {
    this.resizableEl.className = "drag_layout_resizable";
    this.resizableEl.innerHTML = `
      <span class="drag_layout_resizable_s" data-resizable="s"></span>
      <span class="drag_layout_resizable_e" data-resizable="e"></span>
      <span class="drag_layout_resizable_se" data-resizable="se"></span>
    `;
    this.el.appendChild(this.resizableEl);
    this.setResizable(this.config.resizable);
  }

  updateStyle() {
    this.el.setAttribute("style", this.style);
  }
  handleResizable(event: MouseEvent) {
    const target = event.target as HTMLSpanElement;
    const type = target.getAttribute("data-resizable");
    const disX = event.clientX - this.clientWidth;
    const disY = event.clientY - this.clientHeight;
    const maxW = this.screen.clientWidth - this.config.left;
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
        this.config.height = `${h}px`;
      }
      if (type === "se" || type === "e") {
        this.config.width = `${w}px`;
      }
      this.updateStyle();
      this.dragLayout.updateAllStyle();
    };
    const clear = () => {
      this.config.handleResize?.(this.ouputConfig);
      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mouseup", clear);
    };
    document.addEventListener("mousemove", handleMousemove);
    document.addEventListener("mouseup", clear);
  }

  handleMousedown(event: MouseEvent) {
    if ((event.target as HTMLElement).getAttribute("data-resizable")) {
      this.handleResizable(event);
      return;
    }

    const disX = event.clientX - this.config.left;
    const disY = event.clientY - this.config.top;
    let animation, flag;
    this.screen.createCopySpirit(this);
    const handleMousemove = (ev: MouseEvent) => {
      const func = () => {
        const l = ev.clientX - disX;
        const t = ev.clientY - disY + this.panel.wheelDeltaY;
        this.screen.copySpirit.config.top = t;
        this.screen.copySpirit.config.left = l;
        this.screen.copySpirit.updateStyle();
        this.screen.checkNewSort(this);
        flag = false;
      };
      if (!flag) {
        flag = true;
        animation = window.requestAnimationFrame(func);
      }
    };
    const clear = () => {
      this.screen.removeCopySpirit();
      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mouseup", clear);
      animation && window.cancelAnimationFrame(animation);
    };
    document.addEventListener("mousemove", handleMousemove);
    document.addEventListener("mouseup", clear);
  }

  removeParentSpirit() {
    if (this.parentSpirit) {
      const idx = this.parentSpirit.children.findIndex(ele => ele === this);
      if (idx !== -1) {
        this.parentSpirit.children.splice(idx, 1);
      }
      if (this.parentSpirit.type === SpiritType.BLOCK_CONTAINER) {
        this.config.width = "100%";
      }
      this.parentSpirit = undefined;
      this.config.left = 0;
      this.dragLayout.updateAllStyle();
    }
  }

  addParentSpirit(spirit: ContainerSpirit) {
    this.parentSpirit = spirit;
    this.subSort = spirit.children.length;
    // this.followParentStyle()
    spirit.children.push(this);
    this.dragLayout.updateAllStyle();
  }

  setResizable(bool: boolean) {
    if (bool) {
      this.resizableEl.classList.add("show");
    } else {
      this.resizableEl.classList.remove("show");
    }
  }

  destroy() {
    this.el.remove();
  }
}
