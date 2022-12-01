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

const sketch = ({ context, width, height }) => {
  return () => {
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

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

      context.save()
      context.translate(x, y)
      context.rotate(-angle)
      context.scale(random.range(0.2, 2), random.range(0.2, 1))

      context.beginPath()
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h)
      context.fillStyle = '#D90404'
      context.fill()
      context.restore()

      context.save()
      context.translate(cx, cy)
      context.rotate(-angle)

      context.lineWidth = random.range(5, 20)

      context.beginPath()
      context.arc(0, 0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5))
      context.strokeStyle = 'white'
      context.stroke()
      context.restore()
    }
  }
}

canvasSketch(sketch, settings)
