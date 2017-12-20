import Viewer from './Viewer';

var mousePos;
var renderArea = document.getElementById('renderDiv');
var viewer = new Viewer(renderArea);
Viewer.animate(viewer);
console.log(viewer);
/* ******************/
/*  SOCKET VIEWER   */
/* ******************/

socket.emit("start viewer", workspaceId);

socket.on("addPart", (file3d, parentID) => {
    if (viewer)
        viewer.addPart(JSON.parse(file3d), parentID);
    else
        console.warn("The viewer is not initialized");
});

socket.on("removePart", (nodeID, parentID) => {
    if (viewer)
        viewer.removeAssembly(nodeID, parentID);
    else
        console.warn("The viewer is not initialized");
});


socket.on("setAssembly", (nodeID, parentID) => {
    if (viewer)
        viewer.setAssembly(nodeID, parentID);
    else
        console.warn("The viewer is not initialized");
});


socket.on("addAssembly", (nodeID, parentID) => {
    if (viewer)
        viewer.addAssembly(nodeID, parentID);
    else
        console.warn("The viewer is not initialized");
});


socket.on("removeAssembly", (nodeID, parentID) => {
    if (viewer)
        viewer.removeAssembly(nodeID, parentID);
    else
        console.warn("The viewer is not initialized");
});

socket.on("setPart", (nodeID, parentID) => {
    if (viewer)
        viewer.setPart(nodeID, parentID);
    else
        console.warn("The viewer is not initialized");
});



/* ************************************************************************** */
/*                                                                            */
/*                                   EVENTS                                   */
/*                                                                            */
/* ************************************************************************** */

window.addEventListener('resize', onWindowResize, false);
renderArea.addEventListener('mouseup', onMouseUp);
renderArea.addEventListener('mousedown', onMouseDown);

var translate = $("#button-move-object");
console.log(translate);
translate.click(() => setViewer("translate"));

var rotate = $("#button-rotate-object");
rotate.click(() => setViewer("rotate"));

var scale = $("#button-scale-object");
scale.click(() => setViewer("scale"));

var increase_size = $("#button-increase-size");
increase_size.click(() => setViewer(viewer.p_objectControl.size+=0.1));

var decrease_size = $("#button-decrease-size");
decrease_size.click(() => setViewer( Math.max(viewer.p_objectControl.size-=0.1,0.1)));

/* *******************************/
/*         EVENT FUNCTIONS       */
/* *******************************/


function onWindowResize () {
    if(viewer)
        viewer.resize();
};

/* ************************************************************************** */

function onMouseUp (event) {
    var mouse3D = new THREE.Vector3((event.offsetX / renderArea.clientWidth) * 2 - 1, -(event.offsetY / renderArea.clientHeight) * 2 + 1, 0.5);
    var transform;

    if (mousePos.x !== event.offsetX || mousePos.y !== event.offsetY)
        return;
/*
    //if (annot_mode)
    //    three.js - viewer.addAnnotation(mouse3D, three.js - viewer.selectObjectAtMousePos(event.offsetX, event.offsetY));
    //else {
    if ((ray = viewer.rayToObject(event.offsetX, event.offsetY)))
        viewer.addTransform(ray.object);
    else
        viewer.removeTransform();
    //}
    */
};

/* ************************************************************************** */

function onMouseDown (event) {
    mousePos = {
        x: event.offsetX,
        y: event.offsetY
    };
}

function setViewer(mode) {
    if (viewer)
        viewer.setControlsMode(mode);
    else
        console.warn("The viewer is not initialized");
}