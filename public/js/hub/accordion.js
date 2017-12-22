$(function () {
    $('i.material-icons.assembly').click();
    $('span.p-node').click(loadNodeInformation)
});

function loadNodeInformation(e) {

    console.log("LOADNODEINFORMATION");
    //Initialisation
    var element = $(this).parent();
    var nodeId = element.attr('id');
    idOfchoosenNode = nodeId;
    var fill_value = element.contents().filter("span.p-node").html();
    var breadcrumbs_value = element.contents().filter("span.p-node").attr("data-breadcrumbs");
    var sub_level = element.contents().filter("span.p-node").attr("data-sublevel");
    var node_type = element.contents().filter("span.p-node").attr("data-node");

    $("#content-title").text($(this).text());
    $("#content-img-title").attr("src", element.children("img").attr("src"));

    if (!nodeId)
    Materialize.toast('Error, The node selected has no ID', 2000);

    var selector = '#'+nodeId+'-body';

    //CSS EFFECT
    if(!element.hasClass("selected-accordion")){
        if (node_type === NodeTypeEnum.part)
            socket.emit('getPart', nodeId);
        else if (node_type === NodeTypeEnum.assembly)
            socket.emit('getAssembly', nodeId);
        else {
            Materialize.toast("Vous cherchez le chragement d'un noeud sans type", 200);
        }
    }
    $('.collapsible-header.three-node').removeClass('selected-accordion');
    element.addClass('selected-accordion');

    // Value to change - VUE.JS
    third_column.selectNode(fill_value, breadcrumbs_value);

    //Socket To Emit
    socket.emit("nodeInformation", nodeId);
    if ($(selector).hasClass("container")){
        console.log("socket Emitted");
        socket.emit("nodeChildren", nodeId, breadcrumbs_value, sub_level);
    }

    clearComments($("#activity-comments-location"));
    clearComments($("#activity-comments-content"));
    socket.emit("getActivityComments", {nodeId: idOfchoosenNode, viewType: ViewTypeEnum.location});
    socket.emit("getActivityComments", {nodeId: idOfchoosenNode, viewType: ViewTypeEnum.content});
}

$(document).ready(() => {
    $('.collapsible').css({
        'margin': '0'
    });

});