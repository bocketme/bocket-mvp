var body_cascade = function(node, sub_level, breadcrumbs) {
    var ul = document.createElement('ul'),
    result = child_cascade(node, sub_level, breadcrumbs);
    ul.setAttribute('class', 'collapsible');
    ul.setAttribute('data-collapsible', 'accordion');
    ul.appendChild(result);

    return ul;
};

var create_class = (sub_level) => {

    var sheet_nochild = document.createElement('style');
    var sheet_haschild = document.createElement('style');
    level = (sub_level * 8)
    var text_sheet1 = ".group-"+sub_level+" { padding-left : " + (level+32) + "px }"
    sheet_nochild.innerHTML = text_sheet1;
    var text_sheet2 = ".group-"+sub_level+"-has-child { padding-left:" + level + "px }"
    sheet_haschild.innerHTML = text_sheet2;

    document.body.appendChild(sheet_nochild);
    document.body.appendChild(sheet_haschild);

};

var child_cascade = function(node, sub_level, breadcrumbs) {
    var li = document.createElement('li'),
    image = document.createElement('img'),
    header = document.createElement('div'),
    text_header = document.createTextNode(node.title),
    span = document.createElement('span');

    breadcrumbs += (node.title);

    image.setAttribute('class', 'responsive-img pad-right');
    span.setAttribute("data-breadcrumbs", breadcrumbs);
    span.setAttribute('v-on:click.native', "selectNode('"+node.title +"','" + breadcrumbs +"')");
    span.appendChild(text_header);
    header.setAttribute("id", node._id);

    console.log("NODE = ", node);
    if (node.children && !node.children.length == 0) {
        console.log(node.children.length);
        breadcrumbs+= "/";
        header.setAttribute('class', 'collapsible-header node has-child valign-wrapper group-'+sub_level+'-has-child ');

        image.setAttribute('src','/img/07-Assembly icon.svg');
        var body = document.createElement('div'),
        row = document.createElement('div'),
        data = document.createElement('div'),
        icon = document.createElement('i'),
        text_icon = document.createTextNode('keyboard_arrow_right');

        icon.setAttribute('class', 'material-icons');
        body.setAttribute('class','collapsible-body');
        row.setAttribute('class', 'row colla');

        icon.appendChild(text_icon);
        header.appendChild(icon);
        header.appendChild(image);
        header.appendChild(span);

        li.appendChild(header);

        sub_level++;
        create_class(sub_level);
        node.children.forEach(function(child){
            var result = body_cascade(child, sub_level, breadcrumbs);
            row.appendChild(result);
        });


        body.appendChild(row);
        li.appendChild(body);
    } else {
        header.setAttribute('class', 'collapsible-header node no-child valign-wrapper group-'+sub_level);
        image.setAttribute('src', '/img/07-Part icon.svg');
        header.appendChild(image);
        header.appendChild(span);
        li.appendChild(header);
    }
    return li;
};

var result = body_cascade(twignode, 0, "");
var garbage = document.createElement('div');
garbage.appendChild(result);
var node_three = Vue.extend({
    template: garbage.innerHTML
});
new node_three().$mount('.node_constructor');

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
        console.log("newNode: ", node);
        $("#"+node.parent._id).parent().after("<p>" + node.child.name + "</p>")
    })
});