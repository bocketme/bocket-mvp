export default class Outline {
    constructor(color){
        this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
        this.name = null;
        this.resetopacity = false;
    }

    reset(scene){
        if (this.resetopacity){
            //Reset the opacity
            var object = scene.getObjectByName(this.name);
            object.material.opacity = 0.3;
            this.resetopacity = false;
        }
        this.name = null;
        scene.remove(this.mesh);
        delete this.mesh;
    }

    updatePosition(scene){
        if (this.mesh){
            var object = scene.getObjectByName(this.name);
            this.mesh.position.copy(object.getWorldPosition());
            this.mesh.quaternion.copy(object.getWorldQuaternion());
        }
    }

    addObject(scene, object){
        this.name = object.name;
        object.copy(this.object, true);
        console.log(this.mesh);
        this.object.traverse(obj => {

        });
        this.object.position.copy(object.getWorldPosition());
        this.object.quaternion.copy(object.getWorldQuaternion());
        this.object.scale.multiplyScalar(1.05);

        if (object.material.opacity !== 1) {
            object.material.opacity = 1;
        this.resetopacity = true;
        }

        this.mesh.material.opacity = object.material.opacity;
        console.log(this.mesh.material.opacity , object.material.opacity);
        this.mesh.material = this.material;
        scene.add(this.mesh);
    }
}