precision highp float;

in vec3 vNormal;
in vec3 vFragPos;

// Uniforms de posición
uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform vec3 uLightColor;
uniform vec3 uObjectColor; // El color base del material

// --- NUEVOS UNIFORMS PARA EL GUI ---
// Umbrales de sombra (dónde termina una banda y empieza la otra)
uniform float uStepHigh; // ej: 0.8
uniform float uStepMid;  // ej: 0.5
uniform float uStepLow;  // ej: 0.2

// Colores para cada banda
uniform vec3 uColorHigh; // Color de luz directa
uniform vec3 uColorMid;  // Color de sombra suave
uniform vec3 uColorLow;  // Color de sombra profunda

// Brillo Especular (Highlights)
uniform vec3 uSpecularColor;
uniform float uShininess;
uniform float uSpecularStep; // Dónde se corta el brillo duro

uniform float uOutlineThickness; // ej: 0.25 (Grosor de la línea)
uniform vec3 uOutlineColor;      // ej: vec3(0.0) (Línea Negra)

out vec4 FragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uViewPos - vFragPos);

    // --- CÁLCULO DE LUZ DIFUSA (Cel Shading) ---
    float diff = max(dot(normal, lightDir), 0.0);

    // smoothstep(min, max, valor) crea un difuminado microscópico de 0.02
    // Esto borra el efecto "pixelado" y lo hace ver como un vector 2D perfecto
    float mixHigh = smoothstep(uStepHigh - 0.02, uStepHigh + 0.02, diff);
    float mixMid  = smoothstep(uStepMid - 0.02, uStepMid + 0.02, diff);
    float mixLow  = smoothstep(uStepLow - 0.02, uStepLow + 0.02, diff);

    // Pintamos en "capas". Empezamos con el color más oscuro...
    vec3 diffuseColor = uColorLow * 0.5; 
    // ...y vamos superponiendo los colores usando los porcentajes calculados
    diffuseColor = mix(diffuseColor, uColorLow, mixLow);
    diffuseColor = mix(diffuseColor, uColorMid, mixMid);
    diffuseColor = mix(diffuseColor, uColorHigh, mixHigh);

    // --- CÁLCULO DE LUZ ESPECULAR ---
    vec3 halfDir = normalize(lightDir + viewDir);
    // Aquí el uShininess sí importa porque define la "campana" del brillo
    float spec = pow(max(dot(normal, halfDir), 0.0), uShininess);
    float mixSpec = smoothstep(uSpecularStep - 0.02, uSpecularStep + 0.02, spec);
    vec3 specular = mix(vec3(0.0), uSpecularColor, mixSpec);
    
    // --- RESULTADO ---
    vec3 baseResult = diffuseColor + specular;

    // --- INGREDIENTE 2: CÁLCULO DEL CONTORNO (NUEVO) ---
    // NdotV será cercano a 0.0 en los bordes que se alejan de la cámara
    float NdotV = max(dot(normal, viewDir), 0.0);

    // Definimos el grosor del borde. Juega con este valor (ej. entre 0.1 y 0.4)
    float outlineThickness = 0.3; 

    // Usamos smoothstep para un borde nítido pero sin dientes de sierra (anti-aliasing)
    // Si NdotV es menor que el grosor, 'outlineFactor' será 0.0 (negro).
    // Si es mayor, será 1.0 (color normal).
    float outlineFactor = smoothstep(outlineThickness - 0.02, outlineThickness + 0.02, NdotV);

    // Mezclamos: Color Negro vs El Color Base calculado anteriormente
    // vec3(0.0) es el color de la tinta negra.
    vec3 finalColor = mix(vec3(0.0, 0.0, 0.0), baseResult, outlineFactor);

    FragColor = vec4(finalColor, 1.0);
}