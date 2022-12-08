import Prefix from 'prefix'

import Component from '@/classes/Component'

import { getBoundingClientRect } from '@/utils/dom'

export default class extends Component {
  constructor ({ element, index, parent }) {
    super({
      element
    })

    this.extra = 0
    this.height = 0
    this.index = index
    this.position = 0
    this.transform = Prefix('transform')

    this.element.extra = this.extra

    this.parent = parent
  }

  onResize (height) {
    this.element.style[this.transform] = 'translateY(0)'

    this.element.extra = 0
    this.extra = 0

    this.bounds = getBoundingClientRect(this.element)
    this.height = height
  }

  update () {
    this.position = this.parent.scroll.current - this.extra

    const offset = this.position + this.bounds.top + this.bounds.height

    this.isBefore = offset < 0
    this.isAfter = offset > this.height

    if (this.parent.scroll.direction === 'down' && this.isBefore) {
      this.isBefore = false
      this.isAfter = true

      this.extra -= this.height
    }

    if (this.parent.scroll.direction === 'up' && this.isAfter) {
      this.isBefore = true
      this.isAfter = false

      this.extra += this.height
    }

    this.element.extra = this.extra
    this.element.style[this.transform] = `translateY(${-this.extra}px)`
  }
}
