import { BaseSpirit } from "../common/base-spirit";
import { IOuputConfig, ISpiritParams } from "../types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  _children: BaseSpirit[] = [];
  auxiliaryDragEl = document.createElement("div");
  lockBtn = document.createElement("div");
  lock = true;

  get children() {
    return this.isScrrenBaseContainer ? this.relativeSpirits : this._children;
  }
  get ouputConfig(): IOuputConfig {
    return {
      ...super.ouputConfig,
      children: this.children.map(ele => ele.ouputConfig)
    };
  }
  // 容器使用top、left做定位，只为了lock的层级可以高于子容器，后续可以换回去
  get style() {
    const offset = this.getPosition();
    return `
      width: ${this.clientWidth}px;
      height: ${this.clientHeight}px;
      top: ${offset.top}px;
      left: ${offset.left}px;
      `;
  }
  get active() {
    return this._active;
  }
  set active(bool: boolean) {
    this._active = bool;
    this.el.setAttribute("data-active", String(bool));
    this.children.forEach(ele => {
      ele.el.setAttribute("data-parent-active", String(bool));
    });
  }

  get isScrrenBaseContainer() {
    return this.config.isScrrenBaseContainer;
  }

  // 是否有选中的子容器
  get hasActiveChild() {
    return this.children.find(ele => ele.active);
  }

  // 优先active容器排序的子容器
  get sortChildren() {
    return this.children.sort(
      (a, b) =>
        Number(b.active || !!(b as ContainerSpirit).hasActiveChild) -
        Number(a.active || !!(a as ContainerSpirit).hasActiveChild)
    );
  }

  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("container_spirit");
    if (!this.isScrrenBaseContainer) {
      this.el.classList.add("lock");
      this.initLockBtn();
    } else {
      this.el.classList.add("scrren_base_container");
    }
  }

  handleMousedown(event: MouseEvent) {
    super.handleMousedown(event);
  }

  initLockBtn() {
    this.lockBtn.className = "drag_layout_auxiliary_lock_btn";
    this.el.appendChild(this.lockBtn);
    this.lockBtn.onmousedown = ev => {
      ev.stopPropagation();
    };
    this.lockBtn.onclick = () => {
      this.setLock(!this.lock);
    };
  }

  // 获取idx之前的最大bottomPosition
  getchildrenMaxBottom(idx) {
    if (this.isScrrenBaseContainer)
      return Math.max(
        this.globalConfig.firstScreenHeight,
        ...this.children
          .filter((_ele, _idx) => _idx <= idx)
          .map(ele => ele.bottomPosition)
      );
    if (idx === -1 || !this.children.length) return this.config.top;
    return Math.max(
      ...this.children
        .filter((_ele, _idx) => _idx <= idx)
        .map(ele => ele.bottomPosition)
    );
  }
  // 获取子容器最大right
  getchildrenMaxRight() {
    return Math.max(...this.children.map(ele => ele.rightPosition));
  }

  updateStyle() {
    super.updateStyle();
  }

  syncChildrenStyle() {
    //
  }

  calculateChildSort() {
    //
  }

  // 检测是否可以插入父容器
  checkCanInsert() {
    if (this.lock) return false;
    const { copySpirit } = this.screen;
    const {
      config: { left, top }
    } = copySpirit;
    const { activeSpirit } = this.dragLayout;
    if (this.uid === copySpirit.copyUid) return;
    const w =
      Math.abs(this.centerLineX - left) < this.clientWidth / 2 - 10 &&
      Math.abs(this.centerLineY - top) < this.clientHeight / 2 - 10;
    if (w) {
      // 可以insert到该容器内
      if (activeSpirit.parentSpirit !== this) {
        activeSpirit.removeParentSpirit();
        activeSpirit.addParentSpirit(this);
        activeSpirit.config.top = top;
        activeSpirit.config.left = left;
      }
    } else {
      // 是否移出容器外
      if (activeSpirit.parentSpirit === this) {
        const isOut =
          // Math.abs(this.centerLineX - left) > this.clientWidth / 2 + 20 ||
          Math.abs(this.centerLineY - top) > this.clientHeight / 2 + 20;
        if (isOut) {
          activeSpirit.removeParentSpirit();
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  checkNewSort() {
    // TODO: 需做性能优化
    this.screen.updateStyle();
  }

  setLock(bool: boolean) {
    this.lock = bool;
    this.el.classList[bool ? "add" : "remove"]("lock");
    this.lockBtn.classList[bool ? "remove" : "add"]("unlock");
    this.setResizable(this.config.resizable && bool);
  }
}
