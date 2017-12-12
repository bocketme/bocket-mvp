/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__init_scene_axis__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__init_scene_3d__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__init_object3D__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__viewer_module_matrix__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__viewer_module_ray__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__viewer_module_viewer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__viewer_module_transform__ = __webpack_require__(15);
/**
 * @description
 * @author bocket.me
 * @param {HTMLElement} renderingDiv
 */










var Viewer = function (file3D) {

    /******************************************************************/
    /*Verification for the Viewer*/
    if (!(this instanceof Viewer))
        return console.error(new Error('Bad instanciation'));

    var renderArea = document.getElementById('renderDiv');

    /******************************************************************/
    /* renderArea Information */

    var p_width = renderArea.offsetWidth,
        p_height = renderArea.offsetHeight,
        p_axisSize = p_height * 0.15,
        p_aspectRatio = renderArea.clientWidth / renderArea.clientHeight;

    /******************************************************************/
    /* Initialization of scenes */
    var scene_3d = new __WEBPACK_IMPORTED_MODULE_1__init_scene_3d__["a" /* default */](p_width, p_height, p_aspectRatio);
    var scene_axis = new __WEBPACK_IMPORTED_MODULE_0__init_scene_axis__["a" /* default */](p_axisSize);

    /*******************************************************************/
    /* Bind the camera of the scene_3d with the camera of the scene_axis */
    scene_axis.p_camera.up.copy(scene_3d.p_camera.up);
    scene_axis.p_camera.position.copy(scene_3d.p_camera.position);
    scene_axis.p_camera.position.setLength(200);

    /******************************************************************/
    /* initialisation de la scene_3d */
    scene_3d.initScene(Object(__WEBPACK_IMPORTED_MODULE_2__init_object3D__["a" /* default */])(file3D));
    scene_axis.initScene();


    /******************************************************************/
    /* scene_axis biding to scene_3d */
    scene_axis.prototype.update = function () {
        this.p_camera.position.copy(scene_3d.p_camera.position);
        this.p_camera.position.setLength(200);
        this.p_camera.lookAt(this.p_scene.position);
    };

    function animate() {
        requestAnimationFrame(animate);

        /* render the scenes */
        scene_3d.render();
        scene_axis.render();

        /* update the scenes */
        scene_axis.update();
        scene_axis.p_controls.update();
        scene_3d.transformUpdate();
        scene_3d.p_controls.update();
    }


    /* ************************************************************************** */

    this.domElement = renderArea;
    this.scenes     = [scene_3d.p_scene   ,  scene_axis.p_scene];
    this.cameras    = [scene_3d.p_camera  ,  scene_axis.p_camera];
    this.renderers  = [scene_3d.p_renderer,  scene_axis.p_renderer];
    this.controls   = [scene_3d.p_controls,  scene_axis.p_controls];

    /* ************************************************************************** */

    animate();
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
Viewer.prototype.fitToScreen = __WEBPACK_IMPORTED_MODULE_5__viewer_module_viewer__["a" /* fitToScreen */];

/**
 * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.resize = __WEBPACK_IMPORTED_MODULE_5__viewer_module_viewer__["b" /* resize */];


/* ************************************************************************** */
/* Rays */

/**
 * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToAssembly = __WEBPACK_IMPORTED_MODULE_4__viewer_module_ray__["a" /* rayToAssembly */];

/**
 * @description [Event Function] Returns the THREE.Group directly related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToGroup = __WEBPACK_IMPORTED_MODULE_4__viewer_module_ray__["b" /* rayToGroup */];

/**
 * @description [Event Function] Returns the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToObject = __WEBPACK_IMPORTED_MODULE_4__viewer_module_ray__["c" /* rayToObject */];

/* ************************************************************************** */
/* Matrix */


/**
 * @description Assemble a matrix4 from the position, rotation and scale components of an object and returns this matrix
 * @param  {THREE.Vector3} pos Position vector of the object
 * @param  {THREE.Euler} rot Euler angle of the object
 * @param  {THREE.Vector3} scale Scale vector of the object
 * @return {THREE.Matrix4}
 */
Viewer.prototype.matrixCompose = __WEBPACK_IMPORTED_MODULE_3__viewer_module_matrix__["a" /* matrixCompose */];

