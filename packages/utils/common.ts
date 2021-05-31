export const getSpiritDom = (dom: HTMLElement) => {
  if (dom === document.body) {
    return undefined
  } else if (dom.getAttribute('data-uid')) {
    return dom
  } else {
    return getSpiritDom(dom.parentElement)
  }
}
