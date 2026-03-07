precision highp float;

// Variables del vertex shader
in vec3 vNormal;
in vec3 vColor;           // colorV0, colorV1, colorV2
in float vWaveIntensity;

out vec4 outColor;

void main() {
    // Usar los colores de la interfaz para visualizar la onda
    
    // Mapear intensidad de onda a los colores RGB
    float t = vWaveIntensity;
    
    // Mezcla de los tres colores según la posición de la onda
    vec3 colorOnda;
    
    // Zona baja (t < 0.33): predomina colorV0
    if (t < 0.33) {
        float factor = t / 0.33;
        colorOnda = mix(vec3(vColor.r, 0.0, 0.0), 
                       vec3(0.0, vColor.g, 0.0), factor);
    }
    // Zona media (0.33 - 0.66): predomina colorV1
    else if (t < 0.66) {
        float factor = (t - 0.33) / 0.33;
        colorOnda = mix(vec3(0.0, vColor.g, 0.0), 
                       vec3(0.0, 0.0, vColor.b), factor);
    }
    // Zona alta (0.66 - 1.0): predomina colorV2
    else {
        float factor = (t - 0.66) / 0.34;
        colorOnda = mix(vec3(0.0, 0.0, vColor.b), 
                       vec3(vColor.r, 0.0, 0.0), factor);
    }
    
    // Añadir efecto de luz basado en normales
    float luz = abs(vNormal.y) * 0.5 + 0.5;
    
    outColor = vec4(colorOnda * luz, 1.0);
}

