/**
 * Worker who add a Part
 * @param event
 */
onAddPart = function (event) {
    let json = event.data;
    var meshes = parseList(json.meshes, parseMesh);
    var materials = parseList(json.materials, parseMaterial);
    postMessage(parseObject(json, json.rootnode, meshes, materials));
};

function parseList(json, handler) {
    let meshes;

    for(let i = 0; i < json.length; ++ i){
        meshes.push(handler.call( this , json[ i ] ));
    }
    return meshes;
}

function parseMesh( json ){
    var geometry = new THREE.BufferGeometry();

    var i, l, face;

    var indices = [];

    var vertices = json.vertices || [];
    var normals = json.normals || [];
    var uvs = json.texturecoords || [];
    var colors = json.colors || [];

    uvs = uvs[ 0 ] || []; // only support for a single set of uvs

    for ( i = 0, l = json.faces.length; i < l; i ++ ) {

        face = json.faces[ i ];
        indices.push( face[ 0 ], face[ 1 ], face[ 2 ] );

    }

    geometry.setIndex( indices );
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    if ( normals.length > 0 )
        geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

    if ( uvs.length > 0 )
        geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    if ( colors.length > 0 )
        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    return geometry;
}


function parseMaterial( json ) {

    var material = new THREE.MeshPhongMaterial();

    for ( var i in json.properties ) {

        var property = json.properties[ i ];
        var key = property.key;
        var value = property.value;

        switch ( key ) {

            case '$tex.file': {
                var semantic = property.semantic;

                // prop.semantic gives the type of the texture
                // 1: diffuse
                // 2: specular mao
                // 5: height map (bumps)
                // 6: normal map
                // more values (i.e. emissive, environment) are known by assimp and may be relevant

                if ( semantic === 1 || semantic === 2 || semantic === 5 || semantic === 6 ) {
                    var keyname;
                    switch ( semantic ) {
                        case 1:
                            keyname = 'map';
                            break;
                        case 2:
                            keyname = 'specularMap';
                            break;
                        case 5:
                            keyname = 'bumpMap';
                            break;
                        case 6:
                            keyname = 'normalMap';
                            break;
                    }

                    var texture = textureLoader.load( value );

                    // TODO: read texture settings from assimp.
                    // Wrapping is the default, though.
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    material[ keyname ] = texture;
                }
                break;
            }

            case '?mat.name':
                material.name = value;
                break;

            case '$clr.diffuse':
                material.color.fromArray( value );
                break;

            case '$clr.specular':
                material.specular.fromArray( value );
                break;

            case '$clr.emissive':
                material.emissive.fromArray( value );
                break;

            case '$mat.shininess':
                material.shininess = value;
                break;

            case '$mat.shadingm':
                // aiShadingMode_Flat
                material.flatShading = ( value === 1 ) ? true : false;
                break;

            case '$mat.opacity':
                if ( value < 1 ) {
                    material.opacity = value;
                    material.transparent = true;
                }
                break;
        }
    }
    return material;
}