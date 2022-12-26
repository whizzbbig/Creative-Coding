const typeCanvas = document.querySelector('.sketch-01')
const typeContext = typeCanvas.getContext('2d')

const width = 1080
const height = 1080

typeCanvas.width = width
typeCanvas.height = height

const fps = 5
const frameDuration = 1000 / fps

let lastFrameTime = 0

const sketch = (time) => {
  if (time - lastFrameTime < frameDuration) {
    window.requestAnimationFrame(sketch)
    return
  }
  lastFrameTime = time

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

  window.requestAnimationFrame(sketch)
}

window.requestAnimationFrame(sketch)
