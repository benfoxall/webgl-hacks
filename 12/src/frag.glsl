precision mediump float;
varying vec3 vColor;

void main () {
  gl_FragColor = vec4(
    vColor.r,
    vColor.g,
    vColor.b,
    0.9
  );
}
