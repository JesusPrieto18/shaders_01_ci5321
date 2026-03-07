precision highp float;

attribute vec3 vColor;
attribute float vIntensity;  // Cambia el nombre según el vertex shader

void main() {
    // Mezcla el color del vértice con la intensidad del efecto
    vec3 finalColor = vColor * (0.5 + 0.5 * vIntensity);
    gl_FragColor = vec4(finalColor, 1.0);
}

