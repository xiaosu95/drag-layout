import { IDomConfig } from "@/types/config";

export class Dom {
  config:IDomConfig = {
    width: '100%',
    height: '100%',
    mode: 'flex',
    left: 0,
    top: 0,
  }
  get style () {
    const { width, height, left, top } = this.config
    return `
      width: ${width};
      height: ${height};
      left: ${left};
      top: ${top};
    `
  }
  el: HTMLDivElement = document.createElement('div')
  // constructor (option: Partial<IDomConfig> = {}) {
  // }

  render () {
    this.el.setAttribute('style', this.style)
  }

  init (option: Partial<IDomConfig> = {}) {
    this.config = {
      ...this.config,
      ...option,
    }
  }

  destroy () {
    this.el.remove();
  }
}
