uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uSmoothness;  // Controla la suavidad del inflado
uniform float uHardness;    // Controla la cantidad de inflado

attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

varying vec3 vColor;
varying float vInflate;

void main() {
    // Inflar/desinflar el modelo según la normal
    // Usamos una función pseudo-aleatoria basada en la posición
    float noise = fract(sin(position.x * 12.9898 + position.y * 78.233 + position.z * 37.719) * 43758.5453);
    
    float inflate = (noise - 0.5) * uHardness;
    vInflate = inflate * 0.5 + 0.5;
    vColor = color;
    
    // Desplazar a lo largo de la normal
    vec3 newPosition = position + normal * inflate * uSmoothness;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}