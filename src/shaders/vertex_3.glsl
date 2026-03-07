// vertexShader
in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;
out vec3 vFragPos; // Posición 3D del píxel para calcular distancias

void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Calculamos dónde está este vértice en el mundo 3D
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vFragPos = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}