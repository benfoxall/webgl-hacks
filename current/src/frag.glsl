precision mediump float;
varying vec4 vColor;

void main () {
  if(length(gl_PointCoord-vec2(0.5)) > 0.5)
    discard;

  gl_FragColor = vColor; //vec4(0.0,0.0,0.0,1.0);
}
