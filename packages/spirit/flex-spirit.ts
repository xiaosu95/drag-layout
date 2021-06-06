import { SpiritType } from "@/enums";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { ContainerSpirit } from "./container-spirit";

export class FlexSpirit extends ContainerSpirit {
  type: SpiritType = SpiritType.INLINE_CONTAINER;
  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("flex_spirit");
    // this.background = "linear-gradient(45deg, #f70000, transparent)";
  }

  updateStyle() {
    this.syncChildrenStyle();
    super.updateStyle();
  }
  // 获取idx之前的最大bottomPosition
  getchildrenMaxBottom(idx) {
    if (idx === -1 || !this.children.length) return this.config.top;
    return Math.max(
      ...this.children
        .filter((ele, _idx) => _idx <= idx)
        .map(ele => ele.bottomPosition)
    );
  }

  calculateChildSort() {
    this.children.sort(
      (a, b) =>
        a.line * this.clientWidth +
        a.config.left -
        (b.line * this.clientWidth + b.config.left)
    );
    this.children.forEach((ele, idx) => {
      ele.subSort = idx;
    });
  }

  syncChildrenStyle() {
    if (this.children) {
      let line = 0;
      this.children.forEach((ele, idx) => {
        const {
          config: { left, top }
        } = this;
        const prev = this.children[idx - 1];
        if (prev) {
          const isNewLine =
            prev.rightPosition + ele.clientWidth > this.rightPosition;
          if (isNewLine) {
            ele.config.left = left;
            ele.config.top = this.getchildrenMaxBottom(idx - 1);
            line++;
          } else {
            ele.config.left = prev.rightPosition;
            ele.config.top = prev.config.top;
          }
        } else {
          ele.config.left = left;
          ele.config.top = top;
        }
        ele.line = line;
        ele.updateStyle();
      });
      this.config.height =
        (this.getchildrenMaxBottom(this.children.length) - this.config.top ||
          100) + "px";
    }
  }
}
