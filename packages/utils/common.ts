export const getSpiritDom = (dom: HTMLElement) => {
  if (dom === document.body) {
    return undefined
  } else if (dom.getAttribute('data-uid')) {
    return dom
  } else {
    return getSpiritDom(dom.parentElement)
  }
}

export const throttle = function(func: Function, delay: number) {
  let timer: any
  const context = this
  return function() {
    const args = arguments
    if (!timer){
      const callNow = !timer
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
      }, delay)
      if (callNow){
        func.apply(context, args)
      }
    }
  }
}