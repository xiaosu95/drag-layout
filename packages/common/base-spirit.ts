import { SpiritType } from "../enums";
import { ContainerSpirit } from "../spirit/base-container-spirit";
import {
  IOuputSpiritConfig,
  ISpiritConfig,
  ISpiritParams
} from "../types/config";
import { DragLayout } from "../index";
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
    left: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
    position: "relative",
    render: undefined,
    resizable: true,
    handleResize: undefined,
    ext: undefined
  };
  _active = false;
  resizableEl = document.createElement("div");
  private _parentSpirit: ContainerSpirit;
  line = 0;
  offsetX = 0; // 相对父容器的y轴偏移

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
    return this.config.top + this.clientHeight;
  }

  get rightPosition() {
    return this.config.left + this.clientWidth;
  }

  get centerLineX() {
    return this.clientWidth / 2 + this.config.left;
  }

  get centerLineY() {
    return this.clientHeight / 2 + this.config.top;
  }

  get style() {
    const offset = this.getPosition();
    return `
      width: ${this.clientWidth}px;
      height: ${this.clientHeight}px;
      transform: translate(${offset.left}px, ${offset.top}px);
    `;
  }

  get clientWidth() {
    return typeof this.config.width === "number"
      ? this.config.width
      : (Number((this.config.width as string).match(/\d+/g)[0]) / 100) *
          this.globalConfig.screenWidth;
  }

  get clientHeight() {
    return typeof this.config.height === "number"
      ? this.config.height
      : (Number((this.config.height as string).match(/\d+/g)[0]) / 100) *
          this.screenHeight;
  }

  // 上级容器的宽度
  get parentWidth() {
    return this.parentSpirit?.clientWidth || this.globalConfig.screenWidth;
  }

  get ouputConfig(): IOuputSpiritConfig {
    const { clientWidth, clientHeight, type } = this;
    const offset = this.getPosition();
    const screenWidth = this.globalConfig.screenWidth;
    const right = screenWidth - offset.left - this.clientWidth;
    const bottom = this.screenHeight - offset.top - this.clientHeight;
    return {
      width: clientWidth,
      height: clientHeight,
      left: offset.left,
      top: offset.top,
      right,
      bottom,
      type,
      resizable: this.config.resizable,
      ext: this.config.ext,
      percentage: {
        left: this.calculatePercentageValue(offset.left, screenWidth),
        right: this.calculatePercentageValue(right, screenWidth),
        top: this.calculatePercentageValue(offset.top, this.screenHeight),
        bottom: this.calculatePercentageValue(bottom, this.screenHeight),
        width: this.calculatePercentageValue(clientWidth, screenWidth),
        height: this.calculatePercentageValue(
          clientHeight,
          this.globalConfig.firstScreenHeight
        )
      }
    };
  }

  get copySpirit() {
    return this.screen?.copySpirit;
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
    this.initRender();
    this.screen.el.appendChild(this.el);
  }

  calculatePercentageValue(val1: number, val2: number) {
    return Number(((val1 / val2) * 100).toFixed(2));
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
    const maxW =
      this.parentWidth -
      this.config.left +
      (this.parentSpirit?.config.left || 0);
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
        this.config.height = h;
      }
      if (type === "se" || type === "e") {
        this.config.width = w;
      }
      this.updateStyle();
      this.dragLayout.updateAllStyle();
    };
    const clear = () => {
      this.config.handleResize?.(this.ouputConfig);
      this.globalConfig.handleResize?.(this, this.ouputConfig);
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
        const parentL = this.parentSpirit?.config.left || 0;
        const maxL = this.parentWidth - this.clientWidth + parentL;
        this.screen.copySpirit.config.top = t;
        this.screen.copySpirit.config.left = l;
        // TODO: 增加left，性能暂未测试，待定
        this.config.left = Math.max(Math.min(l, maxL), 0);
        this.offsetX = this.config.left - parentL;
        this.offsetX < 0 && (this.offsetX = 0);
        this.screen.copySpirit.updateStyle();
        this.screen.checkNewSort();
        flag = false;
      };
      if (!flag) {
        flag = true;
        animation = window.requestAnimationFrame(func);
      }
    };
    const clear = () => {
      this.screen.removeCopySpirit();
      this.globalConfig.handleMoved?.(this, this.ouputConfig);
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
      if (this.parentSpirit.type === SpiritType.FLEX_CONTAINER) {
        this.config.width = "100%";
      }
      this.parentSpirit = undefined;
      this.config.left = 0;
      this.offsetX = 0;
      this.dragLayout.updateAllStyle();
      this.setResizable(true);
    }
  }

  addParentSpirit(spirit: ContainerSpirit) {
    this.offsetX = 0;
    this.parentSpirit = spirit;
    this.subSort = spirit.children.length;
    spirit._children.push(this);
    this.dragLayout.updateAllStyle();
    if (spirit.type === SpiritType.FLEX_CONTAINER) {
      this.setResizable(false);
    }
  }

  setResizable(bool: boolean) {
    if (bool) {
      this.resizableEl.classList.add("show");
    } else {
      this.resizableEl.classList.remove("show");
    }
  }

  getPosition() {
    const {
      config: { left, top, right, bottom },
      clientWidth
    } = this;
    const _top = top ?? this.screenHeight - bottom - this.clientHeight ?? 0;
    const _left =
      left ?? this.globalConfig.screenWidth - right - clientWidth ?? 0;
    return {
      top: _top,
      left: _left
    };
  }

  destroy() {
    this.el.remove();
  }
}
