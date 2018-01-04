import Viewer from './Viewer';

var mousePos;
var renderArea = document.getElementById('renderDiv');
var viewer = new Viewer(renderArea);
var _idSelected;
Viewer.animate(viewer);
console.log(viewer);

/* ******************/
/*  SOCKET VIEWER   */
/* ******************/

socket.on("[viewer] -> start chargement", (id, name) => {
    console.log("THE NODE " + name + " is loading ! id => " + id);
});

/*
socket.on("[viewer] -> end chargement", (id, name) => {
    console.log("THE NODE " + name + " is charged ! id => " + id);
});

socket.on("[viewer] -> error chargement", (id, name, err) => {
    console.warn("THE NODE " + name + " could'nt be charged ! id => " + id + "\n" + err)
});
*/
socket.emit("start viewer", workspaceId);

socket.on("addPart", (file3d, nodeID, matrix, parentID) => {
    if (viewer)
        viewer.addPart(JSON.parse(file3d), nodeID, matrix, parentID);
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


socket.on("addAssembly", (nodeID, matrix, parentID) => {
    if (viewer)
        viewer.addAssembly(nodeID, matrix, parentID);
    else
        console.warn("The viewer is not initialized");
});

socket.on("setMatrix", (nodeId, matrix) => {
    if (viewer)
        viewer.setMatrix(nodeId, matrix);
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

var translate = $("#button-move-object");
translate.click(() => {
    if (viewer instanceof Viewer) {
        if (viewer.s_objControls.getMode() == 'translate');
        viewer.s_objControls.setMode("translate");
    } else console.warn(new Error("Viewer is not initialized"));
});

var rotate = $("#button-rotate-object");
rotate.click(() => {
    if (viewer instanceof Viewer) {
        if (viewer.s_objControls.getMode() !== 'rotate')
            viewer.s_objControls.setMode("rotate");
    } else console.warn(new Error("Viewer is not initialized"));
});

//var fitToScreen = $();

var fullScreen = $("#button-fullscreen");
fullScreen.click(() => {
    if (viewer instanceof Viewer){

    } else console.warn(new Error("Viewer is not initialized"));
});

var reperePiece = $('#button-repere-piece');
reperePiece.click(() => {
    if (viewer instanceof Viewer){
        if (viewer.s_objControls.visible)
        viewer.s_objControls.visible = false;
        else viewer.s_objControls.visible = true
    } else console.warn(new Error("Viewer is not initialized"));
});


var wireframe = $("#button-wireframe");
wireframe.click(() => {
    if (viewer)
    viewer.toggleWireframe();
    else console.warn(new Error("Viewer is not initialized"));
});

var passport3D = $('#button-passport-3d');
passport3D.click(() => {
    if(viewer instanceof Viewer)
        console.log("...");
    else console.warn(new Error("Viewer is not initialized"));
});

var save = $('#button-save');
save.click(() => {
    viewer.save(socket);
});


$('body').on("click", ".three-node", (event) => {
    var element = event.currentTarget;
    var nodeId = element.id;
    console.log(nodeId);
    if (nodeId) {
        viewer.selectObject(nodeId);
    }
});

/* *******************************/
/*         EVENT FUNCTIONS       */
/* *******************************/


function onWindowResize() {
    if (viewer)
        viewer.resize();
};