var body_cascade = function(node) {  
    var ul = document.createElement('ul'),
    result = child_cascade(node);
    
    ul.setAttribute('class', 'collapsible');
    ul.setAttribute('data-collapsible', 'accordion');
    ul.appendChild(result);

    return ul;
}

var child_cascade = function(node) {

    var li = document.createElement('li'),        
    header = document.createElement('div'),
    text_header = document.createTextNode(node.title);
    
    header.setAttribute('class', 'collapsible-header');
    
    if (node.children) {

        var body = document.createElement('div'),
        row = document.createElement('div'),
        data = document.createElement('div'),
        icon = document.createElement('icon'),
        text_icon = document.createTextNode('arrow_drop_down');

        icon.setAttribute('class', 'material-icons');
        body.setAttribute('class','collapsible-body');
        row.setAttribute('class', 'row');

        icon.appendChild(text_icon);
        header.appendChild(icon);
        header.appendChild(text_header);

        li.appendChild(header);
        
        node.children.forEach(function(child){
            var result = body_cascade(child);
            row.appendChild(result);
        });

        
        body.appendChild(row);
        li.appendChild(body);
    } else {
        header.appendChild(text_header);
        li.appendChild(header);
    }
    return li;
};

var result = body_cascade(twignode);
console.log(result)
var accordeon = document.querySelector('.node_constructor');
accordeon.appendChild(result);

$(document).ready(() => {
    $('.collapsible').css({'margin':'0'})
    $('.collapsible-body').css({'padding' : '0'})
})
