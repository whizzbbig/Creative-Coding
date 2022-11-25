import GSAP from 'gsap'
import { Program, Mesh, Texture, Plane } from 'ogl'

import fragment from '@/shaders/title-fragment.glsl'
import vertex from '@/shaders/title-vertex.glsl'

import { BREAKPOINT_PHONE } from '@/utils/breakpoints'
import { getBoundingClientRect } from '@/utils/dom'

export default class {
  constructor ({ align, area, element, gl, group, renderer, sizes, size }) {
    this.align = align
    this.area = area
    this.element = element
    this.elementExtra = this.element.parentNode
    this.gl = gl
    this.group = group
    this.renderer = renderer
    this.size = size
    this.sizes = sizes

    this.element.style.visibility = 'hidden'

    this.isProject = this.element.classList.contains('project__title')

    if (this.isProject) {
      this.elementExtra = this.elementExtra.parentNode
    }

    this.onResize()

    this.createTexture()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn()
        } else {
          this.animateOut()
        }
      })
    }).observe(this.element)
  }

  getLines (context, text, maxWidth) {
    const words = text.split(' ')
    const lines = []

    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = context.measureText(`${currentLine} ${word}`).width

      if (word.indexOf('<BR>') > -1) {
        lines.push(currentLine)

        currentLine = word.replace('<BR>', '')
      } else if (width < maxWidth) {
        currentLine += ` ${word}`
      } else {
        lines.push(currentLine)

        currentLine = word
      }
    }

    lines.push(currentLine)

    return lines
  }

  get isPhoneBreakpoint () {
    const { innerWidth } = window
    const isPhoneBreakpoint = innerWidth < BREAKPOINT_PHONE

    return isPhoneBreakpoint
  }

  async createTexture () {
    await document.fonts.ready

    const { devicePixelRatio, innerWidth } = window
    const scalePixel = devicePixelRatio > 1 ? devicePixelRatio * 1.5 : devicePixelRatio * 2
    const scale = this.isPhoneBreakpoint ? 375 : 960 * scalePixel

    this.scale = (scale / innerWidth) * 2

    this.canvas = document.createElement('canvas')
    this.canvas.height = this.element.clientHeight * this.scale
    this.canvas.width = this.element.clientWidth * this.scale

    this.context = this.canvas.getContext('2d')

    let lineHeight
    let value = this.element.firstElementChild.innerHTML

    value = value.replace(/<p>/g, '')
    value = value.replace(/<\/p>/g, '')
    value = value.replace(/&amp;/g, '&')
    value = value.trim()

    if (this.isProject) {
      lineHeight = 0
      value = value.toUpperCase()
    } else {
      lineHeight = this.isPhoneBreakpoint ? 1 : 10
      value = value.replace(/<br>/g, '\n')
    }

    const fontSize = this.isPhoneBreakpoint ? 80 : 72 * scalePixel

    this.context.font = `${fontSize}px Roobert`
    this.context.fillStyle = '#ffffff'
    this.context.textAlign = 'left'
    this.context.textBaseline = 'top'

    this.lines = this.getLines(this.context, value, this.canvas.width)

    for (let i = 0; i < this.lines.length; i += 1) {
      this.context.fillText(this.lines[i], 0, 0 + (i * (fontSize + lineHeight)))
    }

    const image = document.createElement('img')

    image.src = this.canvas.toDataURL('image/png')
    image.onload = _ => {
      this.texture = new Texture(this.gl, {
        image
      })

      this.createMask()
    }
  }

  createRandomGray (value) {
    const length = this.lines.length * 4 - 1
    const v = GSAP.utils.mapRange(0, length, 0, 1, value)

    return GSAP.utils.interpolate('#000000', '#ffffff', v)
  }

  createMask () {
    this.maskCanvas = document.createElement('canvas')
    this.maskCanvas.height = this.element.clientHeight * this.scale
    this.maskCanvas.width = this.element.clientWidth * this.scale

    this.maskContext = this.maskCanvas.getContext('2d')

    const height = this.maskCanvas.height / this.lines.length
    const padding = this.isPhoneBreakpoint ? 0 : 20
    const width = this.maskCanvas.width / 4

    let value = 0

    for (let i = 0; i < this.lines.length; i += 1) {
      const y = (height - padding) * i

      for (let j = 0; j < 4; j++) {
        const color = this.createRandomGray(value)
        const x = width * j

        this.maskContext.fillStyle = color
        this.maskContext.fillRect(x, y, width, height)

        value += 1
      }
    }

    const image = document.createElement('img')

    image.src = this.maskCanvas.toDataURL('image/png')

    document.documentElement.appendChild(image)
    image.onload = _ => {
      this.mask = new Texture(this.gl, {
        image
      })

      this.createMesh()
    }
  }

  createMesh () {
    const program = new Program(this.gl, {
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        uTransition: { value: 0 },
        tMap: { value: this.texture },
        tMask: { value: this.mask }
      },
      transparent: true
    })

    this.mesh = new Mesh(this.gl, {
      geometry: new Plane(this.gl),
      program
    })

    this.mesh.setParent(this.group)
  }

  onResize () {
    this.bounds = getBoundingClientRect(this.element, false)
  }

  updateScale () {
    this.mesh.scale.x = this.area.x * this.bounds.width / this.sizes.x
    this.mesh.scale.y = this.area.y * this.bounds.height / this.sizes.y
  }

  updatePosition (y = 0) {
    this.mesh.position.x = -(this.area.x / 2) + (this.mesh.scale.x / 2) + ((this.bounds.left - 0) / this.sizes.x) * this.area.x
    this.mesh.position.y = this.area.y / 2 - this.mesh.scale.y / 2 - ((this.bounds.top - y) / this.sizes.y) * this.area.y
  }

  update ({ page }) {
    if (!this.mesh) return

    const scroll = (page.scroll.current || 0) - (this.elementExtra.extra || 0)

    this.updateScale()
    this.updatePosition(-scroll)
  }

  /**
   * Animations.
   */
  animateIn () {
    GSAP.to(this.mesh.program.uniforms.uTransition, {
      duration: 2.5,
      ease: 'linear',
      value: 2
    })
  }

  animateOut () {
    GSAP.killTweensOf(this.mesh.program.uniforms.uTransition)

    GSAP.set(this.mesh.program.uniforms.uTransition, {
      value: 0
    })
  }
}
