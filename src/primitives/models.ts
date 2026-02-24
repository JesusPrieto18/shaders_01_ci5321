import * as THREE from 'three';

export type AllModels = vertex | fragment;
export type colorHex = string;

export interface vertex{
    type: 'vertex';
    colorV0: colorHex; // Vértice 0 (Abajo Izquierda)
    colorV1: colorHex; // Vértice 1 (Abajo Derecha)
    colorV2: colorHex;
}

export interface fragment{
    type: 'fragment';
    color: colorHex;
}