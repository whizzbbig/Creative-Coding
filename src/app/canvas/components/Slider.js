import AutoBind from 'auto-bind'
import GSAP from 'gsap'
import { Transform } from 'ogl'

import Detection from '@/classes/Detection'

import Media from '@/canvas/components/Media'

import { getBoundingClientRect } from '@/utils/dom'

export default class {
  constructor ({ area, element, geometry, gl, group, sizes }) {
    AutoBind(this)

    this.area = area
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.group = group
    this.sizes = sizes

    this.elements = {
      wrapper: this.element.querySelector('.project__gallery__wrapper'),
      medias: this.element.querySelectorAll('.project__gallery__media')
    }

    this.x = {
      current: 0,
      direction: 'left',
      drag: 0,
      last: 0,
      speed: 0,
      start: 0,
      target: 0
    }

    this.createWrapper()
    this.createElements()

    this.addEventListeners()
  }

  createWrapper () {
    this.wrapper = new Transform()
    this.wrapper.setParent(this.group)
  }

  createElements () {
    this.medias = this.elements.medias.map((element, index) => {
      return new Media({
        area: this.area,
        element,
        geometry: this.geometry,
        gl: this.gl,
        group: this.wrapper,
        index,
        sizes: this.sizes
      })
    })
  }

  /**
   * Loop.
   */
  update ({ page }) {
    const y = (page.scroll.current || 0) - this.element.extra

    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, 0.1)
    this.x.speed = GSAP.utils.clamp(0, 0.3, Math.abs(this.x.current - this.x.last) * 0.01)

    if (this.x.current > this.x.last) {
      this.x.direction = 'right'
    } else if (this.x.current < this.x.last) {
      this.x.direction = 'left'
    }

    this.medias.forEach(media => media.update(this.x, y))

    this.x.last = this.x.current
    this.y = y
  }

  /**
   * Events.
   */
  onResize (event) {
    this.x = {
      current: 0,
      direction: 'left',
      drag: 0,
      last: 0,
      speed: 0,
      start: 0,
      target: 0
    }

    const bounds = getBoundingClientRect(this.elements.wrapper)
    const width = this.area.x * bounds.width / this.sizes.x

    this.medias.forEach(media => media.onResize(width))
  }

  onTouchDown (event) {
    this.isDown = true

    const x = event.touches ? event.touches[0].clientX : event.clientX

    this.x.drag = this.x.current
    this.x.start = x
  }

  onTouchMove (event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const velocity = Detection.isMobile() ? 2.5 : 1.5
    const distance = (this.x.start - x) * velocity

    this.x.target = this.x.drag + distance
  }

  onTouchUp (event) {
    this.isDown = false

    const { width } = this.medias[0]

    this.x.target = width * Math.floor((this.x.target + window.innerWidth * 0.5) / width)
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    this.element.addEventListener('mousedown', this.onTouchDown, { passive: true })
    this.element.addEventListener('mousemove', this.onTouchMove, { passive: true })
    this.element.addEventListener('mouseup', this.onTouchUp, { passive: true })

    this.element.addEventListener('touchstart', this.onTouchDown, { passive: true })
    this.element.addEventListener('touchmove', this.onTouchMove, { passive: true })
    this.element.addEventListener('touchend', this.onTouchUp, { passive: true })

    document.body.addEventListener('mouseleave', this.onTouchUp, { passive: true })
  }
}
