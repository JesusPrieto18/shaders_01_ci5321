#version 300 es
precision highp float;

uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform vec3 uLightColor;
uniform vec3 uObjectColor;
uniform float uShininess;

in vec3 vNormal;
in vec3 vFragPos;

out vec4 fragColor;

void main() {
    // 0. Preparativos de vectores
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) {
        N = N * -1.0;
    }
    vec3 L = normalize(uLightPos - vFragPos);
    vec3 V = normalize(uViewPos - vFragPos);

    // ==========================================
    // 1. CEL SHADING DIFUSO (Cuantización)
    // ==========================================
    
    // Calculamos el producto punto estándar (0.0 a 1.0)
    float dotNL = max(dot(N, L), 0.0);
    
    // Esta variable guardará el "escalón" de luz final
    float celDiffuse;

    // LA MATEMÁTICA INTERRUMPIDA:
    // Creamos 3 bandas de color (puedes ajustar los números para cambiar el estilo)
    if (dotNL > 0.75) {
        celDiffuse = 1.0; // Luz máxima directa
    } else if (dotNL > 0.35) {
        celDiffuse = 0.6; // Sombra media (penumbra)
    } else {
        celDiffuse = 0.2; // Sombra oscura constante (reemplaza a la luz ambiente)
    }

    // Aplicamos el color de la luz
    vec3 diffuse = celDiffuse * uLightColor;


    // ==========================================
    // 2. CEL SHADING ESPECULAR (Brillo de "Burbuja")
    // ==========================================
    
    vec3 H = normalize(L + V);
    float dotNH = max(dot(N, H), 0.0);
    
    // Calculamos la potencia Blinn-Phong estándar
    float specFactor = pow(dotNH, uShininess);
    
    float celSpecular;

    // LA MATEMÁTICA INTERRUMPIDA:
    // En lugar de un brillo suave, creamos un corte duro (un blob de luz)
    if (specFactor > 0.5) {
        celSpecular = 1.0; // Brillo máximo concentrado
    } else {
        celSpecular = 0.0; // Nada de brillo
    }

    // Usamos blanco puro para el brillo especular (estilo toon plástico)
    vec3 specular = celSpecular * vec3(1.0); 


    // ==========================================
    // 3. COMPOSICIÓN FINAL
    // ==========================================
    
    // Sumamos la luz difusa (con ambiente integrado) y la especular.
    // Fíjate que en Cel Shading, a menudo sumamos el especular DESPUÉS 
    // de multiplicar por el color del objeto para que el brillo sea puro.
    
    vec3 result = (diffuse * uObjectColor) + specular;

    fragColor = vec4(result, 1.0);
}