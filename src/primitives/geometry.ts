import * as THREE from 'three';
import vs from '../shaders/vertex.glsl?raw';
import fs from '../shaders/fragment.glsl?raw';
import vs2 from '../shaders/vertex_2.glsl?raw';
import fs2 from '../shaders/fragment_2.glsl?raw';
import vs3 from '../shaders/vertex_3.glsl?raw';
import fs3 from '../shaders/fragment_3.glsl?raw';
import { camera } from '../config/config';
import { addModel } from './modelsMesh';
import { color } from 'three/tsl';

export function vertexManipulation(name: string) {
    // Crear geometría
    const geometry = new THREE.BoxGeometry (1, 1, 1);
    
    // ===== AÑADIR COLORES A LA GEOMETRÍA =====
    // Obtener el número de vértices
    const positionAttribute = geometry.getAttribute('position');
    const vertexCount = positionAttribute.count;
    

    
    // Programa de Shaders
    const material = new THREE.RawShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },
            color: { value: new THREE.Color('#ff0000') }, // Color rojo por defecto 
            Smoothness: { value: 0.0 },
            Hardness: { value: 0.0 }
        },
        glslVersion: THREE.GLSL3, 
        side: THREE.DoubleSide
    });

    addModel(name, geometry, material, {
        type: 'vertex',
        color: '#ff0000',
        scale: 1,
        Smoothness: 0.0,
        Hardness: 0.0
    });
}

export function FragmentManipulation(name: string) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

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

            uLightPos: { value: new THREE.Vector3(0,0,1) }, // Una "bombilla" arriba a la derecha
            uViewPos: { value: camera.position }, // La posición de tu cámara (OrbitControls)
            uLightColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Luz Blanca
            uObjectColor: { value: new THREE.Color('#0004ff') },
            uSpecularColor: { value: new THREE.Color(1,1,1) }, //  El color específico del brillo
            uShininess: { value: 32.0 } // 32 es un buen valor plástico. Metales usan 128 o 256.
        }, 
        side: THREE.DoubleSide
    });

    
    addModel(name, geometry, material, {
        type: 'fragment',
        scale: 1,

        luzX: 2.0,
        luzY: 2.0,
        luzZ: 5.0,

        colorSpecular: '#ffffff', // Blanco puro para el especular
        lightColor: '#ffffff', // Azul,
        meshColor: '#0004ff',
        shininess: 32.0
    });

}

export function ToonShading(name: string) {
    const geometry = new THREE.TorusGeometry(5, 2,30,100); // Más subdivisiones para un mejor efecto de toon shading
    
    //geometry.computeVertexNormals(); // Necesario para que el fragment shader tenga normales y se vea la iluminación
    
    // Programa de Shaders
    const material = new THREE.RawShaderMaterial({
        vertexShader: vs3,
        fragmentShader: fs3,
        glslVersion: THREE.GLSL3,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },
            uViewPos: { value: camera.position }, // NUEVO: La posición de la cámara a prueba de fallos

            uLightPos: { value: new THREE.Vector3(0,0,1) }, // Una "bombilla" arriba a la derecha
            uLightColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Luz Blanca
            uObjectColor: { value: new THREE.Color('#047c36') },

            // Rangos de los degradados
            uStepHigh: { value: 0.8 },
            uStepMid: { value: 0.5 },
            uStepLow: { value: 0.2 },
            
            // Colores de cada sección (usamos THREE.Color para facilidad)
            uColorHigh: { value: new THREE.Color('#05b91db5') }, // Rojo brillante
            uColorMid: { value: new THREE.Color('#0f8a0f') },  // Rojo medio
            uColorLow: { value: new THREE.Color(0.3, 0.0, 0.0) },  // Rojo oscuro / vino
            
            uSoftness: { value: 0.02 },

            // Parámetros de brillo
            uSpecularColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Brillo blanco
            uShininess: { value: 32.0 },
            uSpecularStep: { value: 0.5 }, // Qué tan concentrado es el punto de luz
            
            uOutlineThickness: { value: 0.25 }, // Ajusta este número de 0.1 a 0.5 para el grosor
            uOutlineColor: { value: new THREE.Color('#000000') } // Tinta negra
        }, 
        side: THREE.FrontSide
    });

    
    addModel(name, geometry, material, {
        type: 'toon',
        scale: 1,
        colorObject: '#047c36',

        luzX: 0.0,
        luzY: 0.0,
        luzZ: 5.0,

        stepHigh: 0.8,
        stepMid: 0.5,
        stepLow: 0.2,
                    
        colorHigh: '#05b91db5', 
        colorMid: '#0f8a0f',
        colorLow: '#047c36',
        
        softness: 0.02 ,
        specularColor: '#ffffff', 
        shininess: 32.0,
        specularStep: 0.5,

        outlineColor: '#000000',
        outlineThickness: 0.25
    });

}