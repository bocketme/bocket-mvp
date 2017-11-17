var body_cascade = function(node, padding) {  
    var ul = document.createElement('ul'),
    result = child_cascade(node, padding);
    
    ul.setAttribute('class', 'collapsible');
    ul.setAttribute('data-collapsible', 'accordion');
    ul.appendChild(result);
    
    return ul;
}

var child_cascade = function(node, padding) {
    var li = document.createElement('li'),        
    image = document.createElement('img'),
    header = document.createElement('div'),
    text_header = document.createTextNode(node.title);
    padding += 24;
    image.setAttribute('class', 'responsive-img pad-right');
    header.setAttribute('class', 'collapsible-header node valign-wrapper');
    
    if (node.children) {
        padding -= 12;
        header.setAttribute('style', 'padding-left:' + (padding) + 'px;');        
        image.setAttribute('src','img/07-Assembly icon.svg');
        
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
        
        node.children.forEach(function(child){
            var result = body_cascade(child, padding);
            row.appendChild(result);
        });
        
        
        body.appendChild(row);
        li.appendChild(body);
    } else {
        console.log(padding)
        header.setAttribute('style', 'padding-left:' + padding + 'px;');        
        
        image.setAttribute('src', 'img/07-Part icon.svg');
        header.appendChild(image);
        header.appendChild(text_header);
        li.appendChild(header);
    }
    return li;
};

var result = body_cascade(twignode, -12);
console.log(result)
var accordeon = document.querySelector('.node_constructor');
accordeon.appendChild(result);

$(document).ready(() => {
    console.log($('.collapsible-header.node:first'))
    $('.collapsible-header.node:first').css({'padding-left' : '0px'});
    $('.collapsible').css({'margin':'0'})
    $('.collapsible-body').css({'padding' : '0'})
    $('.collapsible-header.node').click(function(el){
        $('.collapsible-header.node').removeClass('selected-accordion');
        $(this).addClass('selected-accordion')
    });
});