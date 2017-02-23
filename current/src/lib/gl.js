import {Stats} from './stats.js'

export const canvas = document.createElement('canvas')
document.body.appendChild(canvas)


export const gl = canvas.getContext("webgl") ||
         canvas.getContext("experimental-webgl")


const renderRatio = ratio => {
  canvas.width = window.innerWidth * ratio
  canvas.height = window.innerHeight * ratio

  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'

  gl.viewport(0, 0, canvas.width, canvas.height)
}

renderRatio(window.devicePixelRatio || 1)


// shader compiler
export const compile = function(gl, type, source) {

  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader))

  return shader
}



export const createProgram = function(vertex, fragment) {

  var vertexShader = compile(gl, gl.VERTEX_SHADER, vertex)
  var fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment)

  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program))
  }

  gl.useProgram(program)

  return program
}


export const generateBuffer = (array, callback) => {

  for (var i = 0; i < array.length; i++)
    array[i] = callback(i)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW)

  return buffer

}


export const interleave = function(array, size, callback) {
  const chunk = array.slice(0,size)
  for (var i = 0; i < array.length; i += size) {
    callback(chunk, i / size)
    array.set(chunk, i)
  }

}


export const sendAttibutes = function(program, array, attrs, indices) {

  // the stride of the interleve
  const length = attrs.reduce(
    (memo, item) => memo + item[1]
  , 0)

  var buffer = gl.createBuffer()
  if (!buffer) throw new Error('Failed to create buffer.')
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW)

  attrs.reduce((memo, item) => {

    var location = gl.getAttribLocation(program, item[0])

    gl.vertexAttribPointer(
      location,
      item[1],
      gl.FLOAT,
      gl.FALSE,
      Float32Array.BYTES_PER_ELEMENT * length,
      Float32Array.BYTES_PER_ELEMENT * memo)
    gl.enableVertexAttribArray(location)


    return memo + item[1]
  }, 0)

  if(indices) {
    var iBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
  }

}


export const loop = fn => {
  const render = (time) => {
    requestAnimationFrame(render)
    fn(time)
  }
  requestAnimationFrame(render)
}



export const loopStats = fn => {
  const stats = new Stats
  stats.showPanel(0)
  document.body.appendChild(stats.dom)


  const render = (time) => {
    requestAnimationFrame(render)
    stats.begin()
    fn(time)
    stats.end()
  }
  requestAnimationFrame(render)
}


export const loopProtected = fn => {

  // Track slow frames
  const SLOW_THRESHOLD = 1000 / 30
  const MAX_FRAMES = 8

  let slow_frame_count = -1
  let last_time = 0
  let applied = false

  const applyFix = () => {
    console.warn('slow frames detected, lowering render ratio')
    renderRatio(0.75)
    applied = true
  }


  const detectSlowness = (time) => {
    if(applied) return

    if(time - last_time > SLOW_THRESHOLD) {
      slow_frame_count ++
    } else {
      slow_frame_count = 0
    }

    if(slow_frame_count > MAX_FRAMES) {
      applyFix()
    }

    last_time = time
  }




  const render = (time) => {
    requestAnimationFrame(render)
    fn(time)
    detectSlowness(time)
  }
  requestAnimationFrame(render)



}
