precision highp float;

uniform float uAlpha;
uniform float uPosition;
uniform vec4 uResolution;
uniform float uTransition;
uniform sampler2D tMap;

varying vec2 vUv;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
  vec3 sub = vec3(oldValue, newMax, oldMax) - vec3(oldMin, newMin, oldMin);
  return sub.x * sub.y / sub.z + newMin;
}

float crange(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
  return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

vec2 displacement(vec2 uv) {
  float alpha = 0.0;
  float delay = 0.0;
  float value = 0.0;
  float x = uv.x;

  const float size = 1.0 / 4.0;

  for (float i = 0.0; i <= 1.0; i += size) {
    if (uv.x >= i && uv.x <= i + size) {
      float displacement = uv.x - 1.0;

      alpha = min(uTransition - delay, 1.0);
      x = mix(displacement, uv.x, cubicOut(alpha));
    }

    delay += 0.1;
    value += 1.0;
  }

  if (uPosition > 0.0) {
    alpha = min(uTransition * 1.1, 1.0);
    x = mix(uv.x - 1.0, uv.x, cubicOut(alpha));
  }

  if (x < 0.0 || x > 1.0) {
    discard;
  }

  return vec2(x, alpha);
}

void main()	{
  vec2 uv = (vUv - vec2(0.5)) * uResolution.zw + vec2(0.5);
  vec2 values = displacement(uv);

  uv.x = values.x;

  vec4 color = texture2D(tMap, uv);

  color.a *= uAlpha * values.y;

  gl_FragColor = color;
}
