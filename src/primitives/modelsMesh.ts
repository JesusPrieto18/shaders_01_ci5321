import * as THREE from 'three';
import GUI from 'lil-gui';
import { scene } from '../config/config';
import {AllModels,Vertex, Fragment, ColorHex, Toon} from './models';
import { color, positionGeometry } from 'three/tsl';
import { TGALoader } from 'three/examples/jsm/Addons.js';

const gui = new GUI();
gui.title('Controles del Modelo');

export const models: ModelsMesh<AllModels>[] = [];
export let indiceActivo = 0;

export class ModelsMesh<T extends AllModels> {
  protected name: string;
  protected shader: THREE.RawShaderMaterial;
  protected mesh: THREE.Object3D;
  protected parameters: T
  protected fileGUI: GUI;
    
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, parameters: T) {
    this.parameters = parameters;
    this.name = name;
    
    // 1. Crear el material y la malla
    // Usamos MeshStandardMaterial para poder cambiar el color y que reaccione a luces
    this.shader = shader;

    if (geometry instanceof THREE.BufferGeometry) {
        this.mesh = new THREE.Mesh(geometry, this.shader);
    } else {
        this.mesh = geometry; // Si es un Group, lo usamos directamente
    }

    // 2. Parámetros expuestos a la UI


    // 3. Crear su propia "Carpeta" en la interfaz
    this.fileGUI = gui.addFolder(this.name);
  }

  protected forEachMesh(callback: (mesh: THREE.Mesh) => void): void {
    this.mesh.traverse((child) => {
        // Type guard de Three.js para saber si es un Mesh
        if ((child as THREE.Mesh).isMesh) {
            callback(child as THREE.Mesh);
        }
    });
  }
  protected buildGUI(): void {
    console.warn(`buildGUI no implementado para ${this.name}`);
  }

  public getNombre(): string {
    return this.name;
  }

  public show() {
    this.mesh.visible = true;
    this.fileGUI.show(); // lil-gui permite ocultar carpetas enteras
  }

  public hide() {
    this.mesh.visible = false;
    this.fileGUI.hide();
  }

  public add() {
    scene.add(this.mesh);
  }

}

export class VertexModel extends ModelsMesh<Vertex> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Vertex) {
      super(name, geometry, shader, params);
      this.buildGUI(); // Llamamos a su propio constructor de UI
  }
}

export class FragmentModel extends ModelsMesh<Fragment> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Fragment) {
    super(name, geometry, shader, params);
    
    this.buildGUI();

  }

  protected buildGUI(): void {
    // Aquí irá la lógica para cuando uses uniforms en el fragment shader
    const controlesLuz = {
        brillo: 32.0,
        luzX: 2.0,
        luzY: 2.0,
        luzZ: 5.0
    };

    this.fileGUI.addColor(this.parameters, 'meshColor').name("Color").onChange((nuevoHex: ColorHex) => {
      this.shader.uniforms.uObjectColor.value.set(nuevoHex);
    });

    this.fileGUI.add(this.parameters, 'scale', 0.1, 5.0).name('Escala Global').onChange((v: number) => {
      // scale.set(x, y, z) escala uniformemente en todos los ejes
      this.mesh.scale.set(v, v, v);
    });

    this.fileGUI.add(controlesLuz, 'brillo', 1, 256).name('Shininess').onChange((v: number) => {
        this.shader.uniforms.uShininess.value = v; // ¡Actualizamos la GPU!
    });

    const carpetaLuz = this.fileGUI.addFolder('Posición de la Luz');
    carpetaLuz.add(controlesLuz, 'luzX', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.x = v);
    carpetaLuz.add(controlesLuz, 'luzY', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.y = v);
    carpetaLuz.add(controlesLuz, 'luzZ', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.z = v);
    
    const carpetaLuzColor = this.fileGUI.addFolder('Color de la Luz');
    carpetaLuzColor.addColor({ color: '#ffffff' }, 'color').name('Color de la Luz').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uLightColor.value.set(nuevoHex);
    });

    carpetaLuzColor.addColor({ color: '#ffffff' }, 'color').name('Color del Especular').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uSpecularColor.value.set(nuevoHex);
    });
    console.log('Construyendo modelo tipo fragment');
  }
}

