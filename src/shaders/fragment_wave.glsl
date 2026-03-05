#version 300 es
precision highp float;

// Parámetros
uniform float uTime;

// Variables del vertex shader
in vec3 vNormal;
in vec3 vColor;
in vec3 vViewPosition;
in float vWaveIntensity;

out vec4 outColor;

void main() {
    // Color sólido para debug (cambia a rojo si no se ve)
    vec3 finalColor = vec3(0.0, 1.0, 0.0); // Verde para confirmar renderizado
    
    // Descomenta para efecto original una vez que funcione
    /*
    vec3 colorOnda = vec3(
        sin(vWaveIntensity * 10.0 + uTime * 2.0) * 0.5 + 0.5,
        cos(vWaveIntensity * 8.0 + uTime * 1.5) * 0.5 + 0.5,
        sin(vWaveIntensity * 6.0 - uTime * 1.0) * 0.5 + 0.5
    );
    vec3 colorNormal = abs(vNormal);
    vec3 colorTiempo = vec3(
        0.5 + 0.5 * sin(uTime),
        0.5 + 0.5 * sin(uTime + 2.0),
        0.5 + 0.5 * sin(uTime + 4.0)
    );
    vec3 finalColor = colorOnda * 0.4 + colorNormal * 0.3 + colorTiempo * 0.2 + vColor * 0.1;
    */
    
    outColor = vec4(finalColor, 1.0);
}