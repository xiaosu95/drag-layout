import { EditMode, SpiritType } from "@/enums";

export interface IOuputConfig {
  width: number;
  height: number;
  x: number;
  y: number;
  type: SpiritType;
  resizable: boolean;
  children?: IOuputConfig[];
}
export interface IDomConfig {
  width: string;
  height: string;
  left: string | number;
  top: string | number;
}

export interface ISpiritParams {
  width: string;
  height: string;
  type?: SpiritType;
  render: Element | (() => any);
  resizable?: boolean;
  left: number;
  top: number;
  handleResize: (ouput: IOuputConfig) => void;
}

export interface ISpiritConfig extends ISpiritParams {
  position: "absolute" | "relative" | "fixed";
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
}

export interface IConfig extends IParams {
  editMode: EditMode;
}
