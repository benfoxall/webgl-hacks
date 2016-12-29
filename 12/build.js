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

// shallow
var flatten = function (array) { return array.reduce( function (memo, item) { return memo.concat(item); }, [] ); }

var normalizeNd = normalize$1

function normalize$1(vec) {
  var mag = 0
  for (var n = 0; n < vec.length; n++) {
    mag += vec[n] * vec[n]
  }
  mag = Math.sqrt(mag)

  // avoid dividing by zero
  if (mag === 0) {
    return Array.apply(null, new Array(vec.length)).map(Number.prototype.valueOf, 0)
  }

  for (var n = 0; n < vec.length; n++) {
    vec[n] /= mag
  }

  return vec
}

var normalize = normalizeNd

var index$1 = icosphere

function icosphere(subdivisions) {
  subdivisions = +subdivisions|0

  var positions = []
  var faces = []
  var t = 0.5 + Math.sqrt(5) / 2

  positions.push([-1, +t,  0])
  positions.push([+1, +t,  0])
  positions.push([-1, -t,  0])
  positions.push([+1, -t,  0])

  positions.push([ 0, -1, +t])
  positions.push([ 0, +1, +t])
  positions.push([ 0, -1, -t])
  positions.push([ 0, +1, -t])

  positions.push([+t,  0, -1])
  positions.push([+t,  0, +1])
  positions.push([-t,  0, -1])
  positions.push([-t,  0, +1])

  faces.push([0, 11, 5])
  faces.push([0, 5, 1])
  faces.push([0, 1, 7])
  faces.push([0, 7, 10])
  faces.push([0, 10, 11])

  faces.push([1, 5, 9])
  faces.push([5, 11, 4])
  faces.push([11, 10, 2])
  faces.push([10, 7, 6])
  faces.push([7, 1, 8])

  faces.push([3, 9, 4])
  faces.push([3, 4, 2])
  faces.push([3, 2, 6])
  faces.push([3, 6, 8])
  faces.push([3, 8, 9])

  faces.push([4, 9, 5])
  faces.push([2, 4, 11])
  faces.push([6, 2, 10])
  faces.push([8, 6, 7])
  faces.push([9, 8, 1])

  var complex = {
      cells: faces
    , positions: positions
  }

  while (subdivisions-- > 0) {
    complex = subdivide(complex)
  }

  positions = complex.positions
  for (var i = 0; i < positions.length; i++) {
    normalize(positions[i])
  }

  return complex
}

// TODO: work out the second half of loop subdivision
// and extract this into its own module.
function subdivide(complex) {
  var positions = complex.positions
  var cells = complex.cells

  var newCells = []
  var newPositions = []
  var midpoints = {}
  var f = [0, 1, 2]
  var l = 0

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var c0 = cell[0]
    var c1 = cell[1]
    var c2 = cell[2]
    var v0 = positions[c0]
    var v1 = positions[c1]
    var v2 = positions[c2]

    var a = getMidpoint(v0, v1)
    var b = getMidpoint(v1, v2)
    var c = getMidpoint(v2, v0)

    var ai = newPositions.indexOf(a)
    if (ai === -1) { ai = l++, newPositions.push(a) }
    var bi = newPositions.indexOf(b)
    if (bi === -1) { bi = l++, newPositions.push(b) }
    var ci = newPositions.indexOf(c)
    if (ci === -1) { ci = l++, newPositions.push(c) }

    var v0i = newPositions.indexOf(v0)
    if (v0i === -1) { v0i = l++, newPositions.push(v0) }
    var v1i = newPositions.indexOf(v1)
    if (v1i === -1) { v1i = l++, newPositions.push(v1) }
    var v2i = newPositions.indexOf(v2)
    if (v2i === -1) { v2i = l++, newPositions.push(v2) }

    newCells.push([v0i, ai, ci])
    newCells.push([v1i, bi, ai])
    newCells.push([v2i, ci, bi])
    newCells.push([ai, bi, ci])
  }

  return {
      cells: newCells
    , positions: newPositions
  }

  // reuse midpoint vertices between iterations.
  // Otherwise, there'll be duplicate vertices in the final
  // mesh, resulting in sharp edges.
  function getMidpoint(a, b) {
    var point = midpoint(a, b)
    var pointKey = pointToKey(point)
    var cachedPoint = midpoints[pointKey]
    if (cachedPoint) {
      return cachedPoint
    } else {
      return midpoints[pointKey] = point
    }
  }

  function pointToKey(point) {
    return point[0].toPrecision(6) + ','
         + point[1].toPrecision(6) + ','
         + point[2].toPrecision(6)
  }

  function midpoint(a, b) {
    return [
        (a[0] + b[0]) / 2
      , (a[1] + b[1]) / 2
      , (a[2] + b[2]) / 2
    ]
  }
}

var vertex = "attribute vec3 aPosition;\nattribute vec2 aPhase;\nattribute vec3 aColor;\nuniform float uTime;\n\nvarying vec3 vColor;\n\nvoid main () {\n\n  float t = uTime * 20.0;\n\n  vec3 off = vec3(\n    sin(t + aPhase.x),\n    sin(t + aPhase.y),\n    0.0\n  ) * 0.02;\n\n  vec3 off2 = vec3(\n    sin(t + aPosition.x*2.0 + aPosition.y*3.0),\n    sin(t + aPosition.y + aPosition.x*4.0),\n    0.0\n  ) * 0.04;\n\n  gl_Position = vec4(aPosition+off+off2, 1.0);\n\n  vColor = aColor;\n\n}\n";

var fragment = "precision mediump float;\nvarying vec3 vColor;\n\nvoid main () {\n  gl_FragColor = vec4(\n    vColor.r,\n    vColor.g,\n    vColor.b,\n    0.9\n  );\n}\n";

gl.enable(gl.DEPTH_TEST)

var program = createProgram(vertex, fragment)

var mesh = index$1(2)

var n = mesh.positions.length

var data = new Float32Array(n * 8)

interleave(data, 8, function (chunk, i) {

  chunk[0] = mesh.positions[i][0] * 0.6
  chunk[1] = mesh.positions[i][1] * 0.6
  chunk[2] = mesh.positions[i][2] * 0.6

  // movement offset/phase
  chunk[3] = random(0, Math.PI*2)
  chunk[4] = random(0, Math.PI*2)

  // color
  chunk[5] = random(0.5, 1)
  chunk[6] = random(0.5, 1)
  chunk[7] = random(0.5, 1)

})


var indices = flatten(mesh.cells)

sendAttibutes(
  program, data,
  [
    ['aPosition', 3],
    ['aPhase', 2],
    ['aColor', 3]
  ],
  indices
)

var uTime = gl.getUniformLocation(program, 'uTime')

function render(t) {
  requestAnimationFrame(render)
  gl.uniform1f(uTime, t / 10000)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}

requestAnimationFrame(render)
//# sourceMappingURL=build.js.map
