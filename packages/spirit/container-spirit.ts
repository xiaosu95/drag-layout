import { BaseSpirit } from "@/common/base-spirit";
import { SpiritType } from "@/enums";
import { IOuputConfig, ISpiritParams } from "@/types/config";
import { DragLayout } from "..";

export class ContainerSpirit extends BaseSpirit {
  type: SpiritType = SpiritType.BLOCK_CONTAINER;
  children: BaseSpirit[] = [];
  auxiliaryDragEl = document.createElement("div");

  get ouputConfig(): IOuputConfig {
    return {
      ...super.ouputConfig,
      children: this.children.map(ele => ele.ouputConfig)
    };
  }

  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("container_spirit");
    // this.background = "linear-gradient(45deg, black, transparent)";
    this.initAuxiliaryDrag();
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

  updateStyle() {
    super.updateStyle();
    this.children && this.children.sort((a, b) => a.subSort - b.subSort);
    this.syncChildrenStyle();
  }

  syncChildrenStyle() {
    if (this.children) {
      this.children.forEach((ele, idx) => {
        const {
          config: { left, top, height }
        } = this;
        const prev = this.children[idx - 1];
        ele.config.left = prev ? prev.rightPosition : left;
        ele.config.top = top;
        ele.config.width = `${100 / this.children.length}%`;
        ele.config.height = height;
        ele.updateStyle();
      });
    }
  }

  calculateChildSort() {
    this.children.sort((a, b) => a.config.left - b.config.left);
    this.children.forEach((ele, idx) => {
      ele.subSort = idx;
    });
  }

  checkCanInsert() {
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
    const {
      scrren: { copySpirit },
      activeSpirit
    } = this.dragLayout;
    const s = this.children.find(ele => {
      const offset = Math.abs(ele.config.left - copySpirit.config.left);
      return (
        ele !== activeSpirit &&
        offset < this.globalConfig.threshold &&
        copySpirit.config.top > ele.config.top &&
        copySpirit.config.top < ele.bottomPosition
      );
    });
    if (s) {
      activeSpirit.subSort = s.subSort - 0.5;
    } else {
      const lastSpirit = this.children[this.children.length - 1];
      if (
        lastSpirit !== activeSpirit &&
        Math.abs(lastSpirit.rightPosition - copySpirit.config.left) <
          this.globalConfig.threshold
      ) {
        activeSpirit.subSort = lastSpirit.subSort + 0.5;
      }
    }
    this.updateStyle();
    this.calculateChildSort();
  }
}
