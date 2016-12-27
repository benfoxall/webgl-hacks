import {gl, createProgram, interleave, sendAttibutes} from './lib/gl.js'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

const program = createProgram(vertex, fragment)

var rows = 50, cols = 50;

var n = rows * cols

var data = new Float32Array(n * 7)

interleave(data, 7, (chunk, i) => {
  var x = i % cols
  var y = (i / cols)|0

  chunk[0] = ((x/cols) - .5) * 1.5
  chunk[1] = ((y/rows) - .5) * 1.5

  // movement offset/phase
  chunk[2] = Math.random() * Math.PI * 2
  chunk[3] = Math.random() * Math.PI * 2

  // color
  chunk[4] = Math.random()/2 + 0.5
  chunk[5] = Math.random()/2 + 0.5
  chunk[6] = Math.random()/2 + 0.5

})



var indices = []

for (var x = 0; x < cols-1; x++) {
  for (var y = 0; y < rows-1; y++) {

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


var uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)
  gl.uniform1f(uTime, t/10000)
  gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0)
}

requestAnimationFrame(render)
