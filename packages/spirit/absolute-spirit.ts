import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";

export class AbsoluteSpirit extends BaseSpirit {
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'absolute_spirit'
  }
}