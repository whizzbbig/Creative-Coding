precision highp float;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec2 uArea;
uniform float uSpeed;

varying vec2 vUv;

float parabola(float x, float k) {
  return pow(4.0 * x * (1.0 - x), k);
}

void main() {
  vUv = uv;

  vec4 ndc = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vec2 screen = (ndc.xy / ndc.w) * 0.5 + 0.5;
  screen.x = clamp(screen.x, 0.0, 1.0);
  screen.y = clamp(screen.y, 0.0, 1.0);

  vec3 pos = position;
  float speed = uSpeed;

  float x = uArea.x < 768.0 ? 1.0 : 3.0;

  pos.z += mix(0.0, parabola(screen.x, x), speed);
  pos.z += mix(0.0, parabola(screen.y, 1.0), speed);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
