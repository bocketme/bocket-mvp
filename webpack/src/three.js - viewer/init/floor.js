export default class Floor {
    constructor(){
        this.floorTexture = new THREE.ImageUtils.loadTexture('img/checkboard.jpg');
        this.floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(10, 10);

        var floorMaterial = new THREE.MeshBasicMaterial({map:this.floorTexture, side: THREE.DoubleSide});
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        this.mesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.mesh.position.y = -0.5;
        this.mesh.position.x = Math.PI/2
    }
    update(position){
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.floorTexture.offset.set(position.x / w * this.floorTexture.repeat.x, position.y / h * this.floorTexture.repeat.y)
    }
}