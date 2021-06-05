export type DomMode = 'flex' | 'absolute';
export type SpiritType = 'absolute' | 'relative' | 'fixed' | 'container' | 'flex';
export type EditMode = 'default' | 'fixed'
export interface IDomConfig {
  width: string;
  height: string;
  mode: DomMode;
  left: string | number;
  top: string | number;
}

export interface ISpiritParams {
  width: string;
  height: string;
  mode: DomMode;
  type?: SpiritType;
  render: Element | (() => any);
  disableResizable?: boolean;
  left: number;
  top: number;
}

export interface ISpiritConfig extends ISpiritParams {
  position: 'absolute' | 'relative' | 'fixed';
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
  handleDrop: (event: DragEvent, offset: {
    x: number;
    y: number;
  }) => void;
  screenWidth: number;
}

export interface IConfig extends IParams {
  editMode: EditMode;
}
