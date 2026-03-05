#version 300 es
precision mediump float; // Agregado para evitar errores de precisión

// Matrices de transformación
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// Parámetros del material
uniform float uTime;
uniform float uSmoothness;
uniform float uHardness;

// Atributos del vértice
in vec3 position;
in vec3 normal;
in vec3 color;

// Variables de salida al fragment shader
out vec3 vNormal;
out vec3 vColor;
out vec3 vViewPosition;
out float vWaveIntensity;

void main() {
    // Crear dos ondas diferentes usando funciones trigonométricas
    float wave1 = sin(position.x * uSmoothness + uTime * 2.0) * 
                  cos(position.y * 1.5 + uTime * 1.3) * 
                  sin(position.z * 1.2 + uTime * 0.7);
    
    float wave2 = cos(position.y * uHardness + uTime * 1.8) * 
                  sin(position.z * 1.1 - uTime * 1.1) * 
                  cos(position.x * 1.4);
    
    // Calcular el desplazamiento total (reducido para evitar clipping)
    float offsetAmount = (wave1 * 0.1 * uSmoothness) + (wave2 * 0.05 * uHardness);
    
    // Guardar intensidad para el fragment shader
    vWaveIntensity = offsetAmount * 0.5 + 0.5;
    
    // Desplazar el vértice a lo largo de su normal
    vec3 newPosition = position + normal * offsetAmount;
    
    // Transformar a espacio de vista
    vec4 mvPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    // Pasar color y normal al fragment shader
    vColor = color;
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    // Posición final
    gl_Position = projectionMatrix * mvPosition;
}