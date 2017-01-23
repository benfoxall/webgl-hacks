import {
    gl, createProgram, interleave, sendAttibutes,
    loop, loopStats, loopProtected
  } from './lib/gl.js'

import {random, randomMove, randomRotate} from './lib/util.js'

import cubeGenerator from './lib/cubeGenerator.js'

// const cube = cubeGenerator(.3)

const cubes = Array.from(
  {length: 50}, (_,i) =>
    randomRotate(
      randomMove(
        cubeGenerator(
          random(0.03, 0.06)
        ),
        0.5
      )
    )
  )


cubes.forEach( cube => cube.recomputeNormals() )

import vertex from './vert.glsl'
import fragment from './frag.glsl'


import {mat4, vec4} from 'gl-matrix'


gl.enable(gl.DEPTH_TEST)

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
    random(0.1,.6), random(0.1,.6), random(0.1,.6)
  ])
  chunk[6] = color[0]
  chunk[7] = color[1]
  chunk[8] = color[1] // cooler

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
const uTransform = gl.getUniformLocation(program, 'uTransform')
const uProjection = gl.getUniformLocation(program, 'uProjection')


const ratio = gl.canvas.clientWidth / gl.canvas.clientHeight
const projectionMatrix = mat4.create()

// apply perspective (+ fix aspect ratio)
mat4.perspective(projectionMatrix, Math.PI/2, ratio, 0.1, 5)

// move the camera back
mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -1] )
gl.uniformMatrix4fv(uProjection, false, projectionMatrix)


// animated transform
const transform = mat4.create()
const I = mat4.create()


loopProtected( t => {

  gl.uniform1f(uTime, t / 1000)

  mat4.rotateY(transform, I, t/3000)

  mat4.rotateX(transform, transform, Math.sin(t/6060)/3)

  mat4.rotateZ(transform, transform, Math.sin(t/5040)/3)

  gl.uniformMatrix4fv(uTransform, false, transform)


  gl.drawArrays(gl.TRIANGLES, 0, n)

})
