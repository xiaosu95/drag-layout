import { Base } from "../common/base";
import { DragLayout } from "..";

export class Coordinates extends Base {
  xEl = document.createElement("div");
  yEl = document.createElement("div");
  precision = 10;
  lastXLength = 0;
  lastYLength = 0;
  blankSize = 25;

  get calibrationXNum() {
    return Math.ceil(this.screen.clientWidth / this.precision) + 1;
  }

  get calibrationYNum() {
    return Math.ceil(this.screen.clientHeight / this.precision) + 1;
  }

  constructor(dragLayout: DragLayout) {
    super(dragLayout);
    this.el.className = "drag_layout_coordinates";
    this.init();
  }

  init() {
    this.xEl.className = "drag_layout_coordinates_x";
    this.yEl.className = "drag_layout_coordinates_y";
    this.el.appendChild(this.xEl);
    this.el.appendChild(this.yEl);
    this.panel.el.appendChild(this.el);
  }

  updateStyle() {
    const xNum = this.calibrationXNum;
    const yNum = this.calibrationYNum;
    const xLength = this.precision * (xNum - 1);
    const yLength = this.precision * (yNum - 1);
    if (xLength !== this.lastXLength) {
      this.xEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width=${xLength +
          50}px height=22px viewBox="0 0 ${xLength + 50} 22">
          <line x1="0" y1="12" x2="${xLength +
            50}" y2="12" style="stroke:#aaa;stroke-width:1" />
          ${Array(xNum)
            .fill("")
            .map((_, idx) => {
              const x = this.precision * idx + this.blankSize;
              let str = `<line x1="${x}" y1="12" x2="${x}" y2="${
                !(idx % 5) ? "20" : "18"
              }" style="stroke:#aaa;stroke-width:1" />`;
              if (!(idx % 5)) {
                str += `
                <text fill="#5E5E5E" x="${x}" y="10" text-anchor="middle" font-size="12">${idx *
                  this.precision}</text>
              `;
              }
              return str;
            })}
        </svg>
      `;
      this.lastXLength = xLength;
    }
    if (yLength !== this.lastYLength) {
      this.yEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width=50px height=${yLength +
          50}px viewBox="0 0 50 ${yLength + 50}">
          <line x1="40" y1="0" y2="${yLength +
            50}" x2="40" style="stroke:#aaa;stroke-width:1" />
          ${Array(yNum)
            .fill("")
            .map((_, idx) => {
              const y = this.precision * idx + this.blankSize;
              let str = `<line y1="${y}" x1="40" y2="${y}" x2="${
                !(idx % 5) ? "48" : "46"
              }" style="stroke:#aaa;stroke-width:1" />`;
              if (!(idx % 5)) {
                str += `
                <foreignObject y="${y - 8}" x="0" width="36" height="12">
                  <p>${idx * this.precision}</p>
                </foreignObject>
                `;
              }
              return str;
            })}
        </svg>
      `;
      this.lastYLength = yLength;
    }
    this.xEl.setAttribute(
      "style",
      `
      transform: translateX(${this.screen.config.left - this.blankSize + 5}px);
    `
    );
    this.yEl.setAttribute(
      "style",
      `
      transform: translateY(${this.screen.config.top - this.blankSize + 5}px);
    `
    );
  }
}
