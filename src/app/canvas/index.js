import AutoBind from 'auto-bind'
import { Renderer, Camera, Transform, Vec2 } from 'ogl'

import Component from '@/classes/Component'

import Mouse from '@/canvas/components/Mouse'
import Scene from '@/canvas/components/Scene'

import Textures from '@/canvas/utils/Textures'

export default class App extends Component {
  constructor ({ page }) {
    super()

    AutoBind(this)

    this.page = page

    this.area = new Vec2()
    this.sizes = new Vec2()

    this.createRenderer()
    this.createCamera()

    this.onResize()

    this.createGroup()
    this.createMouse()
    this.createScene()
  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: window.devicePixelRatio
    })

    this.gl = this.renderer.gl
    this.gl.canvas.classList.add('canvas')

    Textures.set(this.gl)

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 2
  }

  createGroup () {
    this.group = new Transform()
  }

  createMouse () {
    this.mouse = new Mouse({
      area: this.area,
      sizes: this.sizes
    })
  }

  createScene () {
    this.scene = new Scene({
      area: this.area,
      camera: this.camera,
      gl: this.gl,
      group: this.group,
      mouse: this.mouse,
      page: this.page,
      renderer: this.renderer,
      sizes: this.sizes
    })

    this.scene.create()
  }

  /**
   * Events.
   */
  onMouseDown ({ originalEvent }) {
    this.mouse.onMouseDown(originalEvent)
  }

  onMouseMove ({ originalEvent }) {
    this.mouse.onMouseMove(originalEvent)
  }

  onMouseUp ({ originalEvent }) {
    this.mouse.onMouseUp(originalEvent)
  }

  onResize () {
    this.sizes.x = window.innerWidth
    this.sizes.y = window.innerHeight

    this.renderer.setSize(this.sizes.x, this.sizes.y)

    this.camera.perspective({
      aspect: this.sizes.x / this.sizes.y
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.area.x = width
    this.area.y = height

    this.mouse?.onResize()
    this.scene?.onResize()
  }

  /**
   * Animation.
   */
  show () {
    this.scene.show()
  }

  /**
   * Update.
   */
  update () {
    if (!this.sizes) return

    this.mouse?.update()
    this.scene.update()
  }
}
