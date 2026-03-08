// #version 300 es
precision highp float;

// vertex_ripple.glsl
in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

// ¡EL NUEVO INGREDIENTE! El reloj que controlará la expansión
uniform float uTime; 

out vec3 vNormal;
out vec3 vFragPos;

void main() {
    // 1. Calculamos la distancia de este vértice respecto al centro (0,0) en el plano XZ (piso)
    // position.xz extrae solo los ejes horizontales.
    float dist = length(position.xz);

    // 2. CREAMOS LA ONDA (La magia)
    // Multiplicar 'dist' hace que los anillos sean más delgados o gruesos.
    // Multiplicar 'uTime' controla la velocidad a la que se expanden.
    float frecuencia = 5.0; // Qué tan juntas están las crestas de las olas
    float velocidad = 3.0;  // Qué tan rápido viaja la onda hacia afuera

    float wave = sin((dist * frecuencia) - (uTime * velocidad));

    // 3. ATENUACIÓN (Opcional pero recomendado)
    // Hacemos que la onda pierda fuerza a medida que se aleja del centro, como en la vida real.
    float amplitud = 0.5 / (dist + 1.0); 
    
    // 4. APLICAMOS EL MOVIMIENTO
    // Copiamos la posición original y le sumamos la onda a la altura (eje Y)
    vec3 newPosition = position;
    newPosition.y += wave * amplitud;

    // Pasamos las variables al Fragment Shader (por si quieres usar tu Toon Shading aquí también)
    vNormal = normalize(mat3(modelMatrix) * normal);
    vFragPos = (modelMatrix * vec4(newPosition, 1.0)).xyz;

    // Calculamos la posición final en pantalla usando nuestra NUEVA posición
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}