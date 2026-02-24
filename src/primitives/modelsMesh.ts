import * as THREE from 'three';
import GUI from 'lil-gui';
import { scene } from '../config/config';
import {AllModels, colorHex} from './models';

const gui = new GUI();
gui.title('Controles del Modelo');

export const models: ModelsMesh<AllModels>[] = [];
export let indiceActivo = 0;

export class ModelsMesh<T extends AllModels> {
    nombre: string;
    malla: THREE.BufferGeometry;
    material: THREE.RawShaderMaterial;
    objeto: THREE.Mesh;
    parametros: T
    carpetaGUI: GUI;
    
  constructor(name: string, geometry: THREE.BufferGeometry, shader: THREE.RawShaderMaterial, parametrosT: T) {
    this.parametros = parametrosT;
    this.nombre = name;
    
    // 1. Crear el material y la malla
    // Usamos MeshStandardMaterial para poder cambiar el color y que reaccione a luces
    this.material = shader;
    this.malla = geometry;
    this.objeto = new THREE.Mesh(geometry, this.material) 
    scene.add(this.objeto);

    // 2. Parámetros expuestos a la UI


    // 3. Crear su propia "Carpeta" en la interfaz
    this.carpetaGUI = gui.addFolder(this.nombre);

    const atributoColor = this.malla.getAttribute('color') as THREE.BufferAttribute;

    const actualizarColorVertice = (indiceVertice: number, hex: string) => {
      const color = new THREE.Color(hex);
      // setXYZ cambia los valores (R, G, B) en el índice específico del vértice
      atributoColor.setXYZ(indiceVertice, color.r, color.g, color.b);
      // ¡CRÍTICO! Le avisa a WebGL que debe re-subir este arreglo a la GPU
      atributoColor.needsUpdate = true; 
    };

    if (this.parametros.type === 'vertex') {
      // Lógica específica para ParametrosA
      // Por ejemplo:
      // Vinculamos la UI con los parámetros y la malla
      this.carpetaGUI.addColor(this.parametros, 'colorV0').onChange((nuevoHex: colorHex) => {
        actualizarColorVertice(0, nuevoHex);
      });

      this.carpetaGUI.addColor(this.parametros, 'colorV1').onChange((nuevoHex: colorHex) => {
        actualizarColorVertice(1, nuevoHex);
      });
      
      this.carpetaGUI.addColor(this.parametros, 'colorV2').onChange((nuevoHex: colorHex) => {
        actualizarColorVertice(2, nuevoHex);
      });

      console.log('Construyendo modelo tipo vertex');
    } else if (this.parametros.type === 'fragment') {
      // Lógica específica para ParametrosB
      console.log('Construyendo modelo tipo fragment');
    }
  

    // 4. Estado inicial: Oculto
    //this.hide();
  }

  show() {
    this.objeto.visible = true;
    this.carpetaGUI.show(); // lil-gui permite ocultar carpetas enteras
  }

  hide() {
    this.objeto.visible = false;
    this.carpetaGUI.hide();
  }

  add() {
        scene.add(this.objeto);
  }

}

export function changeModel(nuevoIndice: number) {
    if (nuevoIndice === indiceActivo) {
      console.log(`Ya estás viendo el modelo "${models[indiceActivo].nombre}". No se realizará ningún cambio.`);
      return; // Si ya estamos en ese modelo, no hacemos nada 
    } 
    
    if (nuevoIndice >= 0 && nuevoIndice < models.length) {
        if (models[indiceActivo]) {
            console.log(`Cambiando del modelo "${models[indiceActivo].nombre}" al modelo "${models[nuevoIndice].nombre}".`);
            console.log(`Índice activo actual: ${indiceActivo}, Nuevo índice: ${nuevoIndice}`);
            models[indiceActivo].hide();
            indiceActivo = nuevoIndice;
            models[indiceActivo].show();
        } else {
          console.warn(`Índice activo (${indiceActivo}) no corresponde a ningún modelo. Mostrando el nuevo modelo sin ocultar el anterior.`);
        }
    }
}

export function addModel<T extends AllModels>(nombre: string, geometria: THREE.BufferGeometry, shader: THREE.RawShaderMaterial, parametros: T) {
    const modelo = new ModelsMesh<T>(nombre, geometria, shader, parametros);
    modelo.add();
    models.push(modelo);
    if (models.length === 1) {
        // Si es el primer modelo, lo mostramos por defecto
        changeModel(0);
    } else {
        // Si no, lo ocultamos hasta que el usuario lo seleccione
        modelo.hide();
    }
}