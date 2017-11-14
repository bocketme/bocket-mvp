$(document).ready(function() {
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
    });
});

var construcor_node = function (node) {
    var div = document.getElementById('node');
    div.appendChild(node_constructor(node));
}

var node_constructor = (node, selector) => {
    var text = document.createTextNode(node.title);
    if (node.child) {
        var ul = document.createElement("button");
        var attr = document.createAttribute("class");
        attr.value = "notbutton"
        ul.setAttribute(attr);
        li.appendChild(text);
        node.children.forEach(child => {
            ul.appenChlid(node_constructor(child));
        }); 
    } else {
        var li = document.createElement("li");
        var attr = document.createAttribute("class");
        attr.value = "notbutton"
        li.setAttribute(attr);
        li.appendChild(text);
        return li;
    } 
}