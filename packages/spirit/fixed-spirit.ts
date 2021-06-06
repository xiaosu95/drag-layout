import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";
import { AbsoluteSpirit } from "./absolute-spirit";

export class FixedSpirit extends AbsoluteSpirit {
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.classList.add('fixed_spirit')
  }

  get maxT () {
    return this.globalConfig.firstScreenHeight - this.clientHeight
  }
}