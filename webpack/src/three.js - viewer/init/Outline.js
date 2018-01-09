export default class Outline {
    constructor(color){
        this.material = new THREE.MeshBasicMaterial( { color: color || 0xff0000, side: THREE.BackSide } )
        this.name = null;
    }

    reset(scene){
        this.name = null;
        scene.remove(this.mesh);
        delete this.mesh;
    }

    addObject(object){
        this.name = object.name;
        this.mesh = object.clone();
        console.log(this.mesh);
        this.mesh.position.copy(object.getWorldPosition());
        this.mesh.quaternion.copy(object.getWorldQuaternion());
        this.mesh.scale.multiplyScalar(1.05);
        this.mesh.material.opacity = object.material.opacity;
        console.log(this.mesh.material.opacity , object.material.opacity);
        this.mesh.material = this.material;
    }

    addToScene(scene){
        scene.add(this.mesh);
    }
}