import { SpiritType } from "@/enums";
import { ISpiritParams } from "@/types/config";
import { ContainerSpirit } from "./base-container-spirit";
import { DragLayout } from "..";

export class FlexContainerSpirit extends ContainerSpirit {
  type: SpiritType = SpiritType.FLEX_CONTAINER;

  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
  }

  updateStyle() {
    super.updateStyle();
    this.children && this.children.sort((a, b) => a.subSort - b.subSort);
    this.syncChildrenStyle();
  }

  syncChildrenStyle() {
    if (this.children) {
      this.sortChildren.forEach((ele, idx) => {
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
    this.children.sort((a, b) => a.config.left - b.config.left);
    this.children.forEach((ele, idx) => {
      ele.subSort = idx;
    });
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
