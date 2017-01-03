attribute vec3 aPosition;
attribute vec2 aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform mat4 uTransform;

varying vec3 vColor;

void main () {

  float t = uTime * 5.0;

  vec3 off = vec3(
    sin(t + aPhase.x),
    sin(t + aPhase.y),
    0.0
  ) * 0.001;

  vec3 off2 = vec3(
    sin(t + aPosition.x*2.0 + aPosition.y*3.0),
    sin(t + aPosition.y + aPosition.x*4.0),
    0.0
  ) * 0.05;

  vec3 pos = aPosition+off+off2;

  gl_Position = uTransform * vec4(pos, 1.0);

  // kind of light shading stuff
  vColor = dot(pos, vec3(0.0,1.0,0.0)) * vec3(1.0,1.0,1.0);

  // this looks way cooler
  vColor.r *= pos.x;
  vColor.g *= pos.z;

}
