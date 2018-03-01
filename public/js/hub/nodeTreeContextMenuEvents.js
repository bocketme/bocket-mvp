var p = workspaceId;

$(document).ready(function () {
        const contextMenu = $("#node-tree-context-menu");

        contextMenu.on("click", "#remove", function () {
            var node = $(pointedElem);
            console.log("deletede : ", node.attr("id"));
            socket.emit("deleteNode", node.attr("id"));
        });
});