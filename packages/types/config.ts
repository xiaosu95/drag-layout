import { ScrrenType, EditMode, SpiritType } from "../enums";
import { Spirit } from ".";

export interface IBaseData {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}
export interface IOuputSpiritConfig extends IBaseData {
  type: SpiritType;
  resizable: boolean;
  children?: IOuputSpiritConfig[];
  ext: any;
  percentage: IBaseData;
}
export interface IDomConfig {
  width: string;
  height: string;
  left: string | number;
  top: string | number;
}

export interface ISpiritParams {
  width: string | number;
  height: string | number;
  type?: SpiritType;
  render: Element | (() => any);
  resizable?: boolean;
  left: number;
  top: number;
  right: number;
  bottom: number;
  handleResize: (ouput: IOuputSpiritConfig) => void;
  ext: any;
  children?: ISpiritParams[];
  isScrrenBaseContainer?: boolean; // 是否为屏幕基础容器
}

export interface ISpiritConfig extends ISpiritParams {
  position: "absolute" | "relative" | "fixed";
}

export interface IFixedSpiritParams extends ISpiritParams {
  xPositionMode: "left" | "right";
  yPositionMode: "top" | "bottom";
}

export interface IScreenConfig {
  boxEle: HTMLDivElement;
  left: number;
  top: number;
}

/** 配置文件属性 */
interface IConfigAttributes {
  threshold: number;
  adsorptionThreshold: number;
  adsorption: boolean;
  firstScreenHeight: number;
  screenWidth: number;
  scrrenType: ScrrenType;
  scale: number; // 缩放
}
export interface IParams extends IConfigAttributes {
  handleDrop: (
    event: DragEvent,
    offset: {
      x: number;
      y: number;
    }
  ) => void;
  infoDataBridge?: (info: IOuputSpiritConfig) => any;
  handleResize?: (spirit: Spirit, ouput: IOuputSpiritConfig) => void;
  handleMoved?: (spirit: Spirit, ouput: IOuputSpiritConfig) => void;
}

export interface IConfig extends IParams {
  editMode: EditMode;
}

export interface IOuputConfig<T> extends IConfigAttributes {
  spirits: T[];
}
