import {
    gl, createProgram, interleave, sendAttibutes
  } from './lib/gl.js'

import {random, randomMove, randomRotate} from './lib/util.js'

import cubeGenerator from './lib/cubeGenerator.js'

// const cube = cubeGenerator(.3)

const cubes = Array.from(
  {length: 500}, (_,i) =>
    randomRotate(
      randomMove(
        cubeGenerator(
          random(0.01, 0.04)
        ),
        0.5, 0.6
      )
    )
  )


cubes.forEach( cube => cube.recomputeNormals() )

import vertex from './vert.glsl'
import fragment from './frag.glsl'


import {mat4, vec4} from 'gl-matrix'


gl.enable(gl.DEPTH_TEST)
gl.clearColor(0.95, 0.95, 0.95, 1)

const program = createProgram(vertex, fragment)

// const n = cube.indices.length

const perCube = cubes[0].indices.length

const n = perCube * cubes.length

const data = new Float32Array(n * 9)

const colors = {}

interleave(data, 9, (chunk, _i) => {

  const cubeIdx = Math.floor(_i / perCube)
  const i = _i % perCube


  const cube = cubes[cubeIdx]
  const idx = cube.indices[i]

  chunk[0] = cube.positions[idx][0]
  chunk[1] = cube.positions[idx][1]
  chunk[2] = cube.positions[idx][2]

  chunk[3] = cube.normals[i][0]
  chunk[4] = cube.normals[i][1]
  chunk[5] = cube.normals[i][2]


  const color = colors[cubeIdx] || (colors[cubeIdx] = [
    random(0.1,.6), random(0.4,.5), random(0.4,.5)
  ])
  chunk[6] = color[0]
  chunk[7] = color[1]
  chunk[8] = color[2]

})


// const indices = cube.indices


sendAttibutes(
  program, data,
  [
    ['aPosition', 3],
    ['aNormal', 3],
    ['aColor', 3]
  ]
)


const uTime = gl.getUniformLocation(program, 'uTime')
const uProjection = gl.getUniformLocation(program, 'uProjection')
const uMVP = gl.getUniformLocation(program, 'uMVP')

import {VRLoop} from './lib/webvr.js'

VRLoop((t, mvpMatrix) => {

  gl.uniformMatrix4fv(uMVP, false, mvpMatrix)

  gl.drawArrays(gl.TRIANGLES, 0, n)

})
