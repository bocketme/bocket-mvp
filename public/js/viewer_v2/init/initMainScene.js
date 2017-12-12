export default function initMainScene(scene_3d, object_3d) {


    var ambientLight = new THREE.AmbientLight(0xffffff, 0.25),
        directLight1 = new THREE.DirectionalLight(0xffffff, 0.25),
        directLight2 = new THREE.DirectionalLight(0xffffff, 0.25),
        directLight3 = new THREE.DirectionalLight(0xffffff, 0.25),
        directLight4 = new THREE.DirectionalLight(0xffffff, 0.25);

    directLight1.position.set(-1000,     0, 1000);
    directLight2.position.set( 1000,     0, 1000);
    directLight4.position.set(    0,  1000, 1000);
    directLight3.position.set(    0, -1000, 1000);

    scene_3d.p_scene.add(ambientLight);
    scene_3d.p_scene.add(directLight1);
    scene_3d.p_scene.add(directLight2);
    scene_3d.p_scene.add(directLight3);
    scene_3d.p_scene.add(directLight4);
}