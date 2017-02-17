
export const scale = (a, b) => (n) => n * (b - a) + a

export const random = (a, b) => scale(a,b)(Math.random())

// shallow
export const flatten = array =>
  array.reduce( (memo, item) => memo.concat(item), [] )


export const randomMove = (geom, by, to = -by) => {
  const x = random(to, by)
  const y = random(to, by)
  const z = random(to, by)

  for (var i = 0; i < geom.positions.length; i++) {
    geom.positions[i][0] += x
    geom.positions[i][1] += y
    geom.positions[i][2] += z
  }

  return geom
}


import {mat4, vec4} from 'gl-matrix'

window.vec4 = vec4
window.mat4 = mat4

// window.vec4.transformMat4(out, a, m)

export const randomRotate = (geom) => {

  const transform = mat4.create()
  mat4.rotateX(transform, transform, random(0,Math.PI*2))
  mat4.rotateY(transform, transform, random(0,Math.PI*2))
  mat4.rotateZ(transform, transform, random(0,Math.PI*2))


  const out = vec4.create()

  for (var i = 0; i < geom.positions.length; i++) {

    out.set(geom.positions[i])
    out[3] = 1

    // console.log(out)

    const to = vec4.create()

    vec4.transformMat4(out, out, transform)

    const [x,y,z,w] = out


    geom.positions[i][0] = x
    geom.positions[i][1] = y
    geom.positions[i][2] = z
  }

  return geom
}
