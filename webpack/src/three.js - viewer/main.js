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

socket.on("[viewer] -> end chargement", (id, name) => {
    console.log("THE NODE " + name + " is charged ! id => " + id);
});

socket.on("[viewer] -> error chargement", (id, name, err) => {
    console.warn("THE NODE " + name + " could'nt be charged ! id => " + id + "\n" + err)
});

socket.emit("start viewer", workspaceId);

socket.on("addPart", (file3d, nodeID, parentID) => {
    if (viewer)
        viewer.addPart(JSON.parse(file3d), nodeID, parentID);
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

var translate = $("#button-move-object");
translate.click(() => {
    if (viewer) {
        if (viewer.s_objControls.getMode() == 'translate');
        viewer.s_objControls.setMode("translate");
    } else console.warn(new Error("Viewer is not initialized"));
});

var rotate = $("#button-rotate-object");
rotate.click(() => {
    if (viewer) {
        if (viewer.s_objControls.getMode() !== 'rotate')
            viewer.s_objControls.setMode("rotate");
    } else console.warn(new Error("Viewer is not initialized"));
});

var scale = $("#button-scale-object");
scale.click(() => {
    if (viewer) {
        if (viewer.s_objControls.getMode() !== 'scale')
            viewer.s_objControls.setMode("scale");
    } else console.warn(new Error("Viewer is not initialized"));
});

var increase_size = $("#button-increase-size");
increase_size.click(() => {
    viewer.s_objControls.setSize(viewer.s_objControls.size += 0.1)
});

var decrease_size = $("#button-decrease-size");
decrease_size.click(() => {
    viewer.s_objControls.setSize(Math.max(viewer.s_objControls.size -= 0.1, 0.1))
});

var node = $();

$('body').on("click", ".three-node", (event) => {
    var element = event.currentTarget;
    var nodeId = element.id;
    console.log(nodeId);
    if (nodeId) {
        viewer.selectObject(nodeId);
    }
});

var wireframe = $("#button-wireframe");
wireframe.click(() => {
    viewer.toggleWireframe();
})

/* *******************************/
/*         EVENT FUNCTIONS       */
/* *******************************/


function onWindowResize() {
    if (viewer)
        viewer.resize();
};