import * as THREE from 'three';
import "./style.css";
import { config, scene } from './config/config';
import { animate } from './config/animate';
import { controls } from './config/controls';
import { CelShading, createTriangulo, FragmentManipulation } from './primitives/geometry';

const main = () => {
    config();
    createTriangulo('Triángulo');
    FragmentManipulation('Triángulo 2');
    CelShading('Cel Shading');
    controls();
    animate();
};

main();