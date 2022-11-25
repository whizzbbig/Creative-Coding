import GSAP from 'gsap'

import Component from '@/classes/Component'

import Textures from '@/canvas/utils/Textures'

export default class extends Component {
  constructor () {
    super({
      element: '.preloader',
      elements: {
        background: '.preloader__background',
        text: '.preloader__text'
      }
    })

    this.number = 0

    this.initTextures()

    this.update()
  }

  initTextures () {
    this.textures = Object.keys(Textures.cache).map(texture => {
      const value = Textures.cache[texture]

      return value
    })
  }

  async loaded () {
    this.timeline = GSAP.timeline()

    this.timeline.to(this, {
      duration: 0.5,
      number: 100,
      onUpdate: _ => {
        this.elements.text.innerHTML = parseInt(this.number)
      }
    }, 'animation')

    this.timeline.to(this.elements.text, {
      duration: 2.5,
      ease: 'expo.inOut',
      x: '-150vw'
    }, 'animation')

    this.timeline.to(this.elements.background, {
      duration: 2.5,
      ease: 'expo.inOut',
      scaleX: 0,
      transformOrigin: '0 0'
    }, 'animation')

    this.timeline.call(_ => {
      this.emitter.emit('load')

      document.body.classList.add('loaded')
    }, null, 0.8)

    this.timeline.call(_ => {
      this.element.parentNode.removeChild(this.element)
    })
  }

  update () {
    const { length } = this.textures.filter(texture => {
      texture.checkVideo?.()

      return texture.image
    })

    const number = Math.min((length / this.textures.length) * 100, 99)

    this.number = GSAP.utils.interpolate(this.number, number, 0.1)

    this.elements.text.innerHTML = parseInt(this.number)

    if (this.textures.length === length) {
      return this.loaded()
    }

    this.frame = window.requestAnimationFrame(this.update)
  }
}
