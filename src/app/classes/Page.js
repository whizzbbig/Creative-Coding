import NormalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import Component from '@/classes/Component'
import Detection from '@/classes/Detection'

import Section from '@/components/Section'

import '@/components/sketch-01'
import '@/components/sketch-02'
import '@/components/sketch-03'
import '@/components/sketch-04'
import '@/components/sketch-05'

import { getBoundingClientRect } from '@/utils/dom'
import { lerp } from '@/utils/math'

export default class Page extends Component {
  constructor () {
    super({
      classes: {
        menuActive: 'menu--active'
      },
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        covers: '[data-canvas]'
      }
    })

    console.log(this.elements.covers)

    this.transform = Prefix('transform')

    this.scroll = {
      current: 0,
      easing: 0.1,
      percent: 0,
      position: 0,
      speed: 1.2,
      target: 0
    }

    this.create()
  }

  create () {
    super.create()

    console.log(this.elements.covers)

    this.createObserver()
    this.createScrolling()
  }

  createObserver () {
    this.observer = new window.ResizeObserver(entries => {
      for (const _ of entries) { // eslint-disable-line
        this.onResize()
      }
    })

    this.observer.observe(this.elements.wrapper)
  }

  createScrolling () {
    this.covers = this.elements.covers.map((element, index) => {
      return new Section({
        element,
        index,
        parent: this
      })
    })
  }

  /**
   * Events.
   */
  onResize (event) {
    this.scroll = {
      current: 0,
      easing: 0.1,
      percent: 0,
      position: 0,
      speed: 1.2,
      target: 0
    }

    this.elements.wrapper.style[this.transform] = 'translate3d(0, 0, 0)'

    this.bounds = getBoundingClientRect(this.elements.wrapper)

    this.covers.forEach(cover => {
      cover.onResize(this.bounds.height)
    })
  }

  onKeyDown ({ key }) {
    if (key === 'ArrowUp') {
      this.scroll.target += 200
    } else if (key === 'ArrowDown') {
      this.scroll.target -= 200
    }
  }

  onMouseDown (event) {
    if (!Detection.isMobile()) return

    this.isDown = true

    this.scroll.position = this.scroll.current
  }

  onMouseMove (event) {
    if (!Detection.isMobile()) return
    if (!this.isDown) return

    const { mouse } = event

    if (mouse.distance.y > 30 || mouse.distance.y < -30) {
      this.scroll.target = this.scroll.position - (mouse.distance.y * 2)
    }
  }

  onMouseUp (event) {
    if (!Detection.isMobile()) return

    this.isDown = false
  }

  onWheel (event) {
    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY * this.scroll.speed

    this.scroll.target -= speed
  }

  /**
   * Animation.
   */
  show () {
  }

  /**
   * Loop.
   */
  update () {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.easing)

    if (this.scroll.current < this.scroll.last) {
      this.scroll.direction = 'down'
    } else {
      this.scroll.direction = 'up'
    }

    this.elements.wrapper.style[this.transform] = `translate3d(0, ${this.scroll.current}px, 0)`

    this.scroll.last = this.scroll.current

    // if (this.scroll.current !== 0) {
    //   this.elements.menu.classList.add(this.classes.menuActive)
    // }

    this.covers.forEach(cover => cover.update?.())
  }

  /**
   * Events.
   */
  addEventListeners () {
    window.addEventListener('mousewheel', this.onWheel, { passive: true })
    window.addEventListener('wheel', this.onWheel, { passive: true })

    window.addEventListener('keydown', this.onKeyDown)
  }
}
