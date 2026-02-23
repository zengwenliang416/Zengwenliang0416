export const noiseVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const noiseFragment = /* glsl */ `
uniform float u_time;
uniform float u_opacity;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = vUv;
  float t = u_time * 0.15;
  float n1 = snoise(vec3(uv * 1.5, t)) * 0.5 + 0.5;
  float n2 = snoise(vec3(uv * 2.5 + 100.0, t * 0.8)) * 0.5 + 0.5;
  float n3 = snoise(vec3(uv * 0.8 + 200.0, t * 1.2)) * 0.5 + 0.5;
  vec3 color = mix(u_color1, u_color2, n1);
  color = mix(color, u_color3, n2 * 0.5);
  float vignette = 1.0 - length((uv - 0.5) * 1.5);
  vignette = smoothstep(0.0, 0.7, vignette);
  gl_FragColor = vec4(color * vignette, u_opacity * (n3 * 0.3 + 0.7));
}
`;

export const distortionVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const distortionFragment = /* glsl */ `
uniform sampler2D u_texture;
uniform float u_hover;
uniform float u_time;
uniform vec2 u_mouse;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise2(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = vUv;
  float dist = length(uv - u_mouse);
  float strength = u_hover * smoothstep(0.5, 0.0, dist);
  float n = snoise2(vec3(uv * 5.0, u_time * 0.5));
  vec2 distortion = vec2(n) * strength * 0.03;
  vec2 displaced = uv + distortion;
  float rgbShift = strength * 0.01;
  float r = texture2D(u_texture, displaced + vec2(rgbShift, 0.0)).r;
  float g = texture2D(u_texture, displaced).g;
  float b = texture2D(u_texture, displaced - vec2(rgbShift, 0.0)).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

/**
 * GPGPU-driven instanced mesh vertex shader.
 * Reads particle position from simulation texture.
 * Matches Lusion's approach: sim texture lookup per instance.
 */
export const instanceVertex = /* glsl */ `
attribute float instanceIndex;
attribute float instanceScale;
attribute float instanceEmissive;

uniform sampler2D u_simTexture;
uniform vec2 u_simSize;
uniform float u_time;
uniform float u_scroll;

varying vec3 v_normal;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying float v_emissive;
varying float v_scrollFade;
varying float v_dist;

void main() {
  // Convert instance index to simulation texture UV
  float x = mod(instanceIndex, u_simSize.x);
  float y = floor(instanceIndex / u_simSize.x);
  vec2 simUV = (vec2(x, y) + 0.5) / u_simSize;

  vec4 posLife = texture2D(u_simTexture, simUV);
  vec3 worldOffset = posLife.xyz;
  float phase = posLife.w;

  // Gentle scroll parallax (cloud stays centered, subtle vertical drift)
  worldOffset.y += u_scroll * 0.15;

  float size = mix(0.08, 0.22, instanceEmissive) * instanceScale;

  vec3 pos = position * size + worldOffset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  v_normal = normalize(normalMatrix * normal);
  v_viewNormal = normalize((modelViewMatrix * vec4(normal, 0.0)).xyz);
  v_worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  v_emissive = instanceEmissive;
  // Gentle fade: never below 0.45, full range over 8 screens
  v_scrollFade = mix(1.0, 0.45, smoothstep(0.0, 8.0, u_scroll));
  v_dist = length(worldOffset - vec3(0.0, 0.6, 0.0));
}
`;

/**
 * Matcap-enhanced instanced mesh fragment shader.
 * Combines hemisphere lighting with matcap lookup for richer shading.
 * Approximates Lusion's lightField-based approach.
 */
export const instanceFragment = /* glsl */ `
varying vec3 v_normal;
varying vec3 v_worldPos;
varying vec3 v_viewNormal;
varying float v_emissive;
varying float v_scrollFade;
varying float v_dist;

uniform sampler2D u_matcap;

