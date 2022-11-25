precision highp float;

uniform float uTransition;
uniform sampler2D tMap;
uniform sampler2D tMask;

varying vec2 vUv;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
  vec3 sub = vec3(oldValue, newMax, oldMax) - vec3(oldMin, newMin, oldMin);
  return sub.x * sub.y / sub.z + newMin;
}

vec2 range(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
  vec2 oldRange = oldMax - oldMin;
  vec2 newRange = newMax - newMin;
  vec2 val = oldValue - oldMin;
  return val * newRange / oldRange + newMin;
}

vec3 range(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
  vec3 oldRange = oldMax - oldMin;
  vec3 newRange = newMax - newMin;
  vec3 val = oldValue - oldMin;
  return val * newRange / oldRange + newMin;
}

float crange(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
  return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

vec2 crange(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
  return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

vec3 crange(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
  return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

float rangeTransition(float t, float x, float padding) {
  float transition = crange(t, 0.0, 1.0, -padding, 1.0 + padding);
  return crange(x, transition - padding, transition + padding, 1.0, 0.0);
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

vec2 displacement(vec2 uv) {
  float alpha = 0.0;
  float value = 0.0;
  float x = uv.x;

  float delay = texture2D(tMask, uv).r;

  const float size = 1.0 / 4.0;

  for (float i = 0.0; i <= 1.0; i += size) {
    if (uv.x >= i && uv.x <= i + size) {
      float displacement = uv.x - crange(value, 0.0, 3.0, 1.0, 0.5);

      alpha = crange(uTransition - delay * 0.75, 0.0, 1.0, 0.0, 1.0);
      x = mix(displacement, uv.x, cubicOut(alpha));
    }

    value += 1.0;
  }

  if (x < 0.0 || x > 1.0) {
    discard;
  }

  return vec2(x, alpha);
}

void main()	{
  vec2 uv = vUv;
  vec2 values = displacement(uv);

  uv.x = values.x;

  vec4 color = texture2D(tMap, uv);

  color.a *= values.y;

  gl_FragColor = color;
}