/**
 * @description Disassembles a matrix4 into its position, rotation and scale components and returns them in a JSON object
 * @param {THREE.Matrix4} matrix
 * @return {JSON}
 */
Viewer.prototype.matrixDecompose = __WEBPACK_IMPORTED_MODULE_3__viewer_module_matrix__["b" /* matrixDecompose */];


/* ************************************************************************** */
/* Transform */

/**
 * @description Adds the transformation axis to the object parameter
 * @param {THREE.Group} object object you want the transformation axis to be attached to
 */
Viewer.prototype.addTransform = __WEBPACK_IMPORTED_MODULE_6__viewer_module_transform__["a" /* addTransform */];


/* ************************************************************************** */

/**
 * @description Removes the transformation axis from the scene
 */
Viewer.prototype.removeTransform = __WEBPACK_IMPORTED_MODULE_6__viewer_module_transform__["c" /* removeTransform */];


/* ************************************************************************** */

/**
 * @description Changes the transformation axis mode between 'translate', 'rotate' and 'scale'
 * @param {string} mode A string with the mode wanted for the transformation axis
 */
Viewer.prototype.setTransformMode = __WEBPACK_IMPORTED_MODULE_6__viewer_module_transform__["d" /* setTransformMode */];

/* ************************************************************************** */

/**
 * @description
 */
Viewer.prototype.changeTransformSpace = __WEBPACK_IMPORTED_MODULE_6__viewer_module_transform__["b" /* changeTransformSpace */];

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = object3D;
function object3D (file3D) {
    return loadObjectFromJSON(file3D, 0xd6d6d6);
}

var loadObjectFromJSON = function (jsonObj, colors) {

    var geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    var vertices = new Float32Array( jsonObj.geometry.geometry );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: colors } );
    var mesh = new THREE.Mesh( geometry, material );
    return mesh;


    /* var geometry = new THREE.BufferGeometry();
     geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
     var material = new THREE.MeshBasicMaterial( { color: colors } );
     var mesh = new THREE.Mesh( geometry, material );
     scene.add(mesh);*/
};

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = AxisScene;
function AxisScene(p_axisSize) {
    var axisCanvas = document.getElementById('axisCanvas');

    this.p_scene = new THREE.Scene();

    this.p_renderer = new THREE.WebGLRenderer({canvas: axisCanvas,alpha: true, antialias: true, logarithmicDepthBuffer: true})
    this.p_renderer.setSize(p_axisSize, p_axisSize);

    this.p_camera = new THREE.OrthographicCamera(p_axisSize / -2, p_axisSize / 2, p_axisSize / 2, p_axisSize / -2, 1, 2147483647);
    this.lookAt(this.p_scene);

    this.render = function () {
        this.p_renderer(this.p_camera, this.p_camera);
    };

    this.initScene = function () {
        var axisAnchor = new THREE.Points();
        axisAnchor.position.set(0, 0, 0);

        var p_axis = new THREE.TransformControls(this.p_camera, this.p_renderer.domElement);
        p_axis.children[0].children[0].children.splice(6, 4);
        p_axis.dispose();
        p_axis.attach(axisAnchor);

        this.p_scene.add(axisAnchor);
        this.p_scene.add(p_axis);


        renderArea.appendChild(this.p_renderer.domElement);
        return;
    }
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ViewerScene;
function ViewerScene(p_width, p_height, p_aspectRatio) {
    this.p_scene = new THREE.Scene();

    this.p_renderer = new THREE.WebGLRenderer({canvas: renderSurface, alpha: true, antialias: true, logarithmicDepthBuffer: true});
    this.p_renderer.localClippingEnabled = true;
    this.p_renderer.setClearColor(0xffffff);
    this.p_renderer.setSize(p_width, p_height);

    this.p_camera = new THREE.PerspectiveCamera(60, p_aspectRatio, 1, 2147483647);
    this.p_camera.up.set(0, 0, 1);
    this.p_camera.position.set(0, -75, 50);

    this.p_controls = new THREE.OrbitControls(p_camera, p_renderer.domElement);
    this.p_controls.zoomSpeed = 1 / (Math.log10(p_camera.position.distanceTo(p_controls.target)));

    this.render = function () {
        this.p_renderer(this.p_camera, this.p_camera);
    };

    this.transformUpdate = function (){
        for (var i = 0; i<this.p_scene.children.length; i++){
            if (this.p_scene.children[i] instanceof THREE.TransformControls)
                this.p_scene.children[i].update();
        }
    };
    
    this.initScene = function (object_3d, renderArea) {
        this.p_scene.add(object_3d);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.25),
            directLight1 = new THREE.DirectionalLight(0xffffff, 0.25),
            directLight2 = new THREE.DirectionalLight(0xffffff, 0.25),
            directLight3 = new THREE.DirectionalLight(0xffffff, 0.25),
            directLight4 = new THREE.DirectionalLight(0xffffff, 0.25);

        directLight1.position.set(-1000,     0, 1000);
        directLight2.position.set( 1000,     0, 1000);
        directLight4.position.set(    0,  1000, 1000);
        directLight3.position.set(    0, -1000, 1000);

        this.p_scene.add(ambientLight);
        this.p_scene.add(directLight1);
        this.p_scene.add(directLight2);
        this.p_scene.add(directLight3);
        this.p_scene.add(directLight4);

        renderArea.appendChild(this.p_renderer.domElement);
        return;
    }
}

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fitToScreen;
/* harmony export (immutable) */ __webpack_exports__["b"] = resize;
function fitToScreen () {
    var object  = this.scenes[0].children[5];

    var box     = new THREE.Box3().setFromObject(object),
        center  = box.getCenter();

    if (object instanceof THREE.Group) {
        this.cameras[0].position.set(center.x, -(center.y + Math.abs(box.getSize().y / Math.sin((this.cameras[0].fov * (Math.PI / 180)) / 2))), box.max.z * (10 / Math.log(box.max.z)));
        this.cameras[0].lookAt(center);
        this.controls[0].target = center;
    }
}

function resize () {
    var element = this.domElement;

    this.cameras[0].aspect = (element.clientWidth       ) / (element.clientHeight       );
    this.cameras[1].aspect = (element.clientWidth * 0.15) / (element.clientHeight * 0.15);

    this.cameras[0].updateProjectionMatrix();
    this.cameras[1].updateProjectionMatrix();

    this.renderers[0].setSize((element.offsetWidth        ), (element.offsetHeight       ));
    this.renderers[1].setSize((element.offsetHeight * 0.15), (element.offsetHeight * 0.15));
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = rayToAssembly;
/* harmony export (immutable) */ __webpack_exports__["b"] = rayToGroup;
/* harmony export (immutable) */ __webpack_exports__["c"] = rayToObject;
function rayToAssembly() {

}

function rayToGroup() {

}

function rayToObject() {

}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = matrixCompose;
/* harmony export (immutable) */ __webpack_exports__["b"] = matrixDecompose;
function matrixCompose (pos, rot, scale) {
    return new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromEuler(rot), scale);
}

function matrixDecompose (matrix) {
    var pos = new THREE.Vector3(),
        rot = new THREE.Quaternion(),
        scale = new THREE.Vector3();

    matrix.decompose(pos, rot, scale);

    return {pos: pos, rot: new THREE.Euler().setFromQuaternion(rot), scale: scale};
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = addTransform;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeTransform;
/* harmony export (immutable) */ __webpack_exports__["d"] = setTransformMode;
/* harmony export (immutable) */ __webpack_exports__["b"] = changeTransformSpace;
function addTransform (object) {
    var transform;

    if (!object) {
        this.removeTransform();
        return;
    }

    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.removeTransform();
    }

    transform = new THREE.TransformControls(this.cameras[0], this.renderers[0].domElement);
    transform.attach(object);
    this.scenes[0].add(transform);
}

function removeTransform () {
    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls) {
            this.scenes[0].children[i].detach();
            this.scenes[0].children[i].parent.remove(this.scenes[0].children[i]);
        }
    }
}

function setTransformMode (mode) {
    if (mode !== 'translate' && mode !== 'rotate' && mode !== 'scale')
        return;

    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.scenes[0].children[i].setMode(mode);
    }
}

function changeTransformSpace() {
    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.scenes[0].children[i].setSpace(this.scenes[0].children[i].space === 'local' ? 'world' : 'local');
    }
};


/***/ })
/******/ ]);