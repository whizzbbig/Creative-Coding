import AutoBind from 'auto-bind'

import Canvas from '@/canvas'

import AppSprites from '@/classes/AppSprites'
import Page from '@/classes/Page'

import Preloader from '@/components/Preloader'
import Slider from '@/components/Slider'

export default class App {
  constructor () {
    AutoBind(this)

    document.documentElement.style.setProperty('--100vh', `${window.innerHeight}px`)

    this.components = []

    this.initMouse()
    this.initPage()
    this.initCanvas()
    this.initPreloader()
    this.initSprites()

    this.onResize()

    this.addEventListeners()

    this.update()
  }

  initMouse () {
    this.mouse = {
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }
  }

  initPage () {
    this.page = new Page()
  }

  initCanvas () {
    this.canvas = new Canvas({
      page: this.page
    })
    this.slider = new Slider()
    this.components.push(this.canvas)
    this.components.push(this.slider)
  }

  initPreloader () {
    this.preloader = new Preloader()
    this.preloader.on('load', this.onPreloaded)
  }

  initSprites () {
    this.sprites = new AppSprites()
  }

  /**
   * Events.
   */
  onPreloaded () {
    this.onResize()

    this.page.show()
    this.canvas.show()
  }

  onMouseDown (event) {
    if (event.touches) {
      this.mouse.start = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    } else {
      this.mouse.start = {
        x: event.clientX,
        y: event.clientY
      }
    }

    this.page.onMouseDown?.({
      originalEvent: event,
      mouse: this.mouse
    })

    this.canvas.onMouseDown?.({
      originalEvent: event,
      mouse: this.mouse
    })
  }

  onMouseMove (event) {
    if (event.touches) {
      this.mouse.end = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    } else {
      this.mouse.end = {
        x: event.clientX,
        y: event.clientY
      }
    }

    this.mouse.distance = {
      x: this.mouse.start.x - this.mouse.end.x,
      y: this.mouse.start.y - this.mouse.end.y
    }

    this.page.onMouseMove?.({
      originalEvent: event,
      mouse: this.mouse
    })

    this.canvas.onMouseMove?.({
      originalEvent: event,
      mouse: this.mouse
    })
  }

  onMouseUp (event) {
    this.page.onMouseUp?.({
      originalEvent: event,
      mouse: this.mouse
    })

    this.canvas.onMouseUp?.({
      originalEvent: event,
      mouse: this.mouse
    })
  }

  onResize () {
    document.documentElement.style.setProperty('--100vh', `${window.innerHeight}px`)

    this.page.onResize?.()
    this.canvas.onResize?.()
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    window.addEventListener('mousedown', this.onMouseDown, {
      passive: true
    })
    window.addEventListener('mousemove', this.onMouseMove, {
      passive: true
    })
    window.addEventListener('mouseup', this.onMouseUp, {
      passive: true
    })

    window.addEventListener('touchstart', this.onMouseDown, {
      passive: true
    })
    window.addEventListener('touchmove', this.onMouseMove, {
      passive: true
    })
    window.addEventListener('touchup', this.onMouseUp, {
      passive: true
    })

    document.body.addEventListener('mouseleave', this.onMouseUp, {
      passive: true
    })

    window.addEventListener('resize', this.onResize)
  }

  /**
   * Loop.
   */
  update () {
    this.page?.update?.()
    this.canvas.update?.()

    this.frame = window.requestAnimationFrame(this.update)
  }
}
