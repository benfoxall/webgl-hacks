
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
