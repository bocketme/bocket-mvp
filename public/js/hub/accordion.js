$(() => {
  $(document).on('click', (e) => {
    const target = $(e.target);
    if (target.is('.specs') || target.is('.specs-span')) {
    } else {
      $('.collection-item-files').removeClass('active');
    }
  });

  // $('.hide-show').on('show', showPartOrAssembly);

  $('i.material-icons.assembly').click();
  $('body').on('click', '.three-node', loadNodeInformation);
  $('body').on('click', '.hide-show', hideOrShowNode);
  $('body').on('hideOrShowPart', '.hide-show', (event, isVisible) => {
    const element = $(event.currentTarget);
    const parentElem = $(event.currentTarget.parentElement);
    const nodeId = parentElem.attr('id');
    if (isVisible) {
      element.removeClass('is-not-visible');
      element.addClass('is-visible');
      element.text('visibility');
    } else {
      element.removeClass('is-visible');
      element.addClass('is-not-visible');
      element.text('visibility_off');
    }
  });
  $('body').on('hideOrShowAssembly', '.hide-show', (event, isVisible) => {
    const element = $(event.currentTarget);
    const parentElem = $(event.currentTarget.parentElement);
    const nodeId = parentElem.attr('id');

    const listItem = $(event.currentTarget.parentElement.parentElement);
    const parentUl = listItem.parent().closest('li');


    if (isVisible) {
      element.removeClass('is-not-visible');
      element.addClass('is-visible');
      element.text('visibility');
      parentUl.children('div:first').children('i').trigger('hideOrShowAssembly', [true]);
    } else {
      element.removeClass('is-visible');
      element.addClass('is-not-visible');
      element.text('visibility_off');
    }
  });

  $('body').on('click', '.collection-item-files', function () {
    $(this).siblings('li').removeClass('active');
    $(this).addClass('active');
  });

  $('.search_child').click();
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

function hideOrShowNode(event) {
  const listItem = $(event.currentTarget.parentElement.parentElement);
  const parentElem = $(event.currentTarget.parentElement);
  const element = $(event.currentTarget);
  var length = listItem.has('div.collapsible-body').length;
  const nodeId = parentElem.attr('id');
  $(`#${nodeId}`).trigger('click');
  const parentUl = listItem.parent().closest('li');

  if (length) {
    const elementBody = $('#' + nodeId + '-body').find('ul.collapsible li');
    if (element.hasClass('is-visible')) {
      element.trigger('hideOrShowAssembly', [false]);
      elementBody.find('i.hide-show').trigger('hideOrShowPart', [false]);
    } else {
      element.trigger('hideOrShowAssembly', [true]);
      elementBody.find('i.hide-show').trigger('hideOrShowPart', [true]);
      // parentUl.children('div:first').children('i').trigger('hideOrShowAssembly', [true]);
    }
  } else {
    if (element.hasClass('is-visible')) {
      element.trigger('hideOrShowPart', [false]);
    } else {
      element.trigger('hideOrShowPart', [true]);
      parentUl.children('div:first').children('i').trigger('hideOrShowAssembly', [true]);
    }
  }
}

function nodeChildrenChargement(event) {
  const element = $(event.target);
  if (element.hasClass('search_child')) {
    const nodeId = element.attr('id');
    const breadcrumbs_value = element.contents().filter('span.p-node').attr('data-breadcrumbs');
    const sub_level = element.contents().filter('span.p-node').attr('data-sublevel');
    element.removeClass('search_child');
    socket.emit('nodeChildren', nodeId, breadcrumbs_value, sub_level);
  }
}

function loadNodeInformation(event) {
  const element = $(event.currentTarget);
  if (element.hasClass('hide-show')) return;

  $('#activity-tab').tabs('select_tab', 'activity');
  // Initialisation
  const nodeId = element.attr('id');
  idOfchoosenNode = nodeId;

  const fill_value = element.contents().filter('span.p-node').html();
  const breadcrumbs_value = element.contents().filter('span.p-node').attr('data-breadcrumbs');
  const sub_level = element.contents().filter('span.p-node').attr('data-sublevel');
  const node_type = element.contents().filter('span.p-node').attr('data-node');

  if (nodeId === undefined) { Materialize.toast('Error, The node selected has no ID', 2000); }

  if (!element.hasClass('hide-show')) {
    // CSS EFFECT
    if (!element.hasClass('selected-accordion')) {
      $('#specs-collection').empty();
      $('#notes-collection').empty();
      socket.emit('nodeInformation', nodeId);
    }

    $('.collapsible-header.three-node').removeClass('selected-accordion');
    element.addClass('selected-accordion');
  }

  // Value to change - VUE.JS
  headerTitle.update({
    title: fill_value,
    breadcrumb: breadcrumbs_value,
  });

  const buttonNativeDownload = $('#download-native');
  buttonNativeDownload.attr('href', '#!');
}

socket.on('[Node] - Delete', (nodeId) => {
  deleteNode(nodeId);
  const updateNodeEvent = new CustomEvent('[Viewer] - remove', { nodeId });
  document.dispatchEvent(updateNodeEvent);
});

function deleteNode(nodeId) {
  $(`#${nodeId}.collapsible-header`).parent().remove();
}
