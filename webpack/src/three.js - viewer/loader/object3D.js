import loadObjectFromJSONAssimp from './Assimp2json';
import loader from './assimp2json.worker'

export default function object3D (nodeID, file3D) {
    //return loadObjectFromJSON(file3D, 0x809fff);
    return loadObjectFromJSONAssimp(nodeID, file3D);
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