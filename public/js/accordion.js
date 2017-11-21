var body_cascade = function(node, sub_level) {  
    var ul = document.createElement('ul'),
    result = child_cascade(node, sub_level);
    ul.setAttribute('class', 'collapsible');
    ul.setAttribute('data-collapsible', 'accordion');
    ul.appendChild(result);
    
    return ul;
}

var create_class = (sub_level) => {

    var sheet_nochild = document.createElement('style');
    var sheet_haschild = document.createElement('style');
    level = (sub_level * 17) 
    var text_sheet1 = ".group-"+sub_level+" { padding-left : " + (level+6) + "px }"
    sheet_nochild.innerHTML = text_sheet1;
    var text_sheet2 = ".group-"+sub_level+"-has-child { padding-left:" + level + "px }"
    sheet_haschild.innerHTML = text_sheet2;

    document.body.appendChild(sheet_nochild);
    document.body.appendChild(sheet_haschild);
    
}

var child_cascade = function(node, sub_level) {
    var li = document.createElement('li'),        
    image = document.createElement('img'),
    header = document.createElement('div'),
    text_header = document.createTextNode(node.title);
    image.setAttribute('class', 'responsive-img pad-right');
    
    if (node.children) {
        header.setAttribute('class', 'collapsible-header node has-child valign-wrapper group-'+sub_level+'-has-child ');
        
        image.setAttribute('src','/img/07-Assembly icon.svg');
        var body = document.createElement('div'),
        row = document.createElement('div'),
        data = document.createElement('div'),
        icon = document.createElement('icon'),
        text_icon = document.createTextNode('arrow_drop_down');
        
        icon.setAttribute('class', 'material-icons');
        body.setAttribute('class','collapsible-body');
        row.setAttribute('class', 'row colla');
        
        icon.appendChild(text_icon);
        header.appendChild(icon);
        header.appendChild(image);
        header.appendChild(text_header);
        
        li.appendChild(header);

        sub_level++
        create_class(sub_level);    
        node.children.forEach(function(child){
            var result = body_cascade(child, sub_level);
            row.appendChild(result);
        });
        
        
        body.appendChild(row);
        li.appendChild(body);
    } else {
        header.setAttribute('class', 'collapsible-header node no-child valign-wrapper group-'+sub_level);
        image.setAttribute('src', '/img/07-Part icon.svg');
        header.appendChild(image);
        header.appendChild(text_header);
        li.appendChild(header);
    }
    return li;
};

var result = body_cascade(twignode, 0);
var accordeon = document.querySelector('.node_constructor');
accordeon.appendChild(result);

$(document).ready(() => {
    console.log($('.collapsible-header.node:first'))
    $('.collapsible-header.node:first').css({'padding-left' : '0px'});
    $('.collapsible').css({'margin':'0'})
    $('.collapsible-header.node').click(function(el){
        $('.collapsible-header.node').removeClass('selected-accordion');
        $(this).addClass('selected-accordion')
    });
});