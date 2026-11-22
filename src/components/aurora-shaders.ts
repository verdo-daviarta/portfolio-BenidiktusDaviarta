export const auroraVertexShader = /* glsl */ `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const auroraFragmentShader = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform vec2 u_resolution;
uniform float u_interaction;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 19.19);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), w.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), w.x),
    w.y
  );
}

float fbm(vec2 p) {
  mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
  return 0.62 * noise(p)
       + 0.28 * noise(turn * p + 7.3)
       + 0.10 * noise(turn * turn * p + 12.1);
}

float field(vec2 p, vec2 center, vec2 spread, float tilt) {
  vec2 d = p - center;
  d.y += tilt * d.x;
  d /= spread;
  return exp(-dot(d, d));
}

vec2 auroraFlow(vec2 uv, float time) {
  vec2 alongVeil = vec2(uv.x + 0.42 * uv.y, uv.y - 0.26 * uv.x);
  float swell = fbm(alongVeil * vec2(1.75, 2.10)
    + vec2(0.082, -0.057) * time + vec2(7.6, 3.5)) - 0.5;

  // The slower swell bends a tighter, counterflowing layer into soft folds.
  float folds = fbm(alongVeil * vec2(2.55, 4.05)
    + vec2(0.82, -0.95) * swell
    + vec2(-0.072, 0.106) * time + vec2(42.3, 17.2)) - 0.5;
  return vec2(swell, folds);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 flow = auroraFlow(uv, u_time);
  float swell = flow.x;
  float folds = flow.y;
  vec2 warp = vec2(0.24 * swell + 0.14 * folds, -0.27 * swell + 0.37 * folds);

  // A broad current bends the fields toward the pointer without lighting it.
  vec2 cursorOffset = uv - u_mouse;
  vec2 aspectOffset = cursorOffset * vec2(
    clamp(u_resolution.x / u_resolution.y, 0.65, 2.0), 1.0
  );
  float reach = 1.0 / (1.0 + 1.8 * dot(aspectOffset, aspectOffset));
  vec2 current = (u_mouse - 0.5) * 0.07 + u_velocity * 0.105;
  vec2 p = uv + warp * (1.0 + 0.48 * u_interaction)
              - current * reach * u_interaction;

  // Each color stretches differently so the blend changes shape as it moves.
  float veil = smoothstep(-0.34, 0.34, folds + 0.30 * swell);
  float indigo = field(p + vec2(-0.10, 0.10) * swell,
    vec2(0.27, 0.71), vec2(0.52, 0.40), 0.30) * (0.86 + 0.14 * veil);
  float wine = field(p - vec2(0.11, 0.16) * folds,
    vec2(1.02, 0.84), vec2(0.45, 0.47), 0.70);
  float violet = field(p + vec2(0.08, -0.29) * swell,
    vec2(0.89, 0.27), vec2(0.38, 0.44), -0.24) * (1.0 - 0.16 * veil);
  float navy = field(p, vec2(0.50, 0.44), vec2(0.58, 0.60), 0.10);

  vec3 color = vec3(0.006, 0.005, 0.018);
  color += vec3(0.009, 0.010, 0.080) * indigo;
  color += vec3(0.263, 0.010, 0.047) * wine;
  color += vec3(0.077, 0.011, 0.131) * violet;
  color += vec3(0.005, 0.005, 0.024) * navy;

  // Sub-quantization dither softens 8-bit color bands without visible grain.
  float dither = fract(dot(gl_FragCoord.xy, vec2(0.7548777, 0.5698403))) - 0.5;
  gl_FragColor = vec4(color + dither / 255.0, 1.0);
}
`;
