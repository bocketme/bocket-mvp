$(() => {
  $(document).on('click', (e) => {
    const target = $(e.target);
    if (target.is('.specs') || target.is('.specs-span')) {
    } else {
      $('.collection-item-files').removeClass('active');
    }
  });

  $('i.material-icons.assembly').click();
  $('body').on('click', '.three-node', loadNodeInformation);
  $('body').on('click', '.search_child', nodeChildrenChargement);
  $('body').on('click', '.collection-item-files', function () {
    $(this).siblings('li').removeClass('active');
    $(this).addClass('active');
  });
});

const headerTitle = new class HeaderTitle {
  constructor() {
    this.title = $('#node-title');
    this.breadcrumb = document.getElementById('node-breadcrumb');
  }

  breadcrumbConstructor(bread) {
    while (this.breadcrumb.firstChild) { this.breadcrumb.removeChild(this.breadcrumb.firstChild); }
    bread.forEach((breadcrumb) => {
      const link = document.createElement('a');
      link.className = 'breadcrumb';
      link.innerHTML = breadcrumb;
      this.breadcrumb.appendChild(link);
    });
  }

  update(nodeInfo) {
    this.title.text(nodeInfo.title);
    this.breadcrumbConstructor(nodeInfo.breadcrumb.split('/'));
  }
}();

function nodeChildrenChargement(event) {
  const element = $(event.currentTarget);
  const nodeId = element.attr('id');
  const breadcrumbs_value = element.contents().filter('span.p-node').attr('data-breadcrumbs');
  const sub_level = element.contents().filter('span.p-node').attr('data-sublevel');
  element.removeClass('search_child');
  socket.emit('nodeChildren', nodeId, breadcrumbs_value, sub_level);
}

function loadNodeInformation(event) {
  $('#activity-tab').tabs('select_tab', 'activity');
  // Initialisation
  const element = $(event.currentTarget);
  console.log(element);
  const nodeId = element.attr('id');
  idOfchoosenNode = nodeId;

  const fill_value = element.contents().filter('span.p-node').html();
  const breadcrumbs_value = element.contents().filter('span.p-node').attr('data-breadcrumbs');
  const sub_level = element.contents().filter('span.p-node').attr('data-sublevel');
  const node_type = element.contents().filter('span.p-node').attr('data-node');

  if (nodeId === undefined) { Materialize.toast('Error, The node selected has no ID', 2000); }

  // CSS EFFECT
  if (!element.hasClass('selected-accordion')) {
    $('#specs-collection').empty();
    socket.emit('nodeInformation', nodeId);
  }

  $('.collapsible-header.three-node').removeClass('selected-accordion');
  element.addClass('selected-accordion');

  // Value to change - VUE.JS
  headerTitle.update({
    title: fill_value,
    breadcrumb: breadcrumbs_value,
  });

  const buttonNativeDownload = $('#download-native');
  buttonNativeDownload.attr('href', '#!');
  /*
    TODO: Location...
    clearComments($("#activity-comments-location"));
    socket.emit("getActivities", {
        nodeId: idOfchoosenNode,
        viewType: ViewTypeEnum.location
    });
    */
  clearComments($('#activity-comments-content'));
  socket.emit('getActivities', {
    nodeId: idOfchoosenNode,
    viewType: ViewTypeEnum.content,
  });
}

socket.on('deleteNode', (nodeId) => {
  deleteNode(nodeId);
  const updateNodeEvent = new CustomEvent('[Viewer] - remove', { nodeId });
  document.dispatchEvent(updateNodeEvent);
});

function deleteNode(nodeId) {
  $(`#${nodeId}.collapsible-header`).parent().remove();
}
