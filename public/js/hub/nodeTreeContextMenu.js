$(document).ready(function () {
    var nodeTreeContextMenu = $("#node-tree-context-menu");

    nodeTreeContextMenu.on("click", '#duplicate-node', duplicateNode);
});

/**
 * Called when users want to duplicate a node
 */
function duplicateNode() {
    var elem = $(pointedElem);
    if (!elem.is('div'))
        elem = elem.parent('div');
    console.log("DUPLICATE NODE", {id: elem.attr("id")});
    socket.emit("duplicateNode", {nodeId: elem.attr("id")});
}