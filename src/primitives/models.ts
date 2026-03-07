import * as THREE from 'three';

export type AllModels = Vertex | Fragment | Toon;
export type ColorHex = string;

export interface Vertex{
    type: 'vertex';
    colorV0: ColorHex; // Vértice 0 (Abajo Izquierda)
    colorV1: ColorHex; // Vértice 1 (Abajo Derecha)
    colorV2: ColorHex;
}

export interface Fragment{
    type: 'fragment';
    scale: number;
    colorSpecular: ColorHex;
    lightColor: ColorHex;
    meshColor: ColorHex;
    shininess: number
}

export interface Toon{
    type: 'toon';
    scale: number;
    colorObject: ColorHex;
    
    stepHigh: number;
    stepMid: number;
    stepLow: number;
                
    colorHigh: ColorHex; 
    colorMid: ColorHex;
    colorLow: ColorHex;
                
    specularColor: ColorHex; 
    shininess: number;
    specularStep: number;
}