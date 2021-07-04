import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { AbsoluteSpirit } from "./absolute-spirit";

export class FixedSpirit extends AbsoluteSpirit {
  constructor(option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout);
    this.el.classList.add("fixed_spirit");
  }

  get maxT() {
    return this.globalConfig.firstScreenHeight - this.clientHeight;
  }

  getPosition() {
    const {
      config: { left, top, right, bottom },
      clientWidth
    } = this;
    const _top =
      top ??
      this.globalConfig.firstScreenHeight - bottom - this.clientHeight ??
      0;
    const _left =
      left ?? this.globalConfig.screenWidth - right - clientWidth ?? 0;
    return {
      top: _top,
      left: _left
    };
  }
}