export class ToonModel extends ModelsMesh<Toon> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Toon) {
    super(name, geometry, shader, params);
    this.buildGUI();

  }

  protected buildGUI(): void {
    // Aquí irá la lógica para cuando uses uniforms en el fragment shader
    const controles = {
        luzX: 2.0,
        luzY: 2.0,
        luzZ: 5.0,

        stepHigh: 0.8,
        stepMid: 0.5,
        stepLow: 0.1,
                    
        colorHigh: THREE.Color, 
        colorMid: THREE.Color,
        colorLow: THREE.Color,
                    
        shininess: 32,
        specularStep: 0.5,
    };

    this.fileGUI.addColor(this.parameters, 'colorObject').name("Color").onChange((nuevoHex: ColorHex) => {
      this.shader.uniforms.uObjectColor.value.set(nuevoHex);
    });

    this.fileGUI.add(this.parameters, 'scale', 0.1, 5.0).name('Escala Global').onChange((v: number) => {
      // scale.set(x, y, z) escala uniformemente en todos los ejes
      this.mesh.scale.set(v, v, v);
    });

    this.fileGUI.add(controles, 'shininess', 1, 256).name('Shininess').onChange((v: number) => {
        this.shader.uniforms.uShininess.value = v; // ¡Actualizamos la GPU!
    });

    const carpetaLuz = this.fileGUI.addFolder('Posición de la Luz');
    carpetaLuz.add(controles, 'luzX', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.x = v);
    carpetaLuz.add(controles, 'luzY', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.y = v);
    carpetaLuz.add(controles, 'luzZ', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.z = v);
    
    const carpetaLuzColor = this.fileGUI.addFolder('Color de la Luz');
    carpetaLuzColor.addColor({ color: '#ffffff' }, 'color').name('Color de la Luz').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uLightColor.value.set(nuevoHex);
    });

    carpetaLuzColor.addColor({ color: '#ffffff' }, 'color').name('Color del Especular').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uSpecularColor.value.set(nuevoHex);
    });

    const carpetaBordes = this.fileGUI.addFolder('Radios de los circulos');
    carpetaBordes.add(controles, 'stepHigh', 0, 1).onChange((v: number) => this.shader.uniforms.uStepHigh.value = v);
    carpetaBordes.add(controles, 'stepMid', 0, 1).onChange((v: number) => this.shader.uniforms.uStepMid.value = v);
    carpetaBordes.add(controles, 'stepLow', 0, 1).onChange((v: number) => this.shader.uniforms.uStepLow.value = v);
    
    console.log('Construyendo modelo tipo toon');
  }
}
export function changeModel(nuevoIndice: number) {
  if (nuevoIndice === indiceActivo) {
    console.log(`Ya estás viendo el modelo "${models[indiceActivo].getNombre()}". No se realizará ningún cambio.`);
    return; // Si ya estamos en ese modelo, no hacemos nada 
  } 
  
  if (nuevoIndice >= 0 && nuevoIndice < models.length) {
      if (models[indiceActivo]) {
          console.log(`Cambiando del modelo "${models[indiceActivo].getNombre()}" al modelo "${models[nuevoIndice].getNombre()}".`);
          console.log(`Índice activo actual: ${indiceActivo}, Nuevo índice: ${nuevoIndice}`);
          models[indiceActivo].hide();
          indiceActivo = nuevoIndice;
          models[indiceActivo].show();
      } else {
        console.warn(`Índice activo (${indiceActivo}) no corresponde a ningún modelo. Mostrando el nuevo modelo sin ocultar el anterior.`);
      }
  }
}

export function addModel(nombre: string, geometria: THREE.BufferGeometry  | THREE.Group, shader: THREE.RawShaderMaterial, parametros: AllModels) {
  let model: ModelsMesh<any>;  

  if (parametros.type === 'vertex') {
      model = new VertexModel(nombre, geometria, shader, parametros);
  } else if (parametros.type === 'fragment') {
      model = new FragmentModel(nombre, geometria, shader, parametros);
  } else if (parametros.type === 'toon') {
      model = new ToonModel(nombre, geometria, shader, parametros);
  } else {
      throw new Error("Tipo de modelo no soportado");
  }

  model.add();
  models.push(model);

  if (models.length === 1) {
      // Si es el primer modelo, lo mostramos por defecto
      changeModel(0);
  } else {
      // Si no, lo ocultamos hasta que el usuario lo seleccione
      model.hide();
  }
}