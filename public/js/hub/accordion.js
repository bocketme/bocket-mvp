$(function () {
    $('i.material-icons.assembly').click();
    $('body').on('click', '.three-node', loadNodeInformation);
    $('body').on('click', '.search_child', nodeChildrenChargement);
});


const headerTitle = new class HeaderTitle {
  constructor() {
    this.title = $('#node-title');
    this.breadcrumb = document.getElementById("node-breadcrumb");
  }

  breadcrumbConstructor(bread) {
      while(this.breadcrumb.firstChild)
        this.breadcrumb.removeChild(this.breadcrumb.firstChild);
    bread.forEach(breadcrumb => {
      let link = document.createElement('a');
      link.className = "breadcrumb";
      link.innerHTML = breadcrumb;
      console.log(link);
      this.breadcrumb.appendChild(link);
    })
  }

  update(nodeInfo) {
    this.title.text(nodeInfo.title);
    this.breadcrumbConstructor(nodeInfo.breadcrumb.split("/"));
  }
};

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
    if (!element.hasClass("selected-accordion")) {
      $("#specs-collection").empty();
      socket.emit("nodeInformation", nodeId);
    }

    $('.collapsible-header.three-node').removeClass('selected-accordion');
    element.addClass('selected-accordion');

    // Value to change - VUE.JS
    headerTitle.update({
      title: fill_value,
      breadcrumb:breadcrumbs_value
    });
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