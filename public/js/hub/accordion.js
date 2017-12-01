var threeChild = (node, parentId) => {
    var parent, parent_header, cible, breadcrumbs, sub_level,
        li = document.createElement('li'),
        image = document.createElement('img'),
        header = document.craeteElement('div'),
        text_header = document.createTextNode(node.title),
        span = document.createElement('span');

    if(!parentId) {
        parent = document.querySelector('.node_constructor');
        breadcrumbs = node.name;
        sub_level = 0;
    } else {
        parent = document.querySelector('.collapsible-body #'+parentId);
        cible = $(parent).contents().filter('div.row.colla');
        // Récupérer la breadcrumbs du node parent
        breadcrumbs = $('#'+ parentId + ' .collapside-header').contents().filter("span").attr("data-breadcrumbs");
        breadcrumbs += '/' + node.name;
        sub_level = $('.collapsible-header #'+parentId).attr("data-sublevel");
    }

    // Récuooérer le niveau du noeud supérieur

    span.setAttribute("data-breadcrumbs", breadcrumbs);
    image.setAttribute('class', 'responsive-img pad-right');
    span.appendChild(text_header);
    header.setAttribute("id", node._id);
    header.setAttribute("data-sublevel", sub_level);

    if (node.children) {
        header.setAttribute('class', 'collapside-header node has-child valign-wrapper ');

        image.setAttribute('src','/img/07-Assembly icon.svg');
        var body = document.createElement('div'),
            row = document.createElement('div'),
            icon = document.createElement('i'),
            text_icon = document.createTextNode('keyboard_arrow_right');

        icon.setAttribute('class', 'material-icons');
        body.setAttribute('class','collapsible-body');
        body.setAttribute('id', node.id);
        row.setAttribute('class', 'row colla');

        icon.appendChild(text_icon);
        header.appendChild(icon);
        header.appendChild(image);
        header.appendChild(span);

        li.appendChild(header);


        body.appendChild(row);
        li.appendChild(body);
    } else {
        header.setAttribute('class', 'collapsible-header node no-child valign-wrapper group-'+sub_level);
        image.setAttribute('src', '/img/07-Part icon.svg');
        header.appendChild(image);
        header.appendChild(span);
        li.appendChild(header);
    }
    cible.append(li);
};

$(document).ready(() => {
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
        console.log(node);
        threeChild(node.child, node.parent.id);
    })
});