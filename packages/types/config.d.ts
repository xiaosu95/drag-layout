import { BaseSpirit } from "@/common/base-spirit";

export type DomMode = 'flex' | 'absolute'
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
  position: 'absolute' | 'relative' | 'fixed';
}

export interface ISpiritConfig extends ISpiritParams {
  left: number;
  top: number;
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
