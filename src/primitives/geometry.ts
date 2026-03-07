import * as THREE from 'three';
import vs from '../shaders/vertex.glsl?raw';
import fs from '../shaders/fragment.glsl?raw';
import vs2 from '../shaders/vertex_2.glsl?raw';
import fs2 from '../shaders/fragment_2.glsl?raw';
import vs3 from '../shaders/vertex_3.glsl?raw';
import fs3 from '../shaders/fragment_3.glsl?raw';
import { camera } from '../config/config';
import { addModel } from './modelsMesh';

export function createTriangulo(name: string) {

    const geometry = new THREE.CylinderGeometry(0, 1, 2, 3);
    //geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    //geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 2. Extraer cuántos vértices generó Three.js realmente
    const posiciones = geometry.attributes.position;
    const cantidadVertices = posiciones.count;

    // 3. Crear un arreglo vacío para guardar los colores (R, G, B por cada vértice)
    const colores = new Float32Array(cantidadVertices * 3);
    const colorTemporal = new THREE.Color();

    // 4. Recorrer cada vértice y decidir su color basado en su posición (X, Y, Z)
    for (let i = 0; i < cantidadVertices; i++) {
        const x = posiciones.getX(i);
        const y = posiciones.getY(i);
        // const z = posiciones.getZ(i); // Útil si quieres más precisión espacial

        // Lógica de pintura espacial:
        if (y > 0) {
            // Si el vértice está en la mitad superior (la punta)
            colorTemporal.setHex(0xff0000); // Rojo
        } else {
            // Si el vértice está en la base
            if (x > 0) {
                colorTemporal.setHex(0x00ff00); // Verde (derecha)
            } else if (x < 0) {
                colorTemporal.setHex(0x0000ff); // Azul (izquierda)
            } else {
                colorTemporal.setHex(0xffff00); // Amarillo (centro/atrás)
            }
        }

        // Guardar el color en el arreglo plano
        colores[i * 3] = colorTemporal.r;
        colores[i * 3 + 1] = colorTemporal.g;
        colores[i * 3 + 2] = colorTemporal.b;
    }

    // 5. INYECTAR el atributo 'color' a la primitiva
    geometry.setAttribute('color', new THREE.BufferAttribute(colores, 3));

    // Programa de Shaders
    const material = new THREE.RawShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },
            Smoothness: {value: 0.5},
            Hardness: {value: 0.5}
        },
        glslVersion: THREE.GLSL3, 
        side: THREE.DoubleSide
    });

    addModel(name, geometry, material, {
        type: 'vertex',
        colorV0: '#ff0000', // Rojo
        colorV1: '#00ff00', // Verde
        colorV2: '#0000ff', // Azul,
        smoothness: 5.0, // Controla la frecuencia de la onda
        hardness: 0.5 // Controla la amplitud de la onda
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