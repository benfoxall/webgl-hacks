import { gl, createProgram, interleave, sendAttibutes } from './lib/gl.js'
import { random, flatten } from './lib/util.js'

import icosphere from 'icosphere'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

gl.enable(gl.DEPTH_TEST)

const program = createProgram(vertex, fragment)

const mesh = icosphere(2)

const n = mesh.positions.length

const data = new Float32Array(n * 8)

interleave(data, 8, (chunk, i) => {

  chunk[0] = mesh.positions[i][0] * 0.6
  chunk[1] = mesh.positions[i][1] * 0.6
  chunk[2] = mesh.positions[i][2] * 0.6

  // movement offset/phase
  chunk[3] = random(0, Math.PI*2)
  chunk[4] = random(0, Math.PI*2)

  // color
  chunk[5] = random(0.5, 1)
  chunk[6] = random(0.5, 1)
  chunk[7] = random(0.5, 1)

})


const indices = flatten(mesh.cells)

sendAttibutes(
  program, data,
  [
    ['aPosition', 3],
    ['aPhase', 2],
    ['aColor', 3]
  ],
  indices
)

const uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)
  gl.uniform1f(uTime, t / 10000)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}

requestAnimationFrame(render)
