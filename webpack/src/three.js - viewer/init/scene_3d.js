export default class ViewerScene{
    constructor(p_width, p_height, p_aspectRatio){
        this.p_scene = new THREE.Scene();

        this.p_renderer = new THREE.WebGLRenderer({canvas: renderSurface, alpha: true, antialias: true, logarithmicDepthBuffer: true});
        this.p_renderer.localClippingEnabled = true;
        this.p_renderer.setClearColor(0xffffff);
        this.p_renderer.setSize(p_width, p_height);

        this.p_camera = new THREE.PerspectiveCamera(60, p_aspectRatio, 1, 2147483647);
        this.p_camera.up.set(0, 0, 1);
        this.p_camera.position.set(0, -75, 50);

        this.p_controls = new THREE.OrbitControls(this.p_camera, this.p_renderer.domElement);
        this.p_controls.zoomSpeed = 1 / (Math.log10(this.p_camera.position.distanceTo(this.p_controls.target)));
    }

    render(){
        this.p_renderer.render(this.p_scene, this.p_camera);
    }

    transformUpdate(){
        for (var i = 0; i<this.p_scene.children.length; i++){
            if (this.p_scene.children[i] instanceof THREE.TransformControls)
                this.p_scene.children[i].update();
        }
    }

    initScene(renderArea){
        var group = new THREE.Group();
        group.name = 0;
        this.p_scene.add(group);
        renderArea.appendChild(this.p_renderer.domElement);
    }

    addGroupToScene(documentID, object3D) {
        let group = THREE.Group();

        group.name = documentID;
        group.add(object3D);

        this.p_scene.add(group);
    }

    addMeshToScene(documentID, object3D) {
        object3D.name = documentID;
        this.p_scene.add(object3D)
    }

    deleteGroupToScene(groupName){
        var object = this.p_scene.getObjectByName( groupName );
        this.p_scene.deleteGroupToScene( object.id )
    }

    deleteMeshToScene(groupName){
        var object = this.p_scene.getObjectByName( groupName );

    }

    static highlightSurface(vertices, colors) {
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.MeshBasicMaterial( { color: colors } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.name = "highlightSurface";
        this.p_scenes[0].add(mesh);
    }

}