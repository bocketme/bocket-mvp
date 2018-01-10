export default function object3D (file3D) {
    //return loadObjectFromJSON(file3D, 0x809fff);
    return loadObjectFromJSONAssimp(file3D, 0x809fff)
}

var loadObjectFromOBJ = function (name, obj, mtl) {
    var objLoader = new THREE.OBJLoader();

    var object;

    if (data.mtl)
        objLoader.setMaterials(new THREE.MTLLoader().parse(mtl));
    if (data.obj){
        geometry = objLoader.parse(obj);
        geometry.name = name;
        new Promise((resolve) => {
            geometry.traverse(function (child) {
                if (child.hasOwnProperty('geometry'))
                    child.geometry.computeBoundingBox();
            });
            resolve();
        }).then();
        return geometry;
    }
};

var loadObjectFromJSONAssimp = function (jsonObj, colors) {
    console.log(jsonObj);
    var object = new THREE.Group();
    object.name = jsonObj.rootnode.name;
    var material = new THREE.MeshBasicMaterial( { color: colors } );
    var promises = [];
    jsonObj.rootnode.children.forEach(child => {
        var p_mesh = jsonObj.meshes[child.meshes[0]];
        if (p_mesh){
            promises.push(new Promise((resolve) => {
                var loader = new THREE.AssimpJSONLoader();
                console.log(loader);
            }));
        }
    });

    Promise.all(promises)
        .then((meshes) => {
            //meshes.forEach(mesh => object.add(mesh));
        });
    return object;
};

var loadObjectFromJSON = function (jsonObj, colors) {

    var geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute(jsonObj.geometry, 3));
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var material = new THREE.MeshBasicMaterial( { color: colors } );
    var mesh = new THREE.Mesh( geometry, material );

    return mesh;

    /* var geometry = new THREE.BufferGeometry();
     geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
     var material = new THREE.MeshBasicMaterial( { color: colors } );
     var mesh = new THREE.Mesh( geometry, material );
     scene.add(mesh);*/
};