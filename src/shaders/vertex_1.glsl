// Matrices de transformación
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// Los parámetros vienen de la interfaz Vertex
uniform float uSmoothness;  // = smoothness de la interfaz
uniform float uHardness;    // = hardness de la interfaz

// Atributos del vértice
in vec3 position;
in vec3 normal;
in vec3 color;  // colorV0, colorV1, colorV2

// Variables de salida
out vec3 vNormal;
out vec3 vColor;
out float vWaveIntensity;

void main() {
    // SOLO UNA ONDA usando los parámetros de la interfaz
    float wave = sin(position.x * uSmoothness) * 
                 cos(position.y * 1.5) * 
                 sin(position.z * 1.2);
    
    // hardness controla la amplitud
    float offsetAmount = wave * 0.5 * uHardness;
    
    // Guardar intensidad para fragment
    vWaveIntensity = (wave * 0.5) + 0.5;
    
    // Desplazar vértice
    vec3 newPosition = position + normal * offsetAmount;
    
    // Transformaciones
    vec4 mvPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    
    // Pasar datos
    vColor = color;
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    gl_Position = projectionMatrix * mvPosition;
}