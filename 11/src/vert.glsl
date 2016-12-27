attribute vec2 aPosition;
attribute vec2 aPhase;
attribute vec3 aColor;
uniform float uTime;

varying vec3 vColor;

void main () {

  float t = uTime * 20.0;

  vec2 off = vec2(
    sin(t + aPhase.x),
    sin(t + aPhase.y)
  ) * 0.02;

  vec2 off2 = vec2(
    sin(t + aPosition.x*2.0 + aPosition.y*3.0),
    sin(t + aPosition.y + aPosition.x*4.0)
  ) * 0.04;

  gl_Position = vec4(aPosition+off+off2, 0.0, 1.0);

  vColor = aColor;

}
