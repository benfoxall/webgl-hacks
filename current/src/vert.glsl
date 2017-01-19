attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform mat4 uTransform;
uniform mat4 uProjection;

varying vec3 vColor;

void main () {

  float t = uTime * 5.0;

  gl_Position = uProjection * uTransform * vec4(aPosition, 1.0);

  // this is a mistake, I'm miscalculating normals 
  vColor = aNormal;

}
