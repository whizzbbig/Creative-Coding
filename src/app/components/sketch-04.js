
import random from 'canvas-sketch-util/random'
import math from 'canvas-sketch-util/math'

const typeCanvas = document.querySelector('.sketch-04')
const typeContext = typeCanvas.getContext('2d')
const width = 1080
const height = 1080
let frame = 0

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt'
}

function draw () {
  typeContext.fillStyle = 'white'
  typeContext.fillRect(0, 0, width, height)

  const cols = params.cols
  const rows = params.rows
  const numCells = cols * rows

  const gridw = width * 0.8
  const gridh = height * 0.8
  const cellw = gridw / cols
  const cellh = gridh / rows
  const margx = (width - gridw) * 0.5
  const margy = (height - gridh) * 0.5

  for (let i = 0; i < numCells; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)

    const x = col * cellw
    const y = row * cellh
    const w = cellw * 0.8

    const f = params.animate ? frame : params.frame

    const n = random.noise3D(x, y, f * 10, params.freq)
    const angle = n * Math.PI * params.amp

    const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax)

    typeContext.save()
    typeContext.translate(x, y)
    typeContext.translate(margx, margy)
    typeContext.translate(cellw * 0.5, cellh * 0.5)
    typeContext.rotate(angle)

    typeContext.lineWidth = scale
    typeContext.lineCap = params.lineCap

    typeContext.beginPath()
    typeContext.moveTo(w * -0.5, 0)
    typeContext.lineTo(w * 0.5, 0)
    typeContext.stroke()
    typeContext.restore()
  }

  frame += +'.5'
  window.requestAnimationFrame(draw)
}

draw()
