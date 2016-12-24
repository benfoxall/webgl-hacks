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

}
