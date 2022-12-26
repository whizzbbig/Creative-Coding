const typeCanvas = document.querySelector('.sketch-02')
const typeContext = typeCanvas.getContext('2d')

const width = 1080
const height = 1080

const animate = true
const fps = 5

const sketch = () => {
  typeContext.fillStyle = 'black'
  typeContext.fillRect(0, 0, width, height)

  const cx = width * 0.5
  const cy = height * 0.5
  const w = width * 0.01
  const h = height * 0.1

  let x, y

  const num = Math.floor(Math.random() * (45 - 12 + 1)) + 12
  const radius = width * 0.3

  for (let i = 0; i < num; i++) {
    const slice = (360 / num) * (Math.PI / 180)
    const angle = slice * i

    x = cx + radius * Math.sin(angle)
    y = cy + radius * Math.cos(angle)

    typeContext.save()
    typeContext.translate(x, y)
    typeContext.rotate(-angle)
    typeContext.scale(Math.random() * (2 - 0.2) + 0.2, Math.random() * (1 - 0.2) + 0.2)

    typeContext.beginPath()
    typeContext.rect(-w * 0.5, Math.random() * (-h * 0.5), w, h)
    typeContext.fillStyle = '#D90404'
    typeContext.fill()
    typeContext.restore()

    typeContext.save()
    typeContext.translate(cx, cy)
    typeContext.rotate(-angle)

    typeContext.lineWidth = Math.floor(Math.random() * (20 - 5 + 1)) + 5

    typeContext.beginPath()
    typeContext.arc(0, 0, radius * (Math.random() * (1.3 - 0.7) + 0.7), slice * (Math.random() * (1 - -8) + -8), slice * (Math.random() * (5 - 1) + 1))
    typeContext.strokeStyle = 'white'
    typeContext.stroke()
    typeContext.restore()
  }
}

if (animate) {
  setInterval(sketch, 1000 / fps)
} else {
  sketch()
}
