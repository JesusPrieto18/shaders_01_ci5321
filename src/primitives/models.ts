import * as THREE from 'three';

export type AllModels = Vertex | Fragment | Toon | Shockwave | ShockToon;
export type ColorHex = string;

export interface Vertex{
    type: 'vertex';
    colorV0: ColorHex; // Vértice 0 (Abajo Izquierda)
    colorV1: ColorHex; // Vértice 1 (Abajo Derecha)
    colorV2: ColorHex;
}

export interface Fragment{
    type: 'fragment';
    
    luzX: number;
    luzY: number;
    luzZ: number;

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
    
    luzX: number;
    luzY: number;
    luzZ: number;

    stepHigh: number;
    stepMid: number;
    stepLow: number;
                
    colorHigh: ColorHex; 
    colorMid: ColorHex;
    colorLow: ColorHex;

    softness: number;   
    specularColor: ColorHex; 
    shininess: number;
    specularStep: number;

    outlineThickness: number;
    outlineColor: ColorHex;
}

export interface Shockwave{
    type: 'shockwave';
    scale: number;
    colorObject: ColorHex;
    velocity: number;
    frequency: number;
    amplitude: number;
}

export interface ShockToon{
    type: 'shocktoon';
    scale: number;
    colorObject: ColorHex;

    velocity: number;
    frequency: number;
    amplitude: number;

    luzX: number;
    luzY: number;
    luzZ: number;

    stepHigh: number;
    stepMid: number;
    stepLow: number;
                
    colorHigh: ColorHex; 
    colorMid: ColorHex;
    colorLow: ColorHex;

    softness: number;   
    specularColor: ColorHex; 
    shininess: number;
    specularStep: number;

    outlineThickness: number;
    outlineColor: ColorHex;
}