export function fitToScreen () {
    var object  = this.scenes[0].children[5];

    var box     = new THREE.Box3().setFromObject(object),
        center  = box.getCenter();

    if (object instanceof THREE.Group) {
        this.cameras[0].position.set(center.x, -(center.y + Math.abs(box.getSize().y / Math.sin((this.cameras[0].fov * (Math.PI / 180)) / 2))), box.max.z * (10 / Math.log(box.max.z)));
        this.cameras[0].lookAt(center);
        this.controls[0].target = center;
    }
}

export function resize () {
    var element = this.domElement;

    this.cameras[0].aspect = (element.clientWidth       ) / (element.clientHeight       );
    this.cameras[1].aspect = (element.clientWidth * 0.15) / (element.clientHeight * 0.15);

    this.cameras[0].updateProjectionMatrix();
    this.cameras[1].updateProjectionMatrix();

    this.renderers[0].setSize((element.offsetWidth        ), (element.offsetHeight       ));
    this.renderers[1].setSize((element.offsetHeight * 0.15), (element.offsetHeight * 0.15));
}