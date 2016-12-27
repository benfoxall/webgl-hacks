import { gl, createProgram, interleave, sendAttibutes } from './lib/gl.js'
import { random } from './lib/util.js'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

const program = createProgram(vertex, fragment)

const rows = 50
const cols = 50
const n = rows * cols

const data = new Float32Array(n * 7)

interleave(data, 7, (chunk, i) => {
  const x = i % cols
  const y = (i / cols) | 0

  chunk[0] = ((x/cols) - .5) * 1.5
  chunk[1] = ((y/rows) - .5) * 1.5

  // movement offset/phase
  chunk[2] = random(0, Math.PI*2)
  chunk[3] = random(0, Math.PI*2)

  // color
  chunk[4] = random(0, 1)
  chunk[5] = random(0, 1)
  chunk[6] = random(0, 1)

})


const indices = []

for (let x = 0; x < cols - 1; x++) {
  for (let y = 0; y < rows - 1; y++) {

    indices.push(
      x +     y * cols,
      x + 1 + y * cols
    )

    indices.push(
      x +     y * cols,
      x + 1 + (y+1) * cols
    )

  }
}

sendAttibutes(
  program, data,
  [
    ['aPosition', 2],
    ['aPhase', 2],
    ['aColor', 3]
  ],
  indices
)


const uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)

  gl.uniform1f(uTime, t / 10000)
  gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0)
}

requestAnimationFrame(render)
