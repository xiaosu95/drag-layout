import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";

export class FixedSpirit extends BaseSpirit {
  constructor (option: Partial<ISpiritParams> = {}, dragLayout: DragLayout) {
    super(option, dragLayout)
  }
}