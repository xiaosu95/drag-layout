import { IConfig, ISpiritParams } from "./types/config";
import { Screen } from './common/screen';
import { BaseSpirit } from "./common/base-spirit";
import { AbsoluteSpirit } from './spirit/absolute-spirit'
import { FixedSpirit } from './spirit/fixed-spirit'
import { Panel } from "./utils/panel";
import './less/index.less';
import { ContainerSpirit } from "./spirit/container-spirit";
import { Spirit } from "./types";
import { FlexSpirit } from "./spirit/flex-spirit";
export class DragLayout {
  scrren: Screen
  panel: Panel
  spirits: Spirit[] = []
  constructor (option: IConfig) {
    this.panel = new Panel(option.boxEle, this)
    this.scrren = new Screen({
      boxEle: this.panel.el
    }, this)
  }

  get relativeSpirits () {
    return this.spirits.filter(ele => ele.config.position === 'relative' && !ele.parentSpirit).sort((a, b) => a.sort - b.sort)
  }

  get activeSpirit () {
    return this.spirits.find(ele => ele.active)
  }

  get containerSpirits (): ContainerSpirit[] {
    return this.spirits.filter(ele => ele.type === 'container' || ele.type === 'flex') as ContainerSpirit[]
  }

  getSpiritPosition (spirit:BaseSpirit) {
    return {
      top: spirit.bottomPosition,
      left: spirit.rightPosition
    }
  }

  updateAllStyle () {
    this.relativeSpirits.sort((a, b) => a.sort - b.sort)
    this.relativeSpirits.forEach((ele, idx) => {
      const prev = this.relativeSpirits[idx - 1]
      ele.config.top = prev ? prev.bottomPosition : 0
      ele.updateStyle()
    })
    this.scrren.updateStyle()
  }

  addSpirit (option: Partial<ISpiritParams>, prevSpirit?: BaseSpirit) {
    let s: Spirit
    switch (option.type) {
      case 'absolute':
        s = new AbsoluteSpirit(option, this)
        break;
      case 'fixed':
        s = new FixedSpirit(option, this)
        break;
      case 'container':
        s = new ContainerSpirit(option, this)
        break;
      case 'flex':
        s = new FlexSpirit(option, this)
        break;
      default:
        s = new BaseSpirit(option, this)
        break;
    }
    if (!prevSpirit) prevSpirit = this.spirits[this.spirits.length - 1]
    if (prevSpirit) {
      const position = this.getSpiritPosition(prevSpirit)
      s.config.top = position.top
    }
    s.updateStyle()
    this.spirits.push(s)
    this.scrren.el.appendChild(s.el)
    this.calculateSort()
    this.scrren.updateStyle()
  }

  calculateSort () {
    const copyArr = [ ...this.relativeSpirits ]
    copyArr.sort((a, b) => a.config.top - b.config.top)
    copyArr.forEach((ele, idx) => {
      ele.sort = idx
    })
  }

  checkPosition () {

  }

  getSpirit (uid: number) {
    return this.spirits.find(ele => ele.uid === uid)
  }
}
