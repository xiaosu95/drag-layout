/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
export const getSpiritDom = (dom: HTMLElement) => {
  if (dom === document.body) {
    return undefined;
  } else if (dom.getAttribute("data-uid")) {
    return dom;
  } else {
    return getSpiritDom(dom.parentElement);
  }
};

export const throttle = function(func: Function, delay: number) {
  let timer: any;
  const context = this;
  return function() {
    const args = arguments;
    if (!timer) {
      const callNow = !timer;
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);
      if (callNow) {
        func.apply(context, args);
      }
    }
  };
};

export function $offset(ele: HTMLElement, toEle: HTMLElement = document.body) {
  const obj = { left: 0, top: 0 };
  if (ele === toEle) return obj;
  (function _offset(ele2: any) {
    if (ele2.offsetParent) {
      obj.left += ele2.offsetLeft;
      obj.top += ele2.offsetTop;
      if (ele2.offsetParent !== toEle) {
        _offset(ele2.offsetParent);
      }
    }
  })(ele);
  return obj;
}
