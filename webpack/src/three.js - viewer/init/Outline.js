export default class Outline {
    constructor(color){
        this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
        this.name = null;
        this.resetopacity = false;
        this.mesh = new THREE.Group();
    }

    reset(scene){
        if (this.resetopacity){
            //Reset the opacity
            var object = scene.getObjectByName(this.name),
                i = 0;
            object.traverse(obj => {
                if (obj instanceof THREE.Mesh){
                    obj.material.opacity = 0.3;
                    i++;
                }
            });
            this.resetopacity = false;
        }
        this.name = null;
        scene.remove(this.mesh);
        delete this.mesh;
        this.mesh = new THREE.Group();
    }

    updatePosition(scene){
        if (this.mesh.name){
            var object = scene.getObjectByName(this.name);
            this.mesh.position.copy(object.getWorldPosition());
            this.mesh.quaternion.copy(object.getWorldQuaternion());
        }
    }

    addObject(scene, object){
        this.name = object.name;
        this.mesh.copy(object, true);
        this.mesh.traverse(obj => {
            if(THREE.Mesh){
                obj.material = this.material;
            }
        });
        this.mesh.position.copy(object.getWorldPosition());
        this.mesh.quaternion.copy(object.getWorldQuaternion());
        this.mesh.scale.multiplyScalar(1.05);

        object.traverse(obj => {
            if (object instanceof THREE.Mesh){
                if (obj.material.opacity !== 1) {
                    obj.material.opacity = 1;
                    this.resetopacity = true;
                }
            }
        });
        scene.add(this.mesh);
    }
}