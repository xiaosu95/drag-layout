import { SpiritType } from "@/enums";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { ContainerSpirit } from "./base-container-spirit";

export class InlineContainerSpirit extends ContainerSpirit {
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
      this.sortChildren.forEach((ele, idx) => {
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
        // 限制子容器宽度
        const maxW = this.rightPosition - ele.config.left;
        if (ele.config.width > maxW) {
          ele.config.width = maxW;
        }
        ele.updateStyle();
      });
      this.config.height =
        this.getchildrenMaxBottom(this.children.length) - this.config.top ||
        100;
    }
  }
  setLock(bool: boolean) {
    super.setLock(bool);
    this.children.forEach(ele => {
      ele.setResizable(ele.config.resizable && !bool);
    });
  }
}
