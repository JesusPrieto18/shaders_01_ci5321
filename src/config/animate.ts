import * as THREE from 'three';
import { scene, camera, renderer, controls} from './config';

export function animate() {
    requestAnimationFrame(animate);
    //controls.update();
    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
    // 1. Actualizamos el Aspect Ratio de la cámara
    camera.aspect = window.innerWidth / window.innerHeight;
    // 2. IMPORTANTE: Recalcular las matrices de proyección de la cámara
    camera.updateProjectionMatrix(); 
    // 3. Actualizamos el tamaño del renderizador
    renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
}
