const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const ratio = window.devicePixelRatio || 1
canvas.width = window.innerWidth * ratio
canvas.height = window.innerHeight * ratio
canvas.style.width = '100%'

const gl = canvas.getContext("webgl") ||
         canvas.getContext("experimental-webgl")

// shader compiler
const compile = function(gl, type, source) {

  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader))

  return shader
}



const createProgram = function(vertex, fragment) {

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



const interleave = function(array, size, callback) {
  const chunk = array.slice(0,size)
  for (var i = 0; i < array.length; i += size) {
    callback(chunk, i / size)
    array.set(chunk, i)
  }

}


const sendAttibutes = function(program, array, attrs) {

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

}

var vertex = "attribute vec2 aPosition;\nattribute vec2 aVelocity;\nuniform float uTime;\n\nvoid main () {\n\n  gl_Position = vec4(\n    (mod(aPosition + aVelocity * uTime, 1.0) * 2.2)\n    - vec2(1.1, 1.1)\n    ,\n    0.0,1.0\n  );\n\n  gl_PointSize = (\n    sin(\n      uTime * 10.0 +\n      aVelocity.x * 20.0 +\n      aVelocity.y * 10.0 +\n\n      gl_Position.x * 0.4 -\n      gl_Position.y * 0.4\n    ) + 0.8) * 3.0;\n\n}\n";

var fragment = "precision mediump float;\n\nvoid main () {\n\n  if(length(gl_PointCoord-vec2(0.5)) > 0.5)\n    discard;\n\n  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n";

const program = createProgram(vertex, fragment)

var n = 10000

var data = new Float32Array(n * 4)

interleave(data, 4, function(chunk) {
  chunk[0] = Math.random()
  chunk[1] = Math.random()

  chunk[2] = (Math.random() - 0.5) / 10
  chunk[3] = (Math.random() - 0.5) / 10
})

sendAttibutes(
  program, data,
  [
    ['aPosition', 2],
    ['aVelocity', 2]
  ]
)

var uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)

  gl.uniform1f(uTime, t/10000)
  gl.drawArrays(gl.POINTS, 0, n)

}

requestAnimationFrame(render)
