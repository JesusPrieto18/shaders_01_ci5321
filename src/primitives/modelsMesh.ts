import * as THREE from 'three';
import GUI from 'lil-gui';
import { scene } from '../config/config';
import {AllModels,Vertex, Fragment, ColorHex} from './models';

const gui = new GUI();
gui.title('Controles del Modelo');

export const models: ModelsMesh<AllModels>[] = [];
export let indiceActivo = 0;

export class ModelsMesh<T extends AllModels> {
  protected nombre: string;
  protected malla: THREE.BufferGeometry;
  protected material: THREE.RawShaderMaterial;
  protected objeto: THREE.Mesh;
  protected parametros: T
  protected carpetaGUI: GUI;
    
  constructor(name: string, geometry: THREE.BufferGeometry, shader: THREE.RawShaderMaterial, parametrosT: T) {
    this.parametros = parametrosT;
    this.nombre = name;
    
    // 1. Crear el material y la malla
    // Usamos MeshStandardMaterial para poder cambiar el color y que reaccione a luces
    this.material = shader;
    this.malla = geometry;
    this.objeto = new THREE.Mesh(geometry, this.material) 

    // 2. Parámetros expuestos a la UI


    // 3. Crear su propia "Carpeta" en la interfaz
    this.carpetaGUI = gui.addFolder(this.nombre);
  }

  protected buildGUI(): void {
        console.warn(`buildGUI no implementado para ${this.nombre}`);
  }

  public getNombre(): string {
    return this.nombre;
  }

  public show() {
    this.objeto.visible = true;
    this.carpetaGUI.show(); // lil-gui permite ocultar carpetas enteras
  }

  public hide() {
    this.objeto.visible = false;
    this.carpetaGUI.hide();
  }

  public add() {
        scene.add(this.objeto);
  }

}

export class VertexModel extends ModelsMesh<Vertex> {
    constructor(name: string, geometry: THREE.BufferGeometry, shader: THREE.RawShaderMaterial, params: Vertex) {
        super(name, geometry, shader, params);
        this.buildGUI(); // Llamamos a su propio constructor de UI
    }

    protected buildGUI(): void {
        const atributoColor = this.malla.getAttribute('color') as THREE.BufferAttribute;

        const actualizarColorVertice = (indiceVertice: number, hex: string) => {
            const color = new THREE.Color(hex);
            atributoColor.setXYZ(indiceVertice, color.r, color.g, color.b);
            atributoColor.needsUpdate = true; 
        };

        this.carpetaGUI.addColor(this.parametros, 'colorV0').onChange((nuevoHex: ColorHex) => actualizarColorVertice(0, nuevoHex));
        this.carpetaGUI.addColor(this.parametros, 'colorV1').onChange((nuevoHex: ColorHex) => actualizarColorVertice(1, nuevoHex));
        this.carpetaGUI.addColor(this.parametros, 'colorV2').onChange((nuevoHex: ColorHex) => actualizarColorVertice(2, nuevoHex));

        console.log('Construyendo modelo tipo vertex limpio y sin ifs');
    }
}

export class FragmentModel extends ModelsMesh<Fragment> {
  constructor(name: string, geometry: THREE.BufferGeometry, shader: THREE.RawShaderMaterial, params: Fragment) {
      super(name, geometry, shader, params);
      this.buildGUI();
  }

  protected buildGUI(): void {
      // Aquí irá la lógica para cuando uses uniforms en el fragment shader
      this.carpetaGUI.addColor(this.parametros, 'color').onChange((nuevoHex: ColorHex) => {
           // this.material.uniforms.uColor.value.set(nuevoHex);
      });
      console.log('Construyendo modelo tipo fragment');
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

export function addModel(nombre: string, geometria: THREE.BufferGeometry, shader: THREE.RawShaderMaterial, parametros: AllModels) {
  let model: ModelsMesh<any>;  

  if (parametros.type === 'vertex') {
      model = new VertexModel(nombre, geometria, shader, parametros);
  } else if (parametros.type === 'fragment') {
      model = new FragmentModel(nombre, geometria, shader, parametros);
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