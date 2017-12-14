/**
 * @description
 * @author bocket.me
 * @param {HTMLElement} renderingDiv
 */

import AxisScene from './init/scene_axis';
import ViewerScene from './init/scene_3d';
import object3D from './init/object3D';

import {matrixCompose, matrixDecompose} from "./viewer_module/matrix"
import {rayToAssembly, rayToGroup, rayToObject} from "./viewer_module/ray"
import {fitToScreen, resize} from "./viewer_module/viewer"
import {addTransform, removeTransform, setTransformMode, changeTransformSpace} from "./viewer_module/transform";

var renderArea = document.getElementById('renderDiv');
var mousePos;

var Viewer = function (file3D) {
    console.time("viewer_init");
    /******************************************************************/
    /*Verification for the Viewer*/
    if (!(this instanceof Viewer))
        return console.error(new Error('Bad instanciation'));

    /******************************************************************/
    /* renderArea Information */

    var p_width = renderArea.offsetWidth,
        p_height = renderArea.offsetHeight,
        p_axisSize = p_height * 0.15,
        p_aspectRatio = renderArea.clientWidth / renderArea.clientHeight;

    /******************************************************************/
    /* Initialization of scenes */
    console.time("scene_3d : Initialisation");
    var scene_3d = new ViewerScene(p_width, p_height, p_aspectRatio);
    console.timeEnd("scene_3d : Initialisation");
    console.time("scene_axis : Initialisation");
    var scene_axis = new AxisScene(p_axisSize);
    console.timeEnd("scene_axis : Initialisation");

    console.time("Binding scenes");
    /*******************************************************************/
    /* Bind the camera of the scene_3d with the camera of the scene_axis */
    scene_axis.p_camera.up.copy(scene_3d.p_camera.up);
    scene_axis.p_camera.position.copy(scene_3d.p_camera.position);
    scene_axis.p_camera.position.setLength(200);
    scene_axis.p_camera.lookAt(scene_axis.p_camera);
    console.timeEnd("Binding scenes");

    /******************************************************************/
    /* initialisation de la scene_3d */
    var meshGeometry = object3D(file3D);
    var p_scene_3d_dom = scene_3d.initScene(meshGeometry);
    var p_scene_axis_dom = scene_axis.initScene();

    renderArea.appendChild(p_scene_3d_dom);
    renderArea.appendChild(p_scene_axis_dom);

    console.timeEnd("viewer_init");

    function animate() {
        requestAnimationFrame(animate);

        /* render the scenes */
        scene_3d.render();
        scene_axis.render();

   }
    /* update the scenes */
    scene_axis.update(scene_3d.p_camera.position);
    scene_axis.p_controls.update();

    scene_3d.transformUpdate();
    scene_3d.p_controls.update();


    /* ************************************************************************** */

    this.domElement = renderArea;
    this.scenes     = [scene_3d.p_scene   ,  scene_axis.p_scene];
    this.cameras    = [scene_3d.p_camera  ,  scene_axis.p_camera];
    this.renderers  = [scene_3d.p_renderer,  scene_axis.p_renderer];
    this.controls   = [scene_3d.p_controls,  scene_axis.p_controls];

    /* ************************************************************************** */
    animate();
    //renderArea.addEventListener('mouseup', onMouseUp);
    //renderArea.addEventListener('mousedown', onMouseDown);
};


/* ************************************************************************** */

Viewer.prototype.constructor = Viewer;

/* ************************************************************************** */

/* Screen modifications */

/**
 * @description [Event Function] Returns the THREE.Group directly related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.fitToScreen = fitToScreen;

/**
 * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.resize = resize;


/* ************************************************************************** */
/* Rays */

/**
 * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToAssembly = rayToAssembly;

/**
 * @description [Event Function] Returns the THREE.Group directly related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToGroup = rayToGroup;

/**
 * @description [Event Function] Returns the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToObject = rayToObject;

/* ************************************************************************** */
/* Matrix */


/**
 * @description Assemble a matrix4 from the position, rotation and scale components of an object and returns this matrix
 * @param  {THREE.Vector3} pos Position vector of the object
 * @param  {THREE.Euler} rot Euler angle of the object
 * @param  {THREE.Vector3} scale Scale vector of the object
 * @return {THREE.Matrix4}
 */
Viewer.prototype.matrixCompose = matrixCompose;

/**
 * @description Disassembles a matrix4 into its position, rotation and scale components and returns them in a JSON object
 * @param {THREE.Matrix4} matrix
 * @return {JSON}
 */
Viewer.prototype.matrixDecompose = matrixDecompose;


/* ************************************************************************** */
/* Transform */

/**
 * @description Adds the transformation axis to the object parameter
 * @param {THREE.Group} object object you want the transformation axis to be attached to
 */
Viewer.prototype.addTransform = addTransform;


/* ************************************************************************** */

/**
 * @description Removes the transformation axis from the scene
 */
Viewer.prototype.removeTransform = removeTransform;


/* ************************************************************************** */

/**
 * @description Changes the transformation axis mode between 'translate', 'rotate' and 'scale'
 * @param {string} mode A string with the mode wanted for the transformation axis
 */
Viewer.prototype.setTransformMode = setTransformMode;

/* ************************************************************************** */

/**
 * @description
 */
Viewer.prototype.changeTransformSpace = changeTransformSpace;

/* ************************************************************************** */


var viewer;
socket.on('contentFile3d', (file3d) => {
    var _file3d = JSON.parse(file3d);
    viewer = new Viewer(_file3d);
    console.log(viewer);
});
/* ************************************************************************** */
/*                                                                            */
/*                               EVENT FUNCTIONS                              */
/*                                                                            */
/* ************************************************************************** */


var onWindowResize = function () {
    if(viewer)
        viewer.resize();
};

/* ************************************************************************** */


var onMouseUp = function (event) {
    var mouse3D = new THREE.Vector3((event.offsetX / renderArea.clientWidth) * 2 - 1, -(event.offsetY / renderArea.clientHeight) * 2 + 1, 0.5);
    var transform;

    if (mousePos.x !== event.offsetX || mousePos.y !== event.offsetY)
        return;

    //if (annot_mode)
    //    viewer.addAnnotation(mouse3D, viewer.selectObjectAtMousePos(event.offsetX, event.offsetY));
    //else {
        if ((ray = viewer.rayToObject(event.offsetX, event.offsetY)))
            viewer.addTransform(ray.object);
        else
            viewer.removeTransform();
    //}
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