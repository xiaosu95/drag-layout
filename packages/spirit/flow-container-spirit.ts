import { SpiritType } from "@/enums";
import { Spirit } from "@/types";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { ContainerSpirit } from "./base-container-spirit";

export class FlowContainerSpirit extends ContainerSpirit {
  type: SpiritType = SpiritType.FLOW_CONTAINER;
  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("flow_spirit");
  }

  updateStyle() {
    this.syncChildrenStyle();
    super.updateStyle();
  }

  calculateSpiritStyle(spirit: Spirit) {
    const {
      config: { left },
      clientWidth: width
    } = spirit;
    const top =
      (spirit.active && this.copySpirit?.config.top) || spirit.config.top;
    const _c = this.children
      .filter(item => {
        const {
          config: { left: _left, top: _top },
          clientWidth: _width
        } = item;
        return (
          spirit !== item && // 排除自己
          top >= _top && // y轴目标top处于其它容器top之上
          // 容器x轴投影相交判断
          Math.abs(Math.abs(left + width / 2) - Math.abs(_left + _width / 2)) <
            (width + _width) / 2
        );
      })
      .sort((a, b) => b.bottomPosition - a.bottomPosition);
    spirit.config.top = _c[0]?.bottomPosition || this.config.top;
  }

  syncChildrenStyle() {
    if (this.children) {
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
    super.checkNewSort();
  }
  setLock(bool: boolean) {
    super.setLock(bool);
    this.children.forEach(ele => {
      ele.setResizable(ele.config.resizable && !bool);
    });
  }
}
