var canvas = document.createElement('canvas')
document.body.appendChild(canvas)

var ratio = window.devicePixelRatio || 1
canvas.width = window.innerWidth * ratio
canvas.height = window.innerHeight * ratio
canvas.style.width = '100%'

var gl = canvas.getContext("webgl") ||
         canvas.getContext("experimental-webgl")

// shader compiler
var compile = function(gl, type, source) {

  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    { throw new Error(gl.getShaderInfoLog(shader)) }

  return shader
}



var createProgram = function(vertex, fragment) {

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



var interleave = function(array, size, callback) {
  var chunk = array.slice(0,size)
  for (var i = 0; i < array.length; i += size) {
    callback(chunk, i / size)
    array.set(chunk, i)
  }

}


var sendAttibutes = function(program, array, attrs, indices) {

  var length = attrs.reduce(function(memo, item) {
    return memo + item[1]
  }, 0)

  var buffer = gl.createBuffer()
  if (!buffer) { throw new Error('Failed to create buffer.') }
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

var scale = function (a, b) { return function (n) { return n * (b - a) + a; }; }

var random = function (a, b) { return scale(a,b)(Math.random()); }

var vertex = "attribute vec2 aPosition;\nattribute vec2 aPhase;\nattribute vec3 aColor;\nuniform float uTime;\n\nvarying vec3 vColor;\n\nvoid main () {\n\n  float t = uTime * 20.0;\n\n  vec2 off = vec2(\n    sin(t + aPhase.x),\n    sin(t + aPhase.y)\n  ) * 0.02;\n\n  vec2 off2 = vec2(\n    sin(t + aPosition.x*2.0 + aPosition.y*3.0),\n    sin(t + aPosition.y + aPosition.x*4.0)\n  ) * 0.04;\n\n  gl_Position = vec4(aPosition+off+off2, 0.0, 1.0);\n\n  vColor = aColor;\n\n}\n";

var fragment = "precision mediump float;\nvarying vec3 vColor;\n\nvoid main () {\n  gl_FragColor = vec4(\n    vColor.r,\n    vColor.g,\n    vColor.b,\n    1.0\n  );\n}\n";

var program = createProgram(vertex, fragment)

var rows = 50
var cols = 50
var n = rows * cols

var data = new Float32Array(n * 7)

interleave(data, 7, function (chunk, i) {
  var x = i % cols
  var y = (i / cols) | 0

  chunk[0] = ((x/cols) - .5) * 1.5
  chunk[1] = ((y/rows) - .5) * 1.5

  // movement offset/phase
  chunk[2] = random(0, Math.PI*2)
  chunk[3] = random(0, Math.PI*2)

  // color
  chunk[4] = random(0.5, 1)
  chunk[5] = random(0.5, 1)
  chunk[6] = random(0.5, 1)

})


var indices = []

for (var x = 0; x < cols - 1; x++) {
  for (var y = 0; y < rows - 1; y++) {

    indices.push(
      x +     y * cols,
      x + 1 + y * cols
    )

    indices.push(
      x +     y * cols,
      x + 1 + (y+1) * cols
    )

  }
}

sendAttibutes(
  program, data,
  [
    ['aPosition', 2],
    ['aPhase', 2],
    ['aColor', 3]
  ],
  indices
)


var uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)

  gl.uniform1f(uTime, t / 10000)
  gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0)
}

requestAnimationFrame(render)
//# sourceMappingURL=build.js.map
