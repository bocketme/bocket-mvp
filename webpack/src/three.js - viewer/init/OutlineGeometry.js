export default function OutlineGeometry ( geometry, thresholdAngle ) {

    let outline = THREE.BufferGeometry();

    var thresholdDot = Math.cos( Math.PI / 180 * thresholdAngle );

    var edge = [ 0, 0 ], hash = {}, i, j, l, face, key;

    function sortFunction( a, b ) {

        return a - b;

    }

    var keys = [ 'a', 'b', 'c' ];

    var geometry2;

    if ( geometry.isBufferGeometry ) {

        geometry2 = new THREE.Geometry();
        geometry2.fromBufferGeometry( geometry );

    } else {

        geometry2 = geometry.clone();

    }

    geometry2.mergeVertices();
    geometry2.computeFaceNormals();

    var vertices = geometry2.vertices;
    var faces = geometry2.faces;

    for ( i = 0; i < faces.length; i ++ ) {

        face = faces[ i ];

        for ( j = 0; j < 3; j ++ ) {

            edge[ 0 ] = face[ keys[ j ] ];
            edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];

            var line = new THREE.Line3(vertices[edge[ 0 ]], vertices[edge[ 1 ]]);

            // for each vertex checks if it lies in the edge
            for ( var e = vertices.length - 1; e >= 0; e -- ) {
                if (e === edge[ 0 ] || e === edge[ 1 ]) continue;
                var v = vertices[e];
                var closestPoint = line.closestPointToPoint(v, true);
                if ((new THREE.Line3(closestPoint, v)).distance() < 1e-5) { //1e-5
                    // mark the current face as splitted so that his cords won't be considered
                    face.splitted = true;
                    // Add two new faces, created splitting the face in two
                    faces.push(new THREE.Face3(
                        e, face[ keys[ ( j + 2 ) % 3 ] ], face[ keys[ ( j ) % 3 ] ],
                        face.normal, face.color, face.materialIndex
                    ));
                    faces.push(new THREE.Face3(
                        e, face[ keys[ ( j + 2 ) % 3 ] ], face[ keys[ ( j + 1 ) % 3 ] ],
                        face.normal, face.color, face.materialIndex
                    ));
                    break;
                }
            }
            if (face.splitted) break;

        }

    }

    for ( i = faces.length - 1;  i >= 0; i -- ) {

        face = faces[ i ];

        if (face.splitted) continue;

        for ( j = 0; j < 3; j ++ ) {

            edge[ 0 ] = face[ keys[ j ] ];
            edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
            edge.sort( sortFunction );

            key = edge.toString();

            if ( hash[ key ] === undefined ) {

                hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };

            } else {

                hash[ key ].face2 = i;

            }

        }

    }

    var coords = [];

    for ( key in hash ) {

        var h = hash[ key ];

        // An edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
        if ( h.face2 !== undefined && faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {

            var vertex = vertices[ h.vert1 ];
            coords.push( vertex.x );
            coords.push( vertex.y );
            coords.push( vertex.z );

            vertex = vertices[ h.vert2 ];
            coords.push( vertex.x );
            coords.push( vertex.y );
            coords.push( vertex.z );

        }

    }

    outline.addAttribute( 'position', new THREE.Float32BufferAttribute( coords, 3 ) );
    console.log(outline);
    return outline
};

