/**
 * Created by jean-adrien Domage on 06/10/2017.
 */

/***
 *
 * @param vertices is a buffer containing 9 value describing three corner position
 */

var highlightSurface = function (vertices, colors) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: colors } );
    var mesh = new THREE.Mesh( geometry, material );
    scenes[1].add(mesh);
};

/***
 *
 * @param dataBlockA position data block From object A
 * @param dataBlockB position data block From object B
 * @returns {boolean} return number of difference
 */

var dataBlockcmp = function(dataBlockA, dataBlockB) {
    if (dataBlockA === null || dataBlockB === null)
        return 0;
    var surfaceDifference = 0;
    var v1 = [];
    var v2 = [];
    for(var dotIndex = 0; dotIndex < 3; dotIndex++) {
        var localDifference = 0;
        for (var dotPos = 0; dotPos < 3; dotPos++) {
            v1[dotPos] = dataBlockA[(dotIndex + 1) % 3][0][dotPos] - dataBlockA[dotIndex][0][dotPos];
            v2[dotPos] = dataBlockB[(dotIndex + 1) % 3][0][dotPos] - dataBlockB[dotIndex][0][dotPos];
            if (v1[dotPos] !== v2[dotPos]) {
                localDifference += 1;
            }
        }
        if (localDifference !== 0) {
            surfaceDifference += 1;
        }
    }
    return surfaceDifference;
};

/**
 *
 * @param objA first buffer of position point
 * @param buffB second buffer of position point
 * @param colors colors of the news surface object
 * @param scene buffer
 * @returns {number} return the number of differences found
 */

var localLoop = function(objectBuffer, positionBufferB) {
    var objectBufferB = {
        "diffnb" : 0,
        "buffOffset" : 0,
        "sizeMax" : 0,
        "blockSize" : 9,
        "dotSize" : 3,
        "dataBlock" : [[], [], []]
    };
    objectBufferB.sizeMax = positionBufferB.length;
    for(var index = 0; index < objectBufferB.sizeMax; index += objectBufferB.blockSize) {
        for (var offset = 0; offset < 9; offset += 3) {
            objectBufferB.dataBlock[offset / objectBufferB.dotSize][offset % objectBufferB.dotSize] =
                positionBufferB.subarray(index + offset, index + offset + 3);
        }
        var ret = dataBlockcmp(objectBuffer.dataBlock, objectBufferB.dataBlock)
        if (ret < 3) {
            return ret;
        }
    }
    return 1;
};

var objectDiff = function (positionBufferA, positionBufferB, colors) {
    var objectBuffer = {
        "diffnb" : 0,
        "buffOffset" : 0,
        "sizeMax" : 0,
        "blockSize" : 9,
        "dotSize" : 3,
        "dataBlock" : [[], [], []],
    };
    objectBuffer.sizeMax = positionBufferA.length;
    for(var index = 0; index < objectBuffer.sizeMax; index += objectBuffer.blockSize) {
        for (var offset = 0; offset < 9; offset += 3) {
            objectBuffer.dataBlock[offset / objectBuffer.dotSize][offset % objectBuffer.dotSize] =
                positionBufferA.subarray(index + offset, index + offset + 3);
        }
        var ret = localLoop(objectBuffer, positionBufferB)
        switch (ret) {
            case 0:
                highlightSurface(positionBufferB.subarray(index, index + 9), colors);
                break;
            case 2:
            highlightSurface(positionBufferB.subarray(index, index + 9), colors);
            break;
            case 3:
                highlightSurface(positionBufferB.subarray(index, index + 9), 0xB5E655);
                break;
        }
    }
    return objectBuffer.diffnb;
};