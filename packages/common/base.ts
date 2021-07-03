import { DragLayout } from "..";

export class Base {
  el: HTMLDivElement = document.createElement("div");
  constructor(public dragLayout: DragLayout) {}
  get relativeSpirits() {
    return this.dragLayout.relativeSpirits;
  }

  get screenHeight() {
    return Math.max(
      this.globalConfig.firstScreenHeight,
      this.relativeSpirits.reduce((a, b) => a + b.clientHeight, 0)
    );
  }

  get panel() {
    return this.dragLayout.panel;
  }

  get globalConfig() {
    return this.dragLayout.config;
  }

  get screen() {
    return this.dragLayout.scrren;
  }

  get clientHeight() {
    return this.el.clientHeight;
  }

  get clientWidth() {
    return this.el.clientWidth;
  }

  get coordinates() {
    return this.dragLayout.coordinates;
  }

  get activeSpirit() {
    return this.dragLayout.activeSpirit;
  }

  get markLine() {
    return this.dragLayout.markLine;
  }
}
