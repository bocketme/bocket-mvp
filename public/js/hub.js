$(document).ready(function() {
    var i = [1];
        /*
    var node_constructor = function(node, i) {
        var text = document.createTextNode(node.title),
        li = document.createElement('li'),
        a = document.createElement('a'),
        link = "/node/"+node.title;
        a.setAttribute('href', link);
        a.appendChild(text);
        if (node.children){
            li.setAttribute("class", "has-children")
            var input = document.createElement('input'),
            label = document.createElement('label'),
            ul = document.createElement('ul');
            input.setAttribute('type', 'checkbox');
            ul.setAttribute("class", "space-left");
            var name = naming(i);
            input.setAttribute('name', name);
            input.setAttribute('id', name);
            label.setAttribute('for', name);
            label.appendChild(a);
            li.appendChild(input);
            li.appendChild(label);
            i.push(1);
            node.children.forEach(function(child) {
                i[i.length - 1] = i[i.length - 1]++
                var list = node_constructor(child, i)
                ul.appendChild(list);                        
            });
            li.appendChild(ul)
        } else {
            li.appendChild(a);
        }  
        return li;            
    }
    
    var naming = function (name){
        var result = 'group';
        name.forEach(function(val){
            result += '-' + val
        })
        return result;
    }
    var result = node_constructor(twignode, i);
    var accordeon = document.querySelector('.data-node');
    accordeon.appendChild(result);
    */
});