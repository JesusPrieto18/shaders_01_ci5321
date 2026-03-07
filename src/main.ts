import * as THREE from 'three';
import "./style.css";
import { config, scene } from './config/config';
import { animate } from './config/animate';
import { controls } from './config/controls';
import { ToonShading, createTriangulo, FragmentManipulation } from './primitives/geometry';

const main = () => {
    config();
    createTriangulo('Triángulo');
    FragmentManipulation('Blin-Phong');
    ToonShading('Toon Shading');
    controls();
    animate();
};

main();