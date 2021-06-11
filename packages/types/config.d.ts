import { EditMode, SpiritType } from "@/enums";
import { Spirit } from ".";

export interface IOuputConfig {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  type: SpiritType;
  resizable: boolean;
  children?: IOuputConfig[];
  ext: any;
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
}
