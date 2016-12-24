var canvas = document.createElement('canvas')
document.body.appendChild(canvas)

var ratio = window.devicePixelRatio || 1
canvas.width = window.innerWidth * ratio
canvas.height = window.innerHeight * ratio
canvas.style.width = '100%'


var gl = canvas.getContext("webgl") ||
         canvas.getContext("experimental-webgl")

if (!gl) throw new Error("WebGL unavailable")

// shader compiler
function compile(gl, type, source) {

  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader))

  return shader
}

var vertexShader = compile(gl, gl.VERTEX_SHADER, `
  attribute vec2 aPosition;
  attribute vec2 aVelocity;
  uniform float uTime;

  void main () {

    gl_Position = vec4(
      (mod(aPosition + aVelocity * uTime, 1.0) * 2.2)
      - vec2(1.1, 1.1)
      ,
      0.0,1.0
    );

    gl_PointSize = (
      sin(
        uTime * 10.0 +
        aVelocity.x * 20.0 +
        aVelocity.y * 10.0 +

        gl_Position.x * 0.4 -
        gl_Position.y * 0.4
      ) + 0.8) * 3.0;

  }`)

var fragmentShader = compile(gl, gl.FRAGMENT_SHADER, `
  precision mediump float;

  void main () {

    if(length(gl_PointCoord-vec2(0.5)) > 0.5)
      discard;

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }`
)

var program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program))
}

gl.useProgram(program)

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
