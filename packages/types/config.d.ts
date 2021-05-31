export type DomMode = 'flex' | 'absolute';
export type SpiritType = 'absolute' | 'relative' | 'fixed' | 'container';
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
  type?: 'absolute' | 'relative' | 'fixed' | 'container';
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

export interface IConfig {
  boxEle: HTMLDivElement;

}
