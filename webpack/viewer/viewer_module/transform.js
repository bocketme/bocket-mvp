export function addTransform (object) {
    var transform;

    if (!object) {
        this.removeTransform();
        return;
    }

    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.removeTransform();
    }

    transform = new THREE.TransformControls(this.cameras[0], this.renderers[0].domElement);
    transform.attach(object);
    this.scenes[0].add(transform);
}

export function removeTransform () {
    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls) {
            this.scenes[0].children[i].detach();
            this.scenes[0].children[i].parent.remove(this.scenes[0].children[i]);
        }
    }
}

export function setTransformMode (mode) {
    if (mode !== 'translate' && mode !== 'rotate' && mode !== 'scale')
        return;

    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.scenes[0].children[i].setMode(mode);
    }
}

export function changeTransformSpace() {
    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.scenes[0].children[i].setSpace(this.scenes[0].children[i].space === 'local' ? 'world' : 'local');
    }
};
