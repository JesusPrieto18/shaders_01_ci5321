// #version 300 es
precision highp float;

// Atributos definidos en la geometría
in vec3 position;
in vec3 color;

out vec3 vColor;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

void main() {
  vColor = color;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}