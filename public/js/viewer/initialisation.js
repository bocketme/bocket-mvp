socket.on("nodeGetInfo", (data) => {
    // Récuprérer data.file3D

});

var Viewer;

Viewer.prototype.init = (file3D) => {
    let object3D = loadObjectFromJSON(data, 0xd6d6d6);

}

var loadObjectFromJSON = function (jsonObj, colors) {

            var geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
            var vertices = new Float32Array( jsonObj.geometry.geometry );

    // itemSize = 3 because there are 3 values (components) per vertex
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            var material = new THREE.MeshBasicMaterial( { color: colors } );
            var mesh = new THREE.Mesh( geometry, material );
            return mesh;

           /*
           var geometry = new THREE.BufferGeometry();
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            var material = new THREE.MeshBasicMaterial( { color: colors } );
            var mesh = new THREE.Mesh( geometry, material );
            scene.add(mesh);
            */
        };