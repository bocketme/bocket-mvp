export default function ViewerScene(p_width, p_height, p_aspectRatio) {
    this.p_scene = new THREE.Scene();

    this.p_renderer = new THREE.WebGLRenderer({canvas: renderSurface, alpha: true, antialias: true, logarithmicDepthBuffer: true});
    this.p_renderer.localClippingEnabled = true;
    this.p_renderer.setClearColor(0xffffff);
    this.p_renderer.setSize(p_width, p_height);

    this.p_camera = new THREE.PerspectiveCamera(60, p_aspectRatio, 1, 2147483647);
    this.p_camera.up.set(0, 0, 1);
    this.p_camera.position.set(0, -75, 50);

    this.p_controls = new THREE.OrbitControls(this.p_camera, this.p_renderer.domElement);
    console.log(this.p_controls.target);
    this.p_controls.zoomSpeed = 1 / (Math.log10(this.p_camera.position.distanceTo(this.p_controls.target)));
    this.render = function () {
        this.p_renderer.render(this.p_scene, this.p_camera);
    };

    this.transformUpdate = function (){
        for (var i = 0; i<this.p_scene.children.length; i++){
            if (this.p_scene.children[i] instanceof THREE.TransformControls)
                this.p_scene.children[i].update();
        }
    };
    
    this.initScene = function (object_3d) {
        this.p_scene.add(object_3d);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.25),
            directLight1 = new THREE.DirectionalLight(0xffffff, 0.25),
            directLight2 = new THREE.DirectionalLight(0xffffff, 0.25),
            directLight3 = new THREE.DirectionalLight(0xffffff, 0.25),
            directLight4 = new THREE.DirectionalLight(0xffffff, 0.25);

        directLight1.position.set(-1000,     0, 1000);
        directLight2.position.set( 1000,     0, 1000);
        directLight4.position.set(    0,  1000, 1000);
        directLight3.position.set(    0, -1000, 1000);

        this.p_scene.add(ambientLight);
        this.p_scene.add(directLight1);
        this.p_scene.add(directLight2);
        this.p_scene.add(directLight3);
        this.p_scene.add(directLight4);

        return this.p_renderer.domElement;
    }
}