void main() {
  vec3 n = normalize(v_normal);
  vec3 vn = normalize(v_viewNormal);

  // Matcap lookup: view-space normal → UV
  vec2 matcapUV = vn.xy * 0.5 + 0.5;
  vec3 matcapColor = texture2D(u_matcap, matcapUV).rgb;

  // Hemisphere light
  vec3 lightDir = normalize(vec3(0.0, 0.8, 0.6));
  float diff = dot(n, lightDir) * 0.5 + 0.5;

  // Lusion linearStep(-1, 1, dot(viewNormal, vec3(.5773)))
  float viewShade = dot(n, normalize(vec3(0.577, 0.577, 0.577))) * 0.5 + 0.5;

  float distFade = 1.0 - smoothstep(0.0, 3.5, v_dist);

  // Lusion formula: shade = v_diff * 0.45 + specular + refraction
  float matcapLuma = dot(matcapColor, vec3(0.299, 0.587, 0.114));
  float specular = pow(max(0.0, matcapLuma), 8.0) * 0.10;
  float refraction = matcapLuma * 0.04;
  float baseShade = diff * 0.45 + specular + refraction;

  // Lusion scatter: getScatter() * 1.35 — approximated with distance-based SSS
  vec3 camDir = normalize(v_worldPos);
  float scatterDot = max(0.0, dot(camDir, vec3(0.0, -0.3, 1.0)));
  float scatter = pow(scatterDot, 2.0) * distFade * 1.35 * 0.10;
  baseShade += scatter;

  float emission = (distFade * 0.55 + 0.45) * v_emissive;
  float ao = distFade;

  // Lusion: mix(shade, viewShade, v_emission * v_ao) * (0.4 + v_ao * 0.6)
  float shade = mix(baseShade, viewShade, emission * ao) * (0.4 + ao * 0.6);

  // Lusion contrast: mix(shade, smoothstep(0,1,shade), 0.5)
  shade = mix(shade, smoothstep(0.0, 1.0, shade), 0.5);

  shade *= v_scrollFade;

  // Subtle cool-warm tinting
  vec3 coolTint = vec3(0.88, 0.92, 1.0);
  vec3 warmTint = vec3(1.0, 0.96, 0.9);
  vec3 tint = mix(coolTint, warmTint, distFade * 0.6 + v_emissive * 0.4);

  gl_FragColor = vec4(vec3(shade) * tint, 1.0);
}
`;

/**
 * Fog overlay fragment shader.
 * Samples fog.png R/G channels as two independent fog layers.
 * Animated UVs for slow drift.
 */
export const fogVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fogFragment = /* glsl */ `
uniform sampler2D u_fogMap;
uniform float u_time;
uniform float u_opacity;
varying vec2 vUv;

void main() {
  float t = u_time * 0.02;

  // Layer 1: slow drift using R channel
  vec2 uv1 = vUv * 1.2 + vec2(t * 0.3, t * 0.1);
  float fog1 = texture2D(u_fogMap, fract(uv1)).r;

  // Layer 2: counter-drift using G channel
  vec2 uv2 = vUv * 0.9 + vec2(-t * 0.2, t * 0.15) + 0.5;
  float fog2 = texture2D(u_fogMap, fract(uv2)).g;

  // Third layer: very slow, large scale
  vec2 uv3 = vUv * 0.6 + vec2(t * 0.08, -t * 0.05) + 0.3;
  float fog3 = texture2D(u_fogMap, fract(uv3)).r;

  // Combine layers with vignette
  float combined = fog1 * 0.3 + fog2 * 0.45 + fog3 * 0.25;
  float vignette = 1.0 - length((vUv - 0.5) * 1.6);
  vignette = smoothstep(0.0, 0.7, vignette);
  combined *= vignette;

  // Warm-cool tint with depth variation
  vec3 fogColor = mix(
    vec3(0.015, 0.025, 0.05), // deep cool blue
    vec3(0.05, 0.035, 0.025), // warm amber
    fog1 * 0.6 + fog3 * 0.4
  );

  gl_FragColor = vec4(fogColor * combined, combined * u_opacity);
}
`;

/**
 * Gaussian blur pass (Lusion uses 4-level cascaded Gaussian).
 * 6-tap 1D Gaussian, run H then V per level.
 */
export const gaussianBlurFragment = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 u_direction; // (1,0) for H, (0,1) for V
uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
  vec2 texel = u_direction / u_resolution;

  // Wide 7-tap Gaussian (doubled offsets for broader spread)
  vec4 sum = vec4(0.0);
  sum += texture2D(tDiffuse, vUv - 6.0 * texel) * 0.0044;
  sum += texture2D(tDiffuse, vUv - 4.0 * texel) * 0.054;
  sum += texture2D(tDiffuse, vUv - 2.0 * texel) * 0.242;
  sum += texture2D(tDiffuse, vUv)                * 0.399;
  sum += texture2D(tDiffuse, vUv + 2.0 * texel) * 0.242;
  sum += texture2D(tDiffuse, vUv + 4.0 * texel) * 0.054;
  sum += texture2D(tDiffuse, vUv + 6.0 * texel) * 0.0044;

  gl_FragColor = sum;
}
`;

/**
 * Bloom composite: add weighted blur levels to original.
 * Lusion: original + sum(bloomWeights[i] * blurLevel[i])
 */
export const bloomCompositeFragment = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D u_blur1;
uniform sampler2D u_blur2;
uniform sampler2D u_blur3;
uniform sampler2D u_blur4;
uniform float u_bloomAmount;
varying vec2 vUv;

void main() {
  vec4 original = texture2D(tDiffuse, vUv);

  // Weighted bloom: near levels stronger, far levels softer halo
  vec4 bloom = vec4(0.0);
  bloom += texture2D(u_blur1, vUv) * 0.4;
  bloom += texture2D(u_blur2, vUv) * 0.3;
  bloom += texture2D(u_blur3, vUv) * 0.2;
  bloom += texture2D(u_blur4, vUv) * 0.15;

  gl_FragColor = original + bloom * u_bloomAmount;
}
`;

/**
 * Color grading + dithering pass.
 * Lusion: colorBurn #00f0ff at 15%, colorDodge #005aff at 12%, then dithering.
 */
export const colorGradeDitherFragment = /* glsl */ `
uniform sampler2D tDiffuse;
varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 colorBurn(vec3 base, vec3 blend) {
  return vec3(
    blend.r == 0.0 ? 0.0 : max(0.0, 1.0 - (1.0 - base.r) / blend.r),
    blend.g == 0.0 ? 0.0 : max(0.0, 1.0 - (1.0 - base.g) / blend.g),
    blend.b == 0.0 ? 0.0 : max(0.0, 1.0 - (1.0 - base.b) / blend.b)
  );
}

vec3 colorDodge(vec3 base, vec3 blend) {
  return vec3(
    blend.r >= 1.0 ? 1.0 : min(1.0, base.r / (1.0 - blend.r)),
    blend.g >= 1.0 ? 1.0 : min(1.0, base.g / (1.0 - blend.g)),
    blend.b >= 1.0 ? 1.0 : min(1.0, base.b / (1.0 - blend.b))
  );
}

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  vec3 burnColor = vec3(0.0, 0.94, 1.0);
  vec3 dodgeColor = vec3(0.0, 0.353, 1.0);
  float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  float gradeMask = smoothstep(0.01, 0.06, luma);
  vec3 burned = mix(color.rgb, colorBurn(burnColor, color.rgb), 0.15 * gradeMask);
  vec3 dodged = mix(color.rgb, colorDodge(dodgeColor, color.rgb), 0.12 * gradeMask);
  color.rgb = mix(burned, dodged, color.rgb);

  float noise = rand(gl_FragCoord.xy);
  vec3 dither = vec3(0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0);
  dither = mix(2.0 * dither, -2.0 * dither, noise);
  gl_FragColor = vec4(color.rgb + dither, 1.0);
}
`;
