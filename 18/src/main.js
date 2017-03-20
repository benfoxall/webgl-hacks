import {
    gl, createProgram, interleave, sendAttibutes,
    generateBuffer
  } from './lib/gl.js'

import {random, randomMove, randomRotate} from './lib/util.js'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

import {mat4, vec4} from 'gl-matrix'


// this might not be totally right, but I like it
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
gl.enable(gl.BLEND)

gl.disable(gl.DEPTH_TEST)
gl.clearColor(0.95, 0.95, 0.95, 1)

const program = createProgram(vertex, fragment)


const uPosePosition = gl.getUniformLocation(program, 'uPosePosition')
const uProjection = gl.getUniformLocation(program, 'uProjection')
const uTime = gl.getUniformLocation(program, 'uTime')
const uMVP = gl.getUniformLocation(program, 'uMVP')



const pointCount = 10000
const pointBuffer = generateBuffer(
   new Float32Array(pointCount * 3),
   (i) => Math.random()
)

const bpe = Float32Array.BYTES_PER_ELEMENT

const aPosition = gl.getAttribLocation(program, 'aPosition')

gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

import {VRLoop} from './lib/webvr.js'

VRLoop((t, mvpMatrix, frameData) => {

  gl.uniform3fv(
    uPosePosition,
    frameData? frameData.pose.position : [0,0,0]
  )

  gl.uniform1f(uTime, t)

  gl.uniformMatrix4fv(uMVP, false, mvpMatrix)

  gl.drawArrays(gl.POINTS, 0, pointCount)

})
