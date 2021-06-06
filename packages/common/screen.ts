import { IScreenConfig } from "@/types/config";
import { CopySpirit } from "@/spirit/copy-spirit";
import { DragLayout } from "..";
import { BaseSpirit } from "./base-spirit";
import { getSpiritDom } from "@/utils/common";
import { Base } from "./base";
import { Spirit } from "@/types";
import { EditMode, SpiritType } from "@/enums";

export class Screen extends Base {
  maskEl = document.createElement("span");
  config: IScreenConfig = {
    boxEle: null,
    left: 0,
    top: 0
  };
  copySpirit: CopySpirit = undefined;
  wheelDeltaY = 0; // 滚动y值

  get style() {
    const { left, top } = this.config;
    return `
      width: ${this.globalConfig.screenWidth}px;
      height: ${Math.max(
        this.globalConfig.firstScreenHeight,
        this.screenHeight
      )}px;
      transform: translate(${left}px, ${top}px);
    `;
  }

  constructor(option: Partial<IScreenConfig>, dragLayout: DragLayout) {
    super(dragLayout);
    this.config = {
      ...this.config,
      ...option
    };
    this.initRender();
    this.updateStyle();
    this.initEvent();
  }

  initRender() {
    this.el.classList.add("drag_layout_screen");
    this.maskEl.classList.add("drag_layout_screen_mask");
    this.el.appendChild(this.maskEl);
    this.config.boxEle.appendChild(this.el);
  }

  updateStyle() {
    this.el.setAttribute("style", this.style);
    this.coordinates && this.coordinates.updateStyle();
  }

  initEvent() {
    this.el.onmousedown = this.handleMousedown.bind(this);
    this.el.ondragover = (event: DragEvent) => {
      event.preventDefault();
    };
    this.el.ondrop = (event: DragEvent) => {
      const spiritDom: HTMLDivElement = getSpiritDom((event as any).toElement);
      let spirit: Spirit;
      if (spiritDom) {
        spirit = this.dragLayout.getSpirit(
          Number(spiritDom.getAttribute("data-uid"))
        );
      }
      this.globalConfig.handleDrop(event, {
        x: spirit ? spirit.config.left + event.offsetX : event.offsetX,
        y: spirit ? spirit.config.top + event.offsetY : event.offsetY
      });
    };
  }

  handleMousedown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const spiritDom = getSpiritDom(e.target as HTMLElement);
    const target = this.dragLayout.spirits.find(ele => ele.el === spiritDom);
    this.panel.wheelDeltaY = 0;
    if (target) {
      this.dragLayout.activeSpirit = target;
      target.handleMousedown(e);
    }
  }

  createCopySpirit(spirit: BaseSpirit) {
    this.copySpirit = new CopySpirit({}, this.dragLayout, spirit);
    this.el.appendChild(this.copySpirit.el);
  }

  removeCopySpirit() {
    if (this.copySpirit) {
      this.copySpirit.destroy();
      this.copySpirit = undefined;
    }
  }

  checkNewSort(target: BaseSpirit) {
    if (this.copySpirit) {
      // 处理容器
      if (this.activeSpirit.type === SpiritType.DEFAULT) {
        for (
          let index = 0;
          index < this.dragLayout.containerSpirits.length;
          index++
        ) {
          const c = this.dragLayout.containerSpirits[index];
          if (c.checkCanInsert()) {
            c.checkNewSort();
            return;
          }
        }
      }
      const s = this.relativeSpirits.find(ele => {
        const offset = ele.config.top - this.copySpirit.config.top;
        return (
          ele !== target && offset > 0 && offset < this.globalConfig.threshold
        );
      });
      if (s) {
        if (
          s.type === SpiritType.DEFAULT ||
          s.type === SpiritType.BLOCK_CONTAINER ||
          s.type === SpiritType.INLINE_CONTAINER
        ) {
          target.removeParentSpirit();
          target.sort = s.sort - 0.5;
        }
      } else {
        const lastSpirit = this.relativeSpirits[
          this.relativeSpirits.length - 1
        ];
        if (
          lastSpirit !== target &&
          Math.abs(lastSpirit.bottomPosition - this.copySpirit.config.top) <
            this.globalConfig.threshold
        ) {
          target.sort = lastSpirit.sort + 0.5;
        }
      }
      this.dragLayout.updateAllStyle();
      this.dragLayout.calculateSort();
    }
  }

  setEditMode(mode: EditMode) {
    this.el.setAttribute("data-fixed-view-mode", mode);
    if (mode === EditMode.FIXED) {
      this.maskEl.setAttribute(
        "style",
        `
        height: ${this.screenHeight - this.globalConfig.firstScreenHeight}px;
      `
      );
    }
  }
}
