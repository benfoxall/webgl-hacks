import {gl, createProgram, interleave, sendAttibutes} from './lib/gl.js'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

const program = createProgram(vertex, fragment)

var n = 10000

var data = new Float32Array(n * 4)

interleave(data, 4, function(chunk) {
  chunk[0] = Math.random()
  chunk[1] = Math.random()

  chunk[2] = (Math.random() - 0.5) / 10
  chunk[3] = (Math.random() - 0.5) / 10
})

sendAttibutes(
  program, data,
  [
    ['aPosition', 2],
    ['aVelocity', 2]
  ]
)

var uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)

  gl.uniform1f(uTime, t/10000)
  gl.drawArrays(gl.POINTS, 0, n)

}

requestAnimationFrame(render)
