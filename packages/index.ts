import { IConfig, IParams, ISpiritParams, IOuputConfig } from "./types/config";
import { Screen } from "./common/screen";
import { BaseSpirit } from "./common/base-spirit";
import { Panel } from "./utils/panel";
import "./less/index.less";
import { Spirit } from "./types";
import { Coordinates } from "./utils/coordinates";
import { MarkLine } from "./utils/markline";
import { ContainerType, EditMode, SpiritType } from "./enums";
import {
  AbsoluteSpirit,
  BlockContainerSpirit,
  ContainerSpirit,
  FixedSpirit,
  FlexContainerSpirit,
  FlowContainerSpirit,
  InlineContainerSpirit
} from "./spirit";
export class DragLayout {
  scrren: Screen;
  panel: Panel;
  spirits: Spirit[] = [];
  coordinates: Coordinates;
  markLine: MarkLine;
  config: IConfig = {
    threshold: 40,
    adsorptionThreshold: 10,
    adsorption: true,
    editMode: EditMode.DEFAULT,
    firstScreenHeight: 700,
    screenWidth: 375,
    handleDrop: () => null
  };
  private _activeSpirit: Spirit;
  constructor(boxEle: HTMLDivElement, config: Partial<IParams> = {}) {
    this.config = {
      ...this.config,
      ...config
    };
    this.panel = new Panel(boxEle, this);
    this.scrren = new Screen(
      {
        boxEle: this.panel.el
      },
      this
    );
    this.scrren.setBoxSpirit(); // 设置基础容器
    this.coordinates = new Coordinates(this);
    this.markLine = new MarkLine(this);
    this.updateAllStyle();
  }

  get activeSpirit() {
    return this._activeSpirit;
  }

  set activeSpirit(spirit: Spirit) {
    if (this._activeSpirit && this._activeSpirit !== spirit) {
      this._activeSpirit.active = false;
    }
    spirit && (spirit.active = true);
    this._activeSpirit = spirit;
  }

  get relativeSpirits() {
    return this.spirits.filter(
      ele => ele.config.position === "relative" && !ele.parentSpirit
    );
  }

  get containerSpirits(): ContainerSpirit[] {
    return this.spirits.filter(
      ele =>
        ele.type === SpiritType.FLEX_CONTAINER ||
        ele.type === SpiritType.INLINE_CONTAINER ||
        ele.type === SpiritType.FLOW_CONTAINER ||
        ele.type === SpiritType.BLOCK_CONTAINER
    ) as ContainerSpirit[];
  }

  get firstHierarchySpirits() {
    return this.spirits.filter(ele => !ele.parentSpirit);
  }

  get allSpiritCoordinates() {
    return {
      x: [
        ...this.spirits.map(ele => ele.config.left),
        ...this.spirits.map(ele => ele.rightPosition)
      ],
      y: [
        ...this.spirits.map(ele => ele.config.top),
        ...this.spirits.map(ele => ele.bottomPosition)
      ]
    };
  }

  updateAllStyle() {
    this.scrren.updateStyle();
  }

  addSpirit(option: Partial<ISpiritParams>): Spirit {
    let s: Spirit;
    switch (option.type) {
      case SpiritType.ABSOLUTE:
        s = new AbsoluteSpirit(option, this);
        break;
      case SpiritType.FIXED:
        s = new FixedSpirit(option, this);
        break;
      case SpiritType.FLEX_CONTAINER:
        s = new FlexContainerSpirit(option, this);
        break;
      case SpiritType.INLINE_CONTAINER:
        s = new InlineContainerSpirit(option, this);
        break;
      case SpiritType.FLOW_CONTAINER:
        s = new FlowContainerSpirit(option, this);
        break;
      case SpiritType.BLOCK_CONTAINER:
        s = new BlockContainerSpirit(option, this);
        break;
      default:
        s = new BaseSpirit(option, this);
        break;
    }
    if (s.config.position === "relative") {
      // const prevSpirit =
      //   this.getSpirit(
      //     { x: option.left, y: option.top },
      //     this.relativeSpirits
      //   ) || this.relativeSpirits[this.relativeSpirits.length - 1];
      // s.config.top = prevSpirit ? prevSpirit.bottomPosition : 0;
      s.config.left = 0;
    }
    this.activeSpirit = s;
    this.spirits.push(s);
    this.updateAllStyle();
    return s;
  }

  getSpirit(
    uid: number | { x: number; y: number },
    arr: Spirit[] = this.spirits
  ) {
    if (typeof uid === "object") {
      if (Array.isArray(arr)) {
        return arr.find(ele => {
          const {
            config: { left, top },
            rightPosition,
            bottomPosition
          } = ele;
          return (
            left <= uid.x &&
            uid.x <= rightPosition &&
            uid.y >= top &&
            uid.y <= bottomPosition
          );
        });
      }
    } else {
      return arr.find(ele => ele.uid === uid);
    }
  }

  setEditMode(mode: EditMode) {
    this.config.editMode = mode;
    this.scrren.setEditMode(mode);
  }

  setAdsorption(bool: boolean) {
    console.log(bool);
    this.config.adsorption = bool;
  }

  getInfo<T = IOuputConfig>(): T[] {
    return this.firstHierarchySpirits.map(ele => {
      return this.config.infoDataBridge
        ? this.config.infoDataBridge(ele.ouputConfig)
        : ele.ouputConfig;
    });
  }

  loadSpirits(list: ISpiritParams[]) {
    list.forEach(ele => {
      this.addSpirit(ele);
    });
  }
  // 切换scrren模式
  switchScrrenMode(type: ContainerType) {
    this.scrren?.setBoxSpirit(type);
  }
}
