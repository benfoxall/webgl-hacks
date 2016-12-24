import {gl, createProgram} from './lib/gl.js'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

const program = createProgram(vertex, fragment)

var aPosition = gl.getAttribLocation(program, 'aPosition')
var aVelocity = gl.getAttribLocation(program, 'aVelocity')
var aColor = gl.getAttribLocation(program, 'aColor')
var uTime = gl.getUniformLocation(program, 'uTime')


var n = 10000
var points = new Float32Array(n * 4)


for (var i, _i = 0; _i < n; _i++) {
  i = _i * 4

  points[i] = Math.random()
  points[i + 1] = Math.random()

  points[i + 2] = (Math.random() - 0.5) / 10
  points[i + 3] = (Math.random() - 0.5) / 10
}


var buffer = gl.createBuffer()
if (!buffer) throw new Error('Failed to create buffer.')
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

gl.vertexAttribPointer(
  aPosition,
  2,
  gl.FLOAT,
  gl.FALSE,
  Float32Array.BYTES_PER_ELEMENT * 4,
  0)
gl.enableVertexAttribArray(aPosition)

gl.vertexAttribPointer(
  aVelocity,
  2,
  gl.FLOAT,
  gl.FALSE,
  Float32Array.BYTES_PER_ELEMENT * 4,
  Float32Array.BYTES_PER_ELEMENT * 2)
gl.enableVertexAttribArray(aVelocity)


function render(t) {
  requestAnimationFrame(render)

  gl.uniform1f(uTime, t/10000)

  gl.drawArrays(gl.POINTS, 0, n)

}

requestAnimationFrame(render)
