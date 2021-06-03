import { EditMode, IConfig, IParams, ISpiritParams } from "./types/config";
import { Screen } from './common/screen';
import { BaseSpirit } from "./common/base-spirit";
import { AbsoluteSpirit } from './spirit/absolute-spirit'
import { FixedSpirit } from './spirit/fixed-spirit'
import { Panel } from "./utils/panel";
import './less/index.less';
import { ContainerSpirit } from "./spirit/container-spirit";
import { Spirit } from "./types";
import { FlexSpirit } from "./spirit/flex-spirit";
import { Coordinates } from "./utils/coordinates";
import { MarkLine } from "./utils/markline";
export class DragLayout {
  scrren: Screen
  panel: Panel
  spirits: Spirit[] = []
  coordinates: Coordinates
  markLine: MarkLine
  config: IConfig = {
    threshold: 40,
    adsorptionThreshold: 10,
    adsorption: true,
    editMode: 'default',
    firstScreenHeight: 700
  }
  private _activeSpirit: Spirit
  constructor (boxEle: HTMLDivElement, config: Partial<IParams> = {
  }) {
    this.config = {
      ...this.config,
      ...config
    }
    this.panel = new Panel(boxEle, this)
    this.scrren = new Screen({
      boxEle: this.panel.el
    }, this)
    this.coordinates = new Coordinates(this)
    this.markLine = new MarkLine(this)
  }

  get activeSpirit () {
    return this._activeSpirit
  }

  set activeSpirit (spirit: Spirit) {
    if (this._activeSpirit && this._activeSpirit !== spirit) {
      this._activeSpirit.active = false
    }
    spirit.active = true
    this._activeSpirit = spirit
  }

  get relativeSpirits () {
    return this.spirits.filter(ele => ele.config.position === 'relative' && !ele.parentSpirit).sort((a, b) => a.sort - b.sort)
  }

  get containerSpirits (): ContainerSpirit[] {
    return this.spirits.filter(ele => ele.type === 'container' || ele.type === 'flex') as ContainerSpirit[]
  }

  get allSpiritCoordinates () {
    return {
      x: [...this.spirits.map(ele => ele.config.left), ...this.spirits.map(ele => ele.rightPosition)],
      y: [...this.spirits.map(ele => ele.config.top), ...this.spirits.map(ele => ele.bottomPosition)]
    }
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
      if (ele.config.position === 'relative') {
        const prev = this.relativeSpirits[idx - 1]
        ele.config.top = prev ? prev.bottomPosition : 0
      }
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
    if (s.config.position === 'relative') {
      if (!prevSpirit) prevSpirit = this.spirits[this.spirits.length - 1]
      if (prevSpirit) {
        const position = this.getSpiritPosition(prevSpirit)
        s.config.top = position.top
      }
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

  setEditMode (mode: EditMode) {
    this.config.editMode = mode
    this.scrren.setEditMode(mode)
  }

  setAdsorption (bool: boolean) {
    console.log(bool)
    this.config.adsorption = bool
  }
}
