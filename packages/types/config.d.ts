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
}

export interface ISpiritConfig extends ISpiritParams {
  left: number;
  top: number;
  position: 'absolute' | 'relative' | 'fixed';
}

export interface IScreenConfig {
  boxEle: HTMLDivElement;
  width: string;
  height: string;
  left: number;
  top: number;
}

export interface IParams {
  threshold: number;
  adsorptionThreshold: number;
  adsorption: boolean;
  firstScreenHeight: number;
}

export interface IConfig extends IParams {
  editMode: EditMode;
}
