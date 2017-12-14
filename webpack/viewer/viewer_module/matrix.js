export function matrixCompose (pos, rot, scale) {
    return new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromEuler(rot), scale);
}

export function matrixDecompose (matrix) {
    var pos = new THREE.Vector3(),
        rot = new THREE.Quaternion(),
        scale = new THREE.Vector3();

    matrix.decompose(pos, rot, scale);

    return {pos: pos, rot: new THREE.Euler().setFromQuaternion(rot), scale: scale};
}