import * as THREE from 'three';
import vs from '../shaders/vertex.glsl?raw';
import fs from '../shaders/fragment.glsl?raw';
import { camera } from '../config/config';
import { addModel } from './modelsMesh';

export function createTriangulo(name: string) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
        -0.4, -0.4,  0, 
        0, 0.87,  0, 
        0.4,  -0.4,  0,
    ]);
    const colors = new Float32Array([
        1, 0, 0, 
        0, 1, 0, 
        0, 0, 1,
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Programa de Shaders
    const material = new THREE.RawShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },
        },
        glslVersion: THREE.GLSL3, 
        side: THREE.DoubleSide
    });

    addModel(name, geometry, material, {
        type: 'vertex',
        colorV0: '#ff0000', // Rojo
        colorV1: '#00ff00', // Verde
        colorV2: '#0000ff', // Azul,
    });
}