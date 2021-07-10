import { BaseSpirit } from "@/common/base-spirit";
import { IOuputConfig, ISpiritParams } from "@/types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  children: BaseSpirit[] = [];
  auxiliaryDragEl = document.createElement("div");
  lockBtn = document.createElement("div");
  lock = true;

  get ouputConfig(): IOuputConfig {
    return {
      ...super.ouputConfig,
      children: this.children.map(ele => ele.ouputConfig)
    };
  }

  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("container_spirit");
    this.el.classList.add("lock");
    // this.initAuxiliaryDrag();
    this.initLockBtn();
  }

  handleMousedown(event: MouseEvent) {
    super.handleMousedown(event);
  }

  initAuxiliaryDrag() {
    this.auxiliaryDragEl.className = "drag_layout_auxiliary_drag";
    this.auxiliaryDragEl.innerHTML = `
      <span></span>
    `;
    this.el.appendChild(this.auxiliaryDragEl);
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

  updateStyle() {
    //
  }

  syncChildrenStyle() {
    //
  }

  calculateChildSort() {
    //
  }

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
    if (activeSpirit.parentSpirit !== this) {
      if (w) {
        activeSpirit.removeParentSpirit();
        activeSpirit.addParentSpirit(this);
        return true;
      }
      return false;
    } else {
      return w;
    }
  }

  checkNewSort() {
    //
  }

  setLock(bool: boolean) {
    this.lock = bool;
    this.el.classList[bool ? "add" : "remove"]("lock");
    this.lockBtn.classList[bool ? "remove" : "add"]("unlock");
    this.setResizable(this.config.resizable && bool);
  }
}
