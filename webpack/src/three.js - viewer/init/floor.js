export default class Floor {
    constructor(){
        this.floorTexture = new THREE.TextureLoader().load('/img/viewer/checkboard.png');
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(100, 100);

        var floorMaterial = new THREE.MeshBasicMaterial({map:this.floorTexture, side: THREE.DoubleSide});
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        this.mesh = new THREE.Mesh(floorGeometry, floorMaterial);
        this.mesh.position.y = -0.5;
        this.mesh.position.x = Math.PI/2
    }

    update(position){
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.floorTexture.offset.set(position.x / 100 * this.floorTexture.repeat.x, position.y / 100 * this.floorTexture.repeat.y)
    }
}