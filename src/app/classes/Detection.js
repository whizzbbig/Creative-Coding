class Detection {
  isMobile () {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
  }

  isWebPSupported () {
    if (!this.isWebPChecked) {
      this.isWebPChecked = true

      const element = document.createElement('canvas')

      if (element.getContext && element.getContext('2d')) {
        this.isWebPCheck = element.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }
    }

    return this.isWebPCheck
  }
}

export default new Detection()
