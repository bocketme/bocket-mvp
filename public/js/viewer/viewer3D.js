/* ************************************************************************** */
/*                                                                            */
/*                                    MAIN                                    */
/*                                                                            */
/* ************************************************************************** */


var renderArea = document.getElementById('renderDiv');

/*
socket.on ("nodeObject", (file3D) => {
    viewer     = new Viewer(renderArea, file3D);
})
*/
viewer = new Viewer(renderArea);

// var socket = io.connect('http://localhost:8080');
// var truc;

// socket.on('data3d', function (data) {
//     console.log(data);
// });

/* ************************************************************************** */
/*                                                                            */
/*                               EVENT FUNCTIONS                              */
/*                                                                            */
/* ************************************************************************** */


var onWindowResize = function () {
    viewer.resize();
};

/* ************************************************************************** */


var onMouseUp = function (event) {
    var mouse3D = new THREE.Vector3((event.offsetX / renderArea.clientWidth) * 2 - 1, -(event.offsetY / renderArea.clientHeight) * 2 + 1, 0.5);
    var transform;

    if (mousePos.x !== event.offsetX || mousePos.y !== event.offsetY)
        return;

    if (annot_mode)
        viewer.addAnnotation(mouse3D, viewer.selectObjectAtMousePos(event.offsetX, event.offsetY));
    else {
        if ((ray = viewer.rayToObject(event.offsetX, event.offsetY)))
            viewer.addTransform(ray.object);
        else
            viewer.removeTransform();
    }
};

/* ************************************************************************** */

var onMouseDown = function (event) {
    mousePos = {
        x: event.offsetX,
        y: event.offsetY
    };
};

/* ************************************************************************** */
/*                                                                            */
/*                                   EVENTS                                   */
/*                                                                            */
/* ************************************************************************** */

window.addEventListener('resize', onWindowResize, false);
renderArea.addEventListener('mouseup', onMouseUp);
renderArea.addEventListener('mousedown', onMouseDown);