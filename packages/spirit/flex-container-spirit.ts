import { SpiritType } from "../enums";
import { ISpiritParams } from "../types/config";
import { ContainerSpirit } from "./base-container-spirit";
import { DragLayout } from "..";

export class FlexContainerSpirit extends ContainerSpirit {
  type: SpiritType = SpiritType.FLEX_CONTAINER;

  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
  }

  updateStyle() {
    super.updateStyle();
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
        ele.config.width = this.clientWidth / this.children.length;
        ele.config.height = height;
        ele.updateStyle();
      });
    }
  }

  calculateChildSort() {
    if (this._children) {
      this._children.sort((a, b) => a.config.left - b.config.left);
      this.children.forEach((ele, idx) => {
        ele.subSort = idx;
      });
    }
  }

  checkNewSort() {
    const {
      scrren: { copySpirit },
      activeSpirit
    } = this.dragLayout;
    this.calculateChildSort();
    const s = this.children.find(ele => {
      return ele !== activeSpirit && ele.config.left > copySpirit.config.left;
    });
    if (s) {
      activeSpirit.subSort = s.subSort - 0.5;
    } else {
      activeSpirit.subSort = Infinity;
    }
    this._children.sort((a, b) => a.subSort - b.subSort);
    this.updateStyle();
  }
}
