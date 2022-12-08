// replace the code below inside the sketch function in src/app/main.js
// to view the examples

import canvasSketch from 'canvas-sketch'

const home = document.querySelector('.home__wrapper')

const settings = {
  dimensions: [1080, 1080],
  parent: home,
  animate: true,
  fps: 5,
  playbackRate: 'throttle'
}

const typeCanvas = document.querySelector('.sketch-01')
const typeContext = typeCanvas.getContext('2d')

const sketch = ({ context, width, height }) => {
  return () => {
    typeContext.fillStyle = 'black'
    typeContext.fillRect(0, 0, width, height)

    typeContext.lineWidth = width * 0.01

    const w = width * 0.10
    const h = height * 0.10
    const gap = width * 0.03

    const ix = width * 0.17
    const iy = height * 0.17

    const offset = width * 0.02

    let x, y

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i
        y = iy + (h + gap) * j

        typeContext.beginPath()
        typeContext.rect(x, y, w, h)
        typeContext.strokeStyle = 'white'
        typeContext.stroke()

        if (Math.random() > 0.5) {
          typeContext.beginPath()
          typeContext.rect(x + offset / 2, y + offset / 2, w - offset, h - offset)
          typeContext.stroke()
        }
      }
    }
  }
}

canvasSketch(sketch, settings)
