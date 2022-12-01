// Basic Fundamentals of JS & Creative Coding

// function add (a, b) {
//   return a + b
// }

// const result = add(7, 9)
// console.log(result)

// const multiply = (a, b) => {
//   return a * b
// }

// console.log(multiply(5, 7))

// const years = []
// const skills = ['frontend', 'backend', 'web developer', 'creative developer']

// for (let i = 0; i < skills.length; i++) {
//   console.log(skills[i])
// }

// for (let i = 0; i < 10; i++) {
//   years.push(2040 + i)
// }

// console.log(years)

// skills.forEach(skill => {
//   console.log(skill)
// })

// const canvas = document.querySelector('canvas')
// const context = canvas.getContext('2d')

// context.fillStyle = 'blue'
// // context.fillRect(100, 100, 600, 600)

// context.lineWidth = '3'
// context.beginPath()
// context.rect(100, 100, 400, 400)
// // context.stroke()

// context.beginPath()
// context.arc(300, 300, 100, 0, Math.PI * 2)
// // context.stroke()

// // const gravity = 9.81
// // let velocity = 0.0

// const width = 60
// const height = 60
// const gap = 20
// let x, y

// for (let i = 0; i < 5; i++) {
//   for (let j = 0; j < 5; j++) {
//     x = 100 + (width + gap) * i
//     y = 100 + (height + gap) * j

//     context.beginPath()
//     context.rect(x, y, width, height)
//     context.stroke()

//     if (Math.random() > 0.5) {
//       context.beginPath()
//       context.rect(x + 8, y + 8, width - 16, height - 16)
//       context.stroke()
//     }
//   }
// }

// Basic Setup to follow

// context.save()
// context.translate(x, y)
// context.rotate(0.3)

// context.beginPath()
// context.rect(-w * 0.5, -h * 0.5, w, h)
// context.fill()
// context.restore()
