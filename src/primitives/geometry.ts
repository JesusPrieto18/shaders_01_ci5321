import * as THREE from 'three';
import vs from '../shaders/vertex.glsl?raw';
import fs from '../shaders/fragment.glsl?raw';
import vs2 from '../shaders/vertex_2.glsl?raw';
import fs2 from '../shaders/fragment_2.glsl?raw';

import vsWave from '../shaders/vertex_wave.glsl?raw';
import fsWave from '../shaders/fragment_wave.glsl?raw';

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

export function FragmentManipulation(name: string) {
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
    geometry.computeVertexNormals(); // Necesario para que el fragment shader tenga normales y se vea la iluminación
    
    // Programa de Shaders
    const material = new THREE.RawShaderMaterial({
        vertexShader: vs2,
        fragmentShader: fs2,
        glslVersion: THREE.GLSL3,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },

            uLightPos: { value: new THREE.Vector3(5, 5, 5) }, // Una "bombilla" arriba a la derecha
            uViewPos: { value: camera.position }, // La posición de tu cámara (OrbitControls)
            uLightColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Luz Blanca
            uObjectColor: { value: new THREE.Color(1,0,0) },
            uShininess: { value: 32.0 } // 32 es un buen valor plástico. Metales usan 128 o 256.
        }, 
        side: THREE.DoubleSide
    });

    
    addModel(name, geometry, material, {
        type: 'fragment',
        color: '#ff0000', // Rojo
        LightPos: 5,
        ViewPos: 5,
        LightColor: '#ffffff', // Azul,
        ObjectColor: '#bbff00',
        Shininess: 32.0
    });

}

export function createVertexWaveMaterial(name: string) {
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
    geometry.computeVertexNormals();
    
    const material = new THREE.RawShaderMaterial({
        vertexShader: vsWave,
        fragmentShader: fsWave,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },
            uTime: { value: 0 },
            uSmoothness: { value: 1.5 },
            uHardness: { value: 0.8 }
        },
        glslVersion: THREE.GLSL3, 
        side: THREE.DoubleSide
    });

    addModel(name, geometry, material, {
        type: 'vertexWave',
        colorV0: '#ff0000',
        colorV1: '#00ff00',
        colorV2: '#0000ff',
        smoothness: 1.5,
        hardness: 0.8,
        time: 0
    });
}