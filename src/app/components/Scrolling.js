import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import Component from '@/classes/Component'

import {
  getBoundingClientRect
} from '@/utils/dom'
import {
  clamp,
  lerp
} from '@/utils/math'

export default class extends Component {
  constructor ({
    blockers = ['menu--open', 'zoom--active'],
    easing = 0.1,
    element,
    speed = 1,
    target = window,
    wrapper
  }) {
    super({
      classes: {
        blockers
      },
      element,
      elements: {
        wrapper: wrapper || element.children[0],
        target
      }
    })

    this.isEnabled = true

    this.transformPrefix = Prefix('transform')

    this.current = 0
    this.easing = easing
    this.percent = 0
    this.speed = speed
    this.target = 0
    this.limit = 0

    this.observer = new window.ResizeObserver(entries => {
      for (const entry of entries) { // eslint-disable-line
        this.onResize()
      }
    })

    this.observer.observe(this.elements.wrapper)

    window.requestAnimationFrame(_ => {
      this.onResize()
    })
  }

  enable () {
    this.isEnabled = true
  }

  disable () {
    this.isEnabled = false
  }

  /**
   * Events.
   */
  onResize () {
    this.limit = this.elements.wrapper.clientHeight - this.element.clientHeight
  }

  onHashChange (event) {
    const element = this.element.querySelector(window.location.hash)
    const target = getBoundingClientRect(element).top
    const distance = Math.abs(target - this.current)

    GSAP.to(this, {
      duration: distance / 10000,
      ease: 'expo.inOut',
      target
    })
  }

  onKeyDown ({
    key
  }) {
    if (key === 'ArrowUp') {
      this.target -= 100
    } else if (key === 'ArrowDown') {
      this.target += 100
    }
  }

  onTabFocus ({
    target
  }) {
    // this.element.scrollTop = 0

    // this.target = getBoundingClientRect(target).top
  }

  onMouseDown () {
    if (!this.isEnabled || this.classes.blockers.some(className => document.documentElement.classList.contains(className))) return

    this.isDown = true

    this.position = this.current
  }

  onMouseMove ({
    mouse
  }) {
    if (!this.isDown) return
    if (!this.isEnabled || this.classes.blockers.some(className => document.documentElement.classList.contains(className))) return

    this.target = this.position + (mouse.distance.y * 3)
  }

  onMouseUp () {
    if (!this.isEnabled || this.classes.blockers.some(className => document.documentElement.classList.contains(className))) return

    this.isDown = false
  }

  onWheel (event) {
    if (!this.isEnabled || this.classes.blockers.some(className => document.documentElement.classList.contains(className))) return

    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY * this.speed

    this.target += speed
  }

  /**
   * Loop.
   */
  update () {
    this.target = clamp(0, this.limit, this.target)
    this.current = lerp(this.current, this.target, this.easing)

    if (this.current < 0.01) {
      this.current = 0
    }

    if (this.current > this.limit - 0.01) {
      this.current = this.limit
    }

    this.percent = this.current / this.limit

    this.elements.wrapper.style[this.transformPrefix] = `translate3d(0, -${this.current}px, 0)`
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    const elements = this.element.querySelectorAll('a, button, h1, h2, h3, h4, h5, h6, p')

    elements.forEach(element => {
      element.addEventListener('focus', this.onTabFocus)
    })

    this.elements.target.addEventListener('wheel', this.onWheel, {
      passive: true
    })

    window.addEventListener('hashchange', this.onHashChange)
    window.addEventListener('keydown', this.onKeyDown)
  }
}
