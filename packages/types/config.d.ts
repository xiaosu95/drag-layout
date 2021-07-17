import { ScrrenType, EditMode, SpiritType } from "@/enums";
import { Spirit } from ".";

export interface IBaseData {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}
export interface IOuputConfig extends IBaseData {
  type: SpiritType;
  resizable: boolean;
  children?: IOuputConfig[];
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
  handleResize: (ouput: IOuputConfig) => void;
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

export interface IParams {
  threshold: number;
  adsorptionThreshold: number;
  adsorption: boolean;
  firstScreenHeight: number;
  handleDrop: (
    event: DragEvent,
    offset: {
      x: number;
      y: number;
    }
  ) => void;
  screenWidth: number;
  infoDataBridge?: (info: IOuputConfig) => any;
  handleResize?: (spirit: Spirit, ouput: IOuputConfig) => void;
  handleMoved?: (spirit: Spirit, ouput: IOuputConfig) => void;
}

export interface IConfig extends IParams {
  editMode: EditMode;
  scrrenType: ScrrenType;
}
