import { SpiritType } from "@/enums";
import { Spirit } from "@/types";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { ContainerSpirit } from "./flex-container-spirit";

export class FlowContainerSpirit extends ContainerSpirit {
  type: SpiritType = SpiritType.FLOW_CONTAINER;
  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("flow_spirit");
  }

  get leftSortChildren() {
    return this.children.sort((a, b) => a.config.left - b.config.left);
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
        .filter((_ele, _idx) => _idx <= idx)
        .map(ele => ele.bottomPosition)
    );
  }

  calculateSpiritStyle(spirit: Spirit) {
    const {
      config: { left, top },
      clientWidth: width
    } = (spirit.active && this.copySpirit) || spirit;
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
      this.children
        .sort((a, b) => Number(b.active) - Number(a.active)) // 优先active容器计算位置
        .forEach(ele => {
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
        activeSpirit.config.left = left;
        activeSpirit.config.top = top;
        return true;
      }
      return false;
    } else {
      return w;
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
