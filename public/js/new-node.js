var socket = io('http://localhost:8080');

socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

/**
 * We check if the name is not empty
 */
function isNameNotEmpty(t) {
    if (t.length === 0) {
        //if is empty, we show an error to the user
        document.getElementById('name-error').classList.add("show");
        return false;
    } else {
        document.getElementById('name-error').classList.remove("show");
        return true;
    }
}

/**
 * When the user clicks on the submit button, 
 */
document.getElementById('node-submitbtn').addEventListener('click', function (e) {
    e.preventDefault();

    console.log('clicked');

    var newNodeName = document.getElementById('node_name').value,
        parentNodeSelect = document.getElementById('parent_node');

    var selected = parentNodeSelect[parentNodeSelect.selectedIndex];

    var parentNode = parentNodeSelect.options[parentNodeSelect.selectedIndex].value;
    var branchId = selected.getAttribute('branchid');

    /**
     * We perform some check, and if all is ok, we send the data to the server
     */
    if (isNameNotEmpty(newNodeName)) {
        socket.emit('newNode', {
            nodeName: newNodeName,
            parentNode: parentNode,
            branchId: branchId,
            projectId: getCurrentProjectId()

        });
        location.reload();
    }
});