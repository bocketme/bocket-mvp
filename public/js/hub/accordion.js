$(function () {
  $('i.material-icons.assembly').click();
  $('body').on('click', '.three-node', loadNodeInformation);
  $('body').on('click', '.search_child', nodeChildrenChargement);
});

function nodeChildrenChargement(event){
  var element = $(event.currentTarget);
  var nodeId = element.attr('id');
  var breadcrumbs_value = element.contents().filter("span.p-node").attr("data-breadcrumbs");
  var sub_level = element.contents().filter("span.p-node").attr("data-sublevel");
  console.log(element.hasClass("search_child"));
  element.removeClass("search_child");
  socket.emit("nodeChildren", nodeId, breadcrumbs_value, sub_level);
}

function loadNodeInformation(event) {

  //Initialisation
  var element = $(event.currentTarget);
  var nodeId = element.attr('id');
  idOfchoosenNode = nodeId;

  var fill_value = element.contents().filter("span.p-node").html();
  var breadcrumbs_value = element.contents().filter("span.p-node").attr("data-breadcrumbs");
  var sub_level = element.contents().filter("span.p-node").attr("data-sublevel");
  var node_type = element.contents().filter("span.p-node").attr("data-node");

  if (!nodeId)
    Materialize.toast('Error, The node selected has no ID', 2000);

  //CSS EFFECT
  if (!element.hasClass("selected-accordion")) {
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

  socket.emit("nodeInformation", nodeId);

  clearComments($("#activity-comments-location"));
  clearComments($("#activity-comments-content"));
  socket.emit("getActivities", {
    nodeId: idOfchoosenNode,
    viewType: ViewTypeEnum.location
  });
  socket.emit("getActivities", {
    nodeId: idOfchoosenNode,
    viewType: ViewTypeEnum.content
  });
}

socket.on("deleteNode", function (nodeId) {
  deleteNode(nodeId);
});

function deleteNode(nodeId) {
  $("#" + nodeId + ".collapsible-header").parent().remove();
}
