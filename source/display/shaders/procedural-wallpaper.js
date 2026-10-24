export const WALLPAPER_EFFECTS = ['camera', 'contours', 'weave', 'arcs', 'diamonds', 'ripples', 'dots', 'chevrons', 'tunnel', 'raster', 'copper', 'twister']

export const vertexSource = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

export const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 resolution;
uniform vec2 viewport;
uniform vec2 offset;
uniform float phase;
uniform float effect;
uniform float nextEffect;
uniform float blend;
uniform float screenMode;
uniform float tileScale;
uniform vec3 cssC1;
uniform vec3 cssC2;
uniform vec3 cssC3;
uniform vec3 cssBase;
uniform vec3 cssAccent;
uniform vec3 cssInk;
uniform sampler2D logo;

float line(float distance, float width) {
  return 1.0 - smoothstep(width, width + 0.025, abs(distance));
}
float cameraLayer(vec2 p, float depth) {
  // Different depths move by different fractions of the cursor-driven offset.
  // Separate depth layers occupy separate rows, so logos never pile up.
  vec2 shifted = p + vec2(offset.x * depth * 0.18, 0.0);
  shifted.x += sin(phase * 0.3 + depth * 4.7) * 10.0;
  shifted.y -= depth * 300.0;
  vec2 cell = mod(shifted, vec2(144.0, 300.0));
  vec2 markLocal = cell - vec2(72.0, 50.0);
  float angle = sin(phase * 0.42 + depth * 4.7) * 0.028;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 markUV = rotation * markLocal / vec2(72.0, 60.0) + vec2(0.5);
  vec4 mark = texture2D(logo, clamp(markUV, 0.0, 1.0));
  float inside = step(0.0, markUV.x) * step(markUV.x, 1.0) * step(0.0, markUV.y) * step(markUV.y, 1.0);
  return mark.a * (1.0 - mark.r) * inside;
}
float camera(vec2 p) {
  float rear = cameraLayer(p, 0.0);
  float middle = cameraLayer(p, 0.3333333);
  float front = cameraLayer(p, 0.6666667);
  return rear * 0.65 + middle * 0.8 + front;
}
float pattern(vec2 p, float kind) {
  vec2 q = p / 96.0;
  vec2 tile = fract(q) - 0.5;
  if (kind < 0.5) return camera(p);
  if (kind < 1.5) {
    float contour = q.y + 0.20 * sin(q.x * 6.2831853);
    return line(sin(contour * 12.5663706), 0.12);
  }
  if (kind < 2.5) {
    float horizontal = line(sin(q.y * 12.5663706), 0.16);
    float vertical = line(sin(q.x * 12.5663706), 0.16);
    float alternate = mod(floor(q.x * 2.0) + floor(q.y * 2.0), 2.0);
    return mix(max(horizontal * 0.4, vertical), max(horizontal, vertical * 0.4), alternate);
  }
  if (kind < 3.5) {
    vec2 cell = fract(q);
    if (mod(floor(q.x) + floor(q.y), 2.0) > 0.5) cell.x = 1.0 - cell.x;
    return max(line(length(cell) - 0.5, 0.025), line(length(1.0 - cell) - 0.5, 0.025));
  }
  if (kind < 4.5) {
    float diamond = abs(tile.x) + abs(tile.y);
    return 0.5 * step(diamond, 0.5) + 0.5 * line(diamond - 0.5, 0.025);
  }
  if (kind < 5.5) return line(sin(length(tile) * 25.1327412), 0.13) * (1.0 - smoothstep(0.40, 0.50, length(tile)));
  if (kind < 6.5) {
    vec2 dots = q * 2.0;
    dots.x += mod(floor(dots.y), 2.0) * 0.5;
    float radius = 0.08 + 0.035 * sin(q.x * 3.1415927 + q.y * 3.1415927);
    return 1.0 - smoothstep(radius, radius + 0.03, length(fract(dots) - 0.5));
  }
  return line(sin((q.y + abs(tile.x)) * 12.5663706), 0.20);
}
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec3 sceneColour(vec2 p, float kind) {
  vec2 uv = p / viewport;
  // Every mode has a time-driven drift; the cursor adds parallax on top.
  // Sine/cosine keeps the motion continuous when phase wraps.
  vec2 drift = vec2(sin(phase) * 24.0, cos(phase) * 17.0);
  vec3 dark = cssBase;
  vec3 warm = cssC2;
  vec3 bright = cssAccent;
  if (kind < 1.5) {
    // Layered parallax starfield, with three depths moving at different rates.
    vec3 colour = dark;
    for (int layer = 0; layer < 3; layer++) {
      float depth = float(layer + 1);
      vec2 layerPosition = p + drift * (0.35 + depth * 0.16) + offset * depth * 0.18;
      vec2 grid = floor(layerPosition / (52.0 + depth * 30.0));
      vec2 local = fract(layerPosition / (52.0 + depth * 30.0)) - 0.5;
      float star = 1.0 - smoothstep(0.0, 0.055 / depth, length(local - (vec2(hash21(grid), hash21(grid + vec2(7.0))) - vec2(0.5)) * 0.65));
      colour += mix(warm, bright, hash21(grid + vec2(19.0))) * star * (0.16 / depth);
    }
    return colour;
  }
  if (kind < 2.5) {
    // Slowly moving plasma made from several coherent fields.
    float t = phase * 0.35;
    float field = sin(p.x * 0.010 + sin(p.y * 0.008 + t) * 2.0 + t);
    field += sin(p.y * 0.013 - cos(p.x * 0.006 - t) * 2.0 - t);
    field += sin((p.x + p.y) * 0.008 + t * 1.7);
    float amount = 0.5 + 0.166 * field;
    return mix(dark, mix(warm, bright, amount), amount * 0.55);
  }
  if (kind < 3.5) {
    // Orbiting arcs with depth and a soft centre glow.
    vec2 centre = viewport * (vec2(0.5) + 0.12 * vec2(sin(phase * 0.4), cos(phase * 0.31)));
    vec2 delta = p - centre - offset * 0.25;
    float radius = length(delta);
    float rings = 0.5 + 0.5 * sin(radius * 0.035 - phase * 1.2 + atan(delta.y, delta.x) * 2.0);
    float arc = smoothstep(0.78, 1.0, rings) * (0.4 + 0.6 * (1.0 - smoothstep(40.0, 620.0, radius)));
    return mix(dark, mix(warm, bright, rings), arc * 0.48);
  }
  if (kind < 4.5) {
    // A deep-space nebula built from domain-warped fields.
    vec2 q = (p + offset * 0.35) * 0.006;
    float n = sin(q.x + sin(q.y * 1.7 + phase * 0.2)) + sin(q.y * 1.3 - cos(q.x * 1.2 - phase * 0.17));
    n = 0.5 + 0.25 * n;
    float glow = smoothstep(0.15, 0.9, n) * (0.45 + 0.55 * sin(q.x * 2.0 + q.y * 1.4));
    return mix(dark, mix(warm, bright, n), glow * 0.42);
  }
  if (kind < 5.5) {
    // Fine ripples that respond strongly to cursor offset.
    vec2 centre = viewport * 0.5 + offset * 0.65;
    float radius = length(p - centre);
    float ripple = smoothstep(0.92, 1.0, 0.5 + 0.5 * sin(radius * 0.045 - phase * 1.5));
    return mix(dark, bright, ripple * 0.34);
  }
  if (kind < 6.5) {
    // Drifting particle lanes with a subtle depth gradient.
    vec2 q = (p + offset * 0.45) / 74.0;
    vec2 cell = floor(q);
    vec2 local = fract(q) - 0.5;
    float particle = 1.0 - smoothstep(0.0, 0.09, length(local - vec2(sin(hash21(cell) * 6.28 + phase), cos(hash21(cell + vec2(3.0)) * 6.28 + phase)) * 0.22));
    return mix(dark, warm, particle * 0.52);
  }
  if (kind < 7.5) {
    // A restrained animated chevron field, retaining the original angular language.
    float chevron = 0.5 + 0.5 * sin((p.x + abs(p.y - viewport.y * 0.5)) * 0.018 - phase * 0.8);
    return mix(dark, mix(warm, bright, chevron), smoothstep(0.62, 0.98, chevron) * 0.38);
  }
  if (kind < 8.5) {
    // Amiga tunnel: polar coordinates turn concentric rings into a receding tunnel.
    vec2 centre = viewport * 0.5 + offset * 0.20;
    vec2 delta = p - centre;
    float radius = max(length(delta), 2.0);
    float angle = atan(delta.y, delta.x);
    float tunnel = 0.5 + 0.5 * sin(16.0 / radius - phase * 1.4 + angle * 7.0);
    float spokes = smoothstep(0.74, 1.0, 0.5 + 0.5 * sin(angle * 12.0 + phase * 0.35));
    float glow = (0.25 + 0.75 * (1.0 - smoothstep(30.0, 680.0, radius))) * (0.35 + 0.65 * tunnel);
    return mix(dark, mix(warm, bright, spokes), glow * 0.62);
  }
  if (kind < 9.5) {
    // Copper-style raster bars sweep across the screen at different speeds.
    float y = p.y + offset.y * 0.12;
    float barA = smoothstep(0.98, 1.0, 0.5 + 0.5 * sin(y * 0.030 - phase * 1.8));
    float barB = smoothstep(0.98, 1.0, 0.5 + 0.5 * sin(y * 0.047 + phase * 1.25 + sin(p.x * 0.008)));
    float edge = 0.5 + 0.5 * sin(p.x * 0.012 + phase * 0.3);
    return mix(dark, mix(warm, bright, edge), (barA * 0.42 + barB * 0.24));
  }
  if (kind < 10.5) {
    // Layered copper bars with a soft phosphor trail, inspired by scanline demos.
    float scan = 0.5 + 0.5 * sin((p.y + offset.y * 0.22) * 0.022 - phase * 1.1);
    float bands = smoothstep(0.66, 0.98, 0.5 + 0.5 * sin(p.y * 0.055 + sin(p.x * 0.009 + phase) * 2.2 - phase * 1.7));
    vec3 copper = mix(warm, bright, 0.5 + 0.5 * sin(p.x * 0.006 + phase * 0.22));
    return mix(dark, copper, (bands * 0.48 + scan * 0.12));
  }
  // Twister: rotating vertical ribbons made from a warped sine field.
  vec2 q = (p - viewport * 0.5 - offset * 0.28) * 0.012;
  float twist = sin(q.x * 7.0 + sin(q.y * 2.0 + phase) * 2.4 + phase * 0.8);
  float ribbon = smoothstep(0.78, 1.0, 0.5 + 0.5 * twist);
  float shade = 0.5 + 0.5 * sin(q.y * 4.0 + twist * 2.0);
  return mix(dark, mix(warm, bright, shade), ribbon * 0.50);
}
vec4 bandStops(float t, vec3 c1, vec3 c2, vec3 c3) {
  if (t < 0.10) return vec4(c1, 1.0);
  if (t < 0.105) return vec4(mix(c1, c2, (t - 0.10) / 0.005), 1.0);
  if (t < 0.19) return vec4(c2, 1.0);
  if (t < 0.195) return vec4(c2, 1.0 - (t - 0.19) / 0.005);
  if (t < 0.805) return vec4(0.0);
  if (t < 0.81) return vec4(c2, (t - 0.805) / 0.005);
  if (t < 0.895) return vec4(c2, 1.0);
  if (t < 0.90) return vec4(mix(c2, c3, (t - 0.895) / 0.005), 1.0);
  return vec4(c3, 1.0);
}
vec4 diagonalLayer(vec2 p, vec2 tile, float angle, vec2 position, vec3 c1, vec3 c2, vec3 c3) {
  vec2 local = fract((p - position) / tile) * tile - tile * 0.5;
  vec2 direction = vec2(sin(angle), -cos(angle));
  float gradientLength = abs(tile.x * direction.x) + abs(tile.y * direction.y);
  float t = dot(local, direction) / gradientLength + 0.5;
  return bandStops(clamp(t, 0.0, 1.0), c1, c2, c3);
}
vec4 conicLayer(vec2 p, vec2 tile, vec2 position, vec3 colour, float cssStart) {
  vec2 local = fract((p - position) / tile) - vec2(0.375, 0.5);
  float standardStart = cssStart - 1.5707963;
  float turn = fract((atan(local.y, local.x) - standardStart) / 6.2831853);
  return vec4(colour, smoothstep(0.745, 0.755, turn));
}
vec4 over(vec4 under, vec4 top) { return vec4(mix(under.rgb, top.rgb, top.a), 1.0); }
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 pixel = vec2(uv.x, 1.0 - uv.y) * viewport;
  // The original tiled patterns also move continuously without requiring input.
  // Bounded sinusoidal drift avoids a discontinuity when phase wraps, regardless
  // of the active tile size or wallpaper mode.
  vec2 phaseDrift = vec2(sin(phase) * 96.0, cos(phase) * 80.0);
  vec2 p = pixel - offset - phaseDrift;
  if (screenMode > 0.5) {
    if (effect > 0.5) {
      gl_FragColor = vec4(sceneColour(p, effect), 1.0);
      return;
    }
    vec2 tile = vec2(tileScale, tileScale * 0.6666667);
    vec2 vertical = fract((p - vec2(tile.x, 0.0)) / tile);
    vec3 verticalColour = cssC3;
    verticalColour = mix(verticalColour, cssC1, step(0.38, vertical.x));
    verticalColour = mix(verticalColour, cssC3, step(0.50, vertical.x));
    verticalColour = mix(verticalColour, cssC1, step(0.62, vertical.x));
    vec4 colour = vec4(verticalColour, 1.0);
    colour = over(colour, conicLayer(p, tile, vec2(tile.x * 0.5, 0.0), cssC3, -1.5708));
    colour = over(colour, conicLayer(p, tile, vec2(tile.x * 0.125, 0.0), cssC1, -1.5708));
    colour = over(colour, diagonalLayer(p, tile, 0.6109, vec2(tile.x * 0.5, tileScale), cssC1, cssC2, cssC3));
    colour = over(colour, diagonalLayer(p, tile, 0.6109, vec2(tile.x, 0.0), cssC1, cssC2, cssC3));
    colour = over(colour, diagonalLayer(p, tile, 2.5307, vec2(tile.x * 0.5, tileScale), cssC1, cssC2, cssC3));
    colour = over(colour, diagonalLayer(p, tile, 2.5307, vec2(tile.x, 0.0), cssC1, cssC2, cssC3));
    gl_FragColor = colour;
    return;
  }
  // The loading wallpaper is always the camera. Contrast gradients belong to CSS.
  float ink = camera(p);
  vec3 colour = mix(cssBase, cssInk, ink * 0.22);
  gl_FragColor = vec4(colour, 1.0);
}
`
