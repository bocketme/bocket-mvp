$(function () {
    $('i.material-icons.assembly').click();
    $('span.p-node').click(loadNodeInformation)
});

function loadNodeInformation(e) {

    //Initialisation
    var element = $(this).parent();
    var nodeId = element.attr('id');
    var fill_value = element.contents().filter("span.p-node").html();
    var breadcrumbs_value = element.contents().filter("span.p-node").attr("data-breadcrumbs");
    var sub_level = element.contents().filter("span.p-node").attr("data-sublevel");
    var node_type = element.contents().filter("span.p-node").attr("data-node");

    console.log(element);

    if (!nodeId)
    Materialize.toast('Error, The node selected has no ID', 2000);

    var selector = '#'+nodeId+'-body';

    //CSS EFFECT
    if(element.hasClass("selected-accordion")){
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

}

$(document).ready(() => {
    $('.collapsible').css({
        'margin': '0'
    });
});