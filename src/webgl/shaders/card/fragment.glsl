uniform sampler2D uTexture;
uniform vec2 uUvScale;

varying vec2 vUv;

void main() {
  vec2 uv = (vUv - 0.5) * uUvScale + 0.5;
  vec4 texture = texture2D(uTexture, uv);
  vec4 color = texture;
  gl_FragColor = color;
}