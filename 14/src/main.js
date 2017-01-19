import {
    gl, createProgram, interleave, sendAttibutes,
    loop, loopStats, loopProtected
  } from './lib/gl.js'

import { random, flatten } from './lib/util.js'

import cube from './lib/cube.js'

const c1 = cube(.3)

// import icosphere from 'icosphere'
import mat4 from 'gl-mat4'

import vertex from './vert.glsl'
import fragment from './frag.glsl'

gl.enable(gl.DEPTH_TEST)

const program = createProgram(vertex, fragment)

const n = c1.positions.length



const data = new Float32Array(n * 3)

interleave(data, 3, (chunk, i) => {

  chunk[0] = c1.positions[i][0]
  chunk[1] = c1.positions[i][1]
  chunk[2] = c1.positions[i][2]

})


// const indices = flatten(mesh.cells)

const indices = c1.indices

// console.log(data, indices)

sendAttibutes(
  program, data,
  [
    ['aPosition', 3]
  ]
  ,indices
)


import normal from 'triangle-normal'


// indices.forEach( i => {
//
// })
//


const normals = new Float32Array(indices.length)
for (let i = 0; i < indices.length; i+=3) {

  let output = normal(
    c1.positions[indices[i]][0],
    c1.positions[indices[i]][1],
    c1.positions[indices[i]][2],

    c1.positions[indices[i + 1]][0],
    c1.positions[indices[i + 1]][1],
    c1.positions[indices[i + 1]][2],

    c1.positions[indices[i + 2]][0],
    c1.positions[indices[i + 2]][1],
    c1.positions[indices[i + 2]][2]
  )

  // easier to plot colors
  .map( m => (m + 1)/2)

  normals.set(output, i

}


// This is all very wrong, though it looks okay
// so I'm going to go with it for now
const nmap = new Float32Array(indices.length)

nmap.set([
  0,1,2,3,4,5,6,7,
  0,1,2,3,4,5,6,7,
  0,1,2,3,4,5,6,7,
  0,1,2,3,4,5,6,7

  // 0,0,0,1,1,1,2,2,2,
  // 3,3,3,4,4,4,5,5,5,
  // 3,3,3,4,4,4,5,5,5,
  // 3,3,3,4,4,4,5,5,5
],0)

sendAttibutes(
  program, normals,
  [
    ['aNormal', 3]
  ]
  , nmap
)


// projectionMatrix

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

  gl.uniform1f(uTime, t / 10000)

  mat4.rotateY(transform, I, t/3000)

  mat4.rotateX(transform, transform, Math.sin(t/6030)/3)

  mat4.rotateZ(transform, transform, Math.sin(t/5300)/3)

  gl.uniformMatrix4fv(uTransform, false, transform)



  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)

})
