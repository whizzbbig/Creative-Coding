import GSAP from 'gsap'
import { Mesh, Program, Vec4 } from 'ogl'

import Detection from '@/classes/Detection'

import fragment from '@/shaders/media-fragment.glsl'
import vertex from '@/shaders/media-vertex.glsl'

import Textures from '@/canvas/utils/Textures'

import { BREAKPOINT_PHONE } from '@/utils/breakpoints'
import { getBoundingClientRect } from '@/utils/dom'

export default class {
  constructor ({ area, element, geometry, gl, group, index, sizes }) {
    this.area = area
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.group = group
    this.index = index
    this.sizes = sizes

    this.elements = {
      media: this.element.querySelector('img, video')
    }

    this.elements.media.style.visibility = 'hidden'

    this.extra = 0

    this.createObserver()
    this.createMesh()
  }

  createObserver () {
    new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn()
        } else {
          this.animateOut()
        }
      })
    }).observe(this.element.parentNode)
  }

  createMesh () {
    const path = window.innerWidth < BREAKPOINT_PHONE ? 'data-src-mobile' : 'data-src'
    let src = this.elements.media.getAttribute(path)

    if (Detection.isWebPSupported()) {
      src = src.replace('.jpg', '.webp')
      src = src.replace('.png', '.webp')
    }

    this.texture = Textures.load(src)
    this.texture.restartVideo?.()

    const program = new Program(this.gl, {
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        uArea: { value: this.sizes },
        uPosition: { value: 0 },
        uResolution: { value: new Vec4() },
        uSpeed: { value: 0 },
        uTransition: { value: 0 },
        tMap: { value: this.texture }
      },
      transparent: true
    })

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program
    })

    this.mesh.setParent(this.group)
  }

  /**
   * Events.
   */
  onResize (width) {
    this.extra = 0
    this.bounds = getBoundingClientRect(this.elements.media, false)
    this.width = getBoundingClientRect(this.element).width
    this.widthTotal = width
  }

  /**
   * Loop.
   */
  updateRatio () {
    if (this.texture.image) {
      const height = this.texture.image.height || this.texture.image.videoHeight
      const width = this.texture.image.width || this.texture.image.videoWidth

      this.aspect = height / width

      let a1
      let a2

      if (this.bounds.height / this.bounds.width > this.aspect) {
        a1 = (this.bounds.width / this.bounds.height) * this.aspect
        a2 = 1
      } else {
        a1 = 1
        a2 = (this.bounds.height / this.bounds.width) / this.aspect
      }

      this.mesh.program.uniforms.uResolution.value = [this.bounds.width, this.bounds.height, a1, a2]
    }
  }

  updateScale () {
    this.mesh.scale.x = this.area.x * this.bounds.width / this.sizes.x
    this.mesh.scale.y = this.area.y * this.bounds.height / this.sizes.y
  }

  updatePosition (x = 0, y = 0) {
    this.mesh.position.x = -(this.area.x / 2) + (this.mesh.scale.x / 2) + ((this.bounds.left - x.current) / this.sizes.x) * this.area.x + this.extra
    this.mesh.position.y = this.area.y / 2 - this.mesh.scale.y / 2 - ((this.bounds.top + y) / this.sizes.y) * this.area.y
  }

  updateExtra (x) {
    const meshOffset = this.mesh.scale.x / 2
    const viewportOffset = this.area.x

    this.isBefore = this.mesh.position.x + meshOffset < -viewportOffset
    this.isAfter = this.mesh.position.x - meshOffset > viewportOffset

    if (x.direction === 'right' && this.isBefore) {
      this.extra += this.widthTotal

      this.isBefore = false
      this.isAfter = false
    }

    if (x.direction === 'left' && this.isAfter) {
      this.extra -= this.widthTotal

      this.isBefore = false
      this.isAfter = false
    }
  }

  updateShaders (x) {
    const position = this.sizes.x < BREAKPOINT_PHONE ? 0.5 : 1
    const alpha = this.mesh.position.x < position && this.mesh.position.x > -position ? 1 : 0.5

    this.mesh.program.uniforms.uAlpha.value = GSAP.utils.interpolate(this.mesh.program.uniforms.uAlpha.value, alpha, 0.1)
    this.mesh.program.uniforms.uSpeed.value = GSAP.utils.interpolate(this.mesh.program.uniforms.uSpeed.value, x.speed, 0.1)

    this.mesh.program.uniforms.uPosition.value = this.mesh.position.x < -0.5
  }

  updateTexture () {
    this.texture.checkVideo?.()

    if (this.isVisible && this.mesh.program.uniforms.uAlpha.value > 0.9) {
      this.texture.playVideo?.()
    } else {
      this.texture.pauseVideo?.()
    }
  }

  update (x, y) {
    if (!this.bounds) return

    this.updateRatio()
    this.updateScale()
    this.updatePosition(x, y)
    this.updateExtra(x)
    this.updateShaders(x)
    this.updateTexture()
  }

  /**
   * Animations.
   */
  animateIn () {
    this.isVisible = true

    GSAP.to(this.mesh.program.uniforms.uTransition, {
      duration: 2.5,
      ease: 'linear',
      value: 2
    })
  }

  animateOut () {
    this.isVisible = false

    GSAP.killTweensOf(this.mesh.program.uniforms.uTransition)

    GSAP.set(this.mesh.program.uniforms.uTransition, {
      value: 0
    })
  }
}
