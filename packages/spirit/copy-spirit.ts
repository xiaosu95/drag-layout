import { BaseSpirit } from "@/common/base-spirit";
import { ISpiritParams } from "@/types/config";
import { DragLayout } from "..";

export class CopySpirit extends BaseSpirit {
  copyUid = -1;
  constructor(
    option: Partial<ISpiritParams> = {},
    dragLayout: DragLayout,
    spirit: BaseSpirit
  ) {
    super(option, dragLayout);
    this.el.className = "copy_spirit";
    this.el.innerHTML = spirit.el.innerHTML;
    this.config = {
      ...spirit.config
    };
    this.copyUid = spirit.uid;
    this.updateStyle();
  }
}
