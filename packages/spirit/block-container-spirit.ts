import { SpiritType } from "@/enums";
import { Spirit } from "@/types";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { ContainerSpirit } from "./base-container-spirit";

export class BlockContainerSpirit extends ContainerSpirit {
  type: SpiritType = SpiritType.BLOCK_CONTAINER;
  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("block_spirit");
  }

  updateStyle() {
    this.syncChildrenStyle();
    super.updateStyle();
  }

  calculateSpiritStyle(spirit: Spirit) {
    const top =
      (spirit.active && this.copySpirit?.config.top) || spirit.config.top;
    const _c = this.children
      .filter(item => {
        const {
          config: { top: _top }
        } = item;
        return (
          spirit !== item && top >= _top // 排除自己, y轴目标top处于其它容器top之下
        );
      })
      .sort((a, b) => b.bottomPosition - a.bottomPosition);
    spirit.config.top = _c[0]?.bottomPosition || this.config.top;
  }

  syncChildrenStyle() {
    if (this.children) {
      console.log(this.sortChildren);
      this.sortChildren.forEach(ele => {
        this.calculateSpiritStyle(ele);
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

  checkNewSort() {
    this.updateStyle();
  }
  setLock(bool: boolean) {
    super.setLock(bool);
    this.children.forEach(ele => {
      ele.setResizable(ele.config.resizable && !bool);
    });
  }
}
