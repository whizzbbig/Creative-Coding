import canvasSketch from 'canvas-sketch'
import math from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'

const home = document.querySelector('.home__wrapper')

const settings = {
  dimensions: [1080, 1080],
  parent: home,
  animate: true,
  fps: 5,
  playbackRate: 'throttle'
}

const typeCanvas = document.querySelector('.sketch-02')
const typeContext = typeCanvas.getContext('2d')

const sketch = ({ context, width, height }) => {
  return () => {
    typeContext.fillStyle = 'black'
    typeContext.fillRect(0, 0, width, height)

    const cx = width * 0.5
    const cy = height * 0.5
    const w = width * 0.01
    const h = height * 0.1

    let x, y

    const num = random.range(12, 45)
    const radius = width * 0.3

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num)
      const angle = slice * i

      x = cx + radius * Math.sin(angle)
      y = cy + radius * Math.cos(angle)

      typeContext.save()
      typeContext.translate(x, y)
      typeContext.rotate(-angle)
      typeContext.scale(random.range(0.2, 2), random.range(0.2, 1))

      typeContext.beginPath()
      typeContext.rect(-w * 0.5, random.range(0, -h * 0.5), w, h)
      typeContext.fillStyle = '#D90404'
      typeContext.fill()
      typeContext.restore()

      typeContext.save()
      typeContext.translate(cx, cy)
      typeContext.rotate(-angle)

      typeContext.lineWidth = random.range(5, 20)

      typeContext.beginPath()
      typeContext.arc(0, 0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5))
      typeContext.strokeStyle = 'white'
      typeContext.stroke()
      typeContext.restore()
    }
  }
}

canvasSketch(sketch, settings)
