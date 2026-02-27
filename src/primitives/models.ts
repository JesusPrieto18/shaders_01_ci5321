import * as THREE from 'three';

export type AllModels = Vertex | Fragment;
export type ColorHex = string;

export interface Vertex{
    type: 'vertex';
    colorV0: ColorHex; // Vértice 0 (Abajo Izquierda)
    colorV1: ColorHex; // Vértice 1 (Abajo Derecha)
    colorV2: ColorHex;
}

export interface Fragment{
    type: 'fragment';
    color: ColorHex;
    LightPos: number;
    ViewPos: number;
    LightColor: ColorHex;
    ObjectColor: ColorHex;
    Shininess: number
}