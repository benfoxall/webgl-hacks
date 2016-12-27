
const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const ratio = window.devicePixelRatio || 1
canvas.width = window.innerWidth * ratio
canvas.height = window.innerHeight * ratio
canvas.style.width = '100%'

export const gl = canvas.getContext("webgl") ||
         canvas.getContext("experimental-webgl")

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



export const interleave = function(array, size, callback) {
  const chunk = array.slice(0,size)
  for (var i = 0; i < array.length; i += size) {
    callback(chunk, i / size)
    array.set(chunk, i)
  }

}


export const sendAttibutes = function(program, array, attrs, indices) {

  const length = attrs.reduce(function(memo, item) {
    return memo + item[1]
  }, 0)

  var buffer = gl.createBuffer()
  if (!buffer) throw new Error('Failed to create buffer.')
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW)

  attrs.reduce(function(memo, item) {

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
