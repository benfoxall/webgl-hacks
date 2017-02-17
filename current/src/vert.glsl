attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 uTransform;
uniform mat4 uProjection;
uniform mat4 uMVP;

varying vec3 vColor;

vec3 light = vec3(0.1,0.2,0.3);

void main () {

  gl_Position = uMVP * uTransform * vec4(aPosition, 1.0);

  vec4 normal = uTransform * vec4(aNormal, 1.0);

  vColor = aColor + max(dot(normal.xyz, light), 0.0);

}
