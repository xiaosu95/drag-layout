import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";

export class CopySpirit extends BaseSpirit {
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
    this.el.className = 'copy_spirit'
  }
}