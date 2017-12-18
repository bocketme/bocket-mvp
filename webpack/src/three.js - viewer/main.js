import Viewer from './Viewer';
import * as THREE from "three";

var mousePos;
var renderArea = document.getElementById('renderDiv');
var viewer = new Viewer(renderArea);
console.log(viewer);

/* ************************************************************************** */
/*                                                                            */
/*                               SOCKET VIEWER                                */
/*                                                                            */
/* ************************************************************************** */

socket.on('contentFile3d', (file3d) => {
    console.log(file3d);
});

socket.on('contentPart3d', (documentID, file3d) => {

});


/* ************************************************************************** */
/*                                                                            */
/*                               EVENT FUNCTIONS                              */
/*                                                                            */
/* ************************************************************************** */


var onWindowResize = function () {
    if(viewer)
        viewer.resize();
};

/* ************************************************************************** */


var onMouseUp = function (event) {
    var mouse3D = new THREE.Vector3((event.offsetX / renderArea.clientWidth) * 2 - 1, -(event.offsetY / renderArea.clientHeight) * 2 + 1, 0.5);
    var transform;

    if (mousePos.x !== event.offsetX || mousePos.y !== event.offsetY)
        return;

    //if (annot_mode)
    //    three.js - viewer.addAnnotation(mouse3D, three.js - viewer.selectObjectAtMousePos(event.offsetX, event.offsetY));
    //else {
    if ((ray = viewer.rayToObject(event.offsetX, event.offsetY)))
        viewer.addTransform(ray.object);
    else
        viewer.removeTransform();
    //}
};

/* ************************************************************************** */

var onMouseDown = function (event) {
    mousePos = {
        x: event.offsetX,
        y: event.offsetY
    };
};

/* ************************************************************************** */
/*                                                                            */
/*                                   EVENTS                                   */
/*                                                                            */
/* ************************************************************************** */

window.addEventListener('resize', onWindowResize, false);
renderArea.addEventListener('mouseup', onMouseUp);
renderArea.addEventListener('mousedown', onMouseDown);