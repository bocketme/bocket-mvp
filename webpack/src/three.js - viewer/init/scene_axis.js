import * as THREE from 'three';

export default class AxisScene{
    constructor(p_axisSize){
        this.p_scene = new THREE.Scene();

        this.p_renderer = new THREE.WebGLRenderer({canvas: axisCanvas,alpha: true, antialias: true, logarithmicDepthBuffer: true});
        this.p_renderer.setSize(p_axisSize, p_axisSize);

        this.p_camera = new THREE.OrthographicCamera(p_axisSize / -2, p_axisSize / 2, p_axisSize / 2, p_axisSize / -2, 1, 2147483647);
        this.p_camera.lookAt(this.p_scene);

        this.p_controls = new THREE.OrbitControls(this.p_camera, this.p_renderer.domElement);
        this.p_controls.rotateSpeed = 0.15;
    }

    update(data){
        this.p_camera.position.copy(data);
        this.p_camera.position.setLength(200);
        this.p_camera.lookAt(this.p_scene.position);
    }

    initScene(renderArea){
        var axisAnchor = new THREE.Points();
        axisAnchor.position.set(0, 0, 0);

        var p_axis = new THREE.TransformControls(this.p_camera, this.p_renderer.domElement);
        p_axis.children[0].children[0].children.splice(6, 4);
        p_axis.dispose();
        p_axis.attach(axisAnchor);

        this.p_scene.add(axisAnchor);
        this.p_scene.add(p_axis);

        renderArea.appendChild(this.p_renderer.domElement);
    }

    render() {
        this.p_renderer.render(this.p_scene, this.p_camera);
    }
}