import * as THREE from 'three';
import "./style.css";
import { config, scene } from './config/config';
import { animate } from './config/animate';
import { addModel } from './primitives/modelsMesh';
import { controls } from './config/controls';
import { createTriangulo } from './primitives/geometry';

const main = () => {
    config();
    createTriangulo('Triángulo');
    createTriangulo('Triángulo 2');
    controls();
    animate();
};

main();