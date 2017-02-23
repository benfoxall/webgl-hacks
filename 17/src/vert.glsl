attribute vec3 aPosition;
uniform mat4 uMVP;
uniform float uTime;
varying vec4 vColor;


vec3 target = vec3(0.0,0.0,-2.0);

float PI = 3.1415;

void main () {

  vec3 position = aPosition + uTime/30000.0;

  position = mod(position, vec3(1.0,1.0,1.0)) - vec3(0.5,0.5,0.5);
  float centralness = length(position);

  position *= 2.0;

  vec4 wrapped = vec4(position + target, 1.0);

  gl_Position = uMVP * wrapped;


  // pink
  float size = 30.0;
  vColor = vec4(1.0,0.0,0.5,0.4);


  // green
  if(centralness > 0.5) {
    size = 15.0;
    vColor = vec4(0.2,1.0,0.2,0.3);
  }

  // blue
  if(centralness < 0.25) {
    size = 90.0;
    vColor = vec4(0.0,1.0,1.0,1.0);
  }

  size = size * cos(centralness * PI * 5.0);

  // float wave = max(1.0,
  //   (sin(-uTime * 0.0005 + aPosition.y * 0.85) + 0.5)
  //    * 60.0
  // );
  // gl_PointSize = 5.0 * wave * focus * 1.0/distance;

  float pSize = 1.0/length(gl_Position);
  gl_PointSize = size * pSize;


}
