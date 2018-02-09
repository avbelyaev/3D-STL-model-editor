/**
 * Created by anthony on 11.01.2018.
 */


const animate = (renderer, scene, camera) => {
    requestAnimationFrame( animate );

    camera.lookAtPos(0, 0, 0);

    renderer.render(scene, camera);
};


const main = () => {
    const scene = new THREE.Scene();
    const canvas = document.getElementById("glCanvas");

    // define frustum
    const fov = 75;
    const zNear = 0.1;
    const zFar = 1000;
    const camera = new THREE.PerspectiveCamera(
        fov,
        canvas.clientWidth / canvas.clientHeight,
        zNear,
        zFar
    );
    camera.positionVec.set(2, 3, 15);


    const axes = THREE.AxisHelper(30);
    scene.add(axes);


    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setClearColor(0x333333);


    animate(renderer, scene, camera);
};



window.addEventListener("DOMContentLoaded", function () {
    main();
}, false);
