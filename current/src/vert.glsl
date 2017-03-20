attribute vec3 aPosition;
uniform mat4 uMVP;
uniform float uTime;
varying vec4 vColor;
varying float vRadius;
uniform vec3 uPosePosition;

float s = 3.0;

void main () {

  vec3 position = aPosition + aPosition * (uTime+100000.0)/250000.0;

  // 1. find a target.
  vec3 target = uPosePosition;

  // 2. gather points around target.
  position = mod(
    (position * s) - target, vec3(1.0,1.0,1.0) * s
  ) - vec3(0.5,0.5,0.5) * s;

  float r = length(position) / s;

  position += target;


  gl_Position = uMVP * vec4(position, 1.0);


  float size = 50.0;

  // only show points 0.3 to 0.5 away
  float a = 0.3;
  float b = 0.5;

  r = clamp(r, a, b);
  size *= sin(
    (r - a) / (b - a) * 3.14
  );


  // animate the size
  float s = sin(
    gl_Position.y + uTime/1500.0
  );


  float red = (sin(
    position.y + uTime/5000.0 + 2.0
  ) + 1.0) / 2.0;

  float green = (sin(
    position.x + uTime/5000.0 + 4.0
  ) + 1.0) / 2.0;

  float blue = (sin(
    position.z + uTime/5000.0 + 6.0
  ) + 1.0) / 2.0;




  // size *= (clamp(s, 0.5, 0.7) + 1.0);

  // vColor = vec4(s,1.0-s,1.0,0.8);
  vColor = vec4(red, green, blue,0.8);

  float pSize = 1.0/length(gl_Position);
  gl_PointSize = size * pSize;

  vRadius = r;

}
