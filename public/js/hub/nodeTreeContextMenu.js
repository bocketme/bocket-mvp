$(document).ready(function () {
    const nodeTreeContextMenu = $("#node-tree-context-menu");

    nodeTreeContextMenu.on("click", '#duplicate-node', duplicateNode);
    nodeTreeContextMenu.on("click", "#remove", removeNode);
});

function removeNode() {
    var node = $(pointedElem);
    if (!node.attr('id'))
        node = node.parent('div.three-node');
    Materialize.toast('Deletion In Process', 1000);
    socket.emit("deleteNode", node.attr("id"));
}

/**
 * Called when users want to duplicate a node
 */
function duplicateNode() {
    var elem = $(pointedElem);
    if (!elem.is('div'))
        elem = elem.parent('div');
    Materialize.toast('Duplication Under Treatment', 1000);
    socket.emit("duplicateNode", {
        nodeId: elem.attr("id"),
        sub_level: elem.contents().filter("span.p-node").attr("data-sublevel"),
        breadcrumb: elem.contents().filter("span.p-node").attr("data-breadcrumbs"),
    });
}