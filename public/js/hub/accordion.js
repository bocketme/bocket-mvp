$(function () {
    $('i.material-icons.assembly').click();
    $('body').on('click', '.three-node', loadNodeInformation);
    $('body').on('click', '.search_child', nodeChildrenChargement);
});

function nodeChildrenChargement(event){
    let element = $(event.currentTarget);
    let nodeId = element.attr('id');
    let breadcrumbs_value = element.contents().filter("span.p-node").attr("data-breadcrumbs");
    let sub_level = element.contents().filter("span.p-node").attr("data-sublevel");
    element.removeClass("search_child");
    socket.emit("nodeChildren", nodeId, breadcrumbs_value, sub_level);
}

function loadNodeInformation(event) {
  $('#activity-tab').tabs('select_tab', 'activity');
    //Initialisation
    let element = $(event.currentTarget);
    let nodeId = element.attr('id');
    idOfchoosenNode = nodeId;

    let fill_value = element.contents().filter("span.p-node").html();
    let breadcrumbs_value = element.contents().filter("span.p-node").attr("data-breadcrumbs");
    let sub_level = element.contents().filter("span.p-node").attr("data-sublevel");
    let node_type = element.contents().filter("span.p-node").attr("data-node");

    if (!nodeId)
        Materialize.toast('Error, The node selected has no ID', 2000);

    //CSS EFFECT
    if (!element.hasClass("selected-accordion"))
        socket.emit("nodeInformation", nodeId);
        
    $('.collapsible-header.three-node').removeClass('selected-accordion');
    element.addClass('selected-accordion');

    // Value to change - VUE.JS
    third_column.selectNode(fill_value, breadcrumbs_value);
    /*
    TODO: Location...
    clearComments($("#activity-comments-location"));
    socket.emit("getActivities", {
        nodeId: idOfchoosenNode,
        viewType: ViewTypeEnum.location
    });
    */
   clearComments($("#activity-comments-content"));
   socket.emit("getActivities", {
        nodeId: idOfchoosenNode,
        viewType: ViewTypeEnum.content
    });
}