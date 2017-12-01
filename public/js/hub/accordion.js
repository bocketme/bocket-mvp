var imageBuilder = (type) => {
    var image = document.createElement('img');
    image.setAttribute('class', 'responsive-img pad-right');
    if (type == NodeTypeEnum.part){
        image.setAttribute('src', '/img/07-Part icon.svg');
    } else if (type == NodeTypeEnum.assembly) {
        image.setAttribute('src','/img/07-Assembly icon.svg');
    } else
        return console.error(new Error(''));

    return image;
};

var iconBuilder = (type) => {
    if (type == NodeTypeEnum.part){
        return;
    } else if (type == NodeTypeEnum.assembly) {
        var icon = document.createElement('i'),
            text_icon = document.createTextNode('keyboard_arrow_right');
        icon.setAttribute('class', 'material-icons');
        icon.appendChild(text_icon);
        return icon;
    } else
        return console.error(new Error(''));

};

var threeChild = (node, parentId) => {
    console.log(node);
    if(!node.name)
    node.name = node.title;

      var parent, cible, breadcrumbs, sub_level,
          icon = iconBuilder(node.type),
          row = row = document.createElement('div'),
          body = document.createElement('div'),
          li = document.createElement('li'),
          image = imageBuilder(node.type),
          header = document.createElement('div'),
          text_header = document.createTextNode(node.name),
          span = document.createElement('span');

    if(!parentId) {
        cible = document.querySelector('.node_constructor');
        breadcrumbs = node.name;
        sub_level = 0;
    } else {
        parent = document.querySelector('.collapsible-body #'+parentId);
        cible = $(parent).contents().filter('div.row.colla');
        breadcrumbs = $('#'+ parentId + ' .collapside-header').contents().filter("span").attr("data-breadcrumbs");
        breadcrumbs += '/' + node.name;
        sub_level = $('.collapsible-header #'+parentId).contents().filter("span").attr("data-sublevel");
        sub_level++
    }

    // Récuooérer le niveau du noeud supérieur

    span.setAttribute("data-breadcrumbs", breadcrumbs);
    span.setAttribute("data-sublevel", sub_level);
    span.appendChild(text_header);
    header.setAttribute("id", node._id);

    body.setAttribute('class','collapsible-body');
    body.setAttribute('id', node._id);
    row.setAttribute('class', 'row colla');

    if (node.type == NodeTypeEnum.assembly) {
        header.setAttribute('class', 'collapside-header node has-child valign-wrapper ');
        header.appendChild(icon);
        header.appendChild(image);
        header.appendChild(span);
        li.appendChild(header);
        body.appendChild(row);
        li.appendChild(body);
    } else {
        header.setAttribute('class', 'collapsible-header node no-child valign-wrapper group-'+sub_level);
        header.appendChild(image);
        header.appendChild(span);
        li.appendChild(header);
        body.appendChild(row);
        li.appendChild(body);
    }
    cible.append(li);
};

var newChild = (node, parentId) => {
    if (!parentId)
        return console.error(new Error( "No ParentID defined"));

    if(!node.name)
        node.name = node.title;

    var parent_header, cible, breadcrumbs, sub_level,
        row = row = document.createElement('div'),
        body = document.createElement('div'),
        li = document.createElement('li'),
        image = document.createElement('img'),
        header = document.createElement('div'),
        text_header = document.createTextNode(node.name),
        span = document.createElement('span');

    parent_header = document.querySelector('.collapsible-header #'+ node._id);
    cible = document.querySelector('.collapsible-body #' + node._id);

    //
    var data_header;
    data_header = parent_header.innerHTML;
    parent_header.innerHTML = "";

    var icon = iconBuilder(node.type);

    icon.setAttribute('class', 'material-icons');

    icon.appendChild(text_icon);
    parent_header.appendChild(icon);
    parent_header.data
    //
    breadcrumbs = $(parent_header).contents().filter("span").attr("data-breadcrumbs");
    sub_level = $(parent_header).contents().filter("span").attr("data-sublevel");
    sub_level++;

    breadcrumbs+= "/" + node.name;

    span.setAttribute("data-breadcrumbs", breadcrumbs);
    image.setAttribute('class', 'responsive-img pad-right');
    span.appendChild(text_header);
    header.setAttribute("id", node._id);
    header.setAttribute("data-sublevel", sub_level);

    header.setAttribute('class', 'collapsible-header node no-child valign-wrapper group-'+sub_level);
    image.setAttribute('src', '/img/07-Part icon.svg');
    header.appendChild(image);
    header.appendChild(span);
    li.appendChild(header);
    body.appendChild(row);
    li.appendChild(body);
    cible.appendChild(li);

};

$(document).ready(() => {
    threeChild(twignode);
    $('.collapsible').css({'margin':'0'})
    $('.collapsible-header.node').click(function(el){
        $('.collapsible-header.node').removeClass('selected-accordion');
        $(this).addClass('selected-accordion');
        idOfchoosenNode = $(this).attr("id");
        var fill_value = $(this).contents().filter("span").html();
        var breadcrumbs_value = $(this).contents().filter("span").attr("data-breadcrumbs");
        third_column.selectNode(fill_value, breadcrumbs_value);
    });

    socket.on("newNode", function (node) {
        newChild(node.child, node.parent._id);
    })
    socket.on(

    )
});