/**
 * @description
 * @author bocket.me
 * @param {HTMLElement} renderingDiv
 */
var Viewer = function (renderingDiv, file3D) {
    if (!(this instanceof Viewer))
        return console.error(new Error('Bad instanciation'));

/* ************************************************************************** */

    renderArea = renderingDiv ? renderingDiv : document.body;

/* ************************************************************************** */

    var p_width = renderArea.offsetWidth,
        p_height = renderArea.offsetHeight,
        p_axisSize = p_height * 0.15,
        p_aspectRatio = renderArea.clientWidth / renderArea.clientHeight;

/* ************************************************************************** */

    var p_scene = new THREE.Scene();

    var p_renderer = new THREE.WebGLRenderer({canvas: renderSurface, alpha: true, antialias: true, logarithmicDepthBuffer: true});
        p_renderer.localClippingEnabled = true;
        p_renderer.setClearColor(0xffffff);
        p_renderer.setSize(p_width, p_height);

    var p_camera = new THREE.PerspectiveCamera(60, p_aspectRatio, 1, 2147483647);
        p_camera.up.set(0, 0, 1);
        p_camera.position.set(0, -75, 50);

    var p_controls = new THREE.OrbitControls(p_camera, p_renderer.domElement);
        p_controls.zoomSpeed = 1 / (Math.log10(p_camera.position.distanceTo(p_controls.target)));

/* ************************************************************************** */

    var p_scene2 = new THREE.Scene();

    var p_renderer2 = new THREE.WebGLRenderer({canvas: axisCanvas,alpha: true, antialias: true, logarithmicDepthBuffer: true});
        p_renderer2.setSize(p_axisSize, p_axisSize);

    var p_camera2 = new THREE.OrthographicCamera(p_axisSize / -2, p_axisSize / 2, p_axisSize / 2, p_axisSize / -2, 1, 2147483647);
        p_camera2.up.copy(p_camera.up);
        p_camera2.position.copy(p_camera.position);
        p_camera2.position.setLength(200);
        p_camera2.lookAt(p_scene2.position);

    var p_controls2 = new THREE.OrbitControls(p_camera2, p_renderer2.domElement);
        p_controls2.rotateSpeed = 0.15;

/* ************************************************************************** */

    initScenes()
    .catch(function (error) {
        $('#renderDiv').html("<h4>No Preview Aviable<h4>")
    });

    this.annotation = new Annotation(renderArea, p_camera);


/* ************************************************************************** */

    /**
     * @description
     */
    function objectInit (object, data) {
        object.traverse(function (child) {
            if (child.hasOwnProperty('geometry'))
            child.geometry.computeBoundingBox();
        });

        // object.position.set(data.position.x, data.position.y, data.position.z);
        // object.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        // object.scale.set(data.scale.x, data.Scale.y, data.scale.z);

        // var matrix = new THREE.Matrix4().compose(data.position, new THREE.Quaternion().setFromEuler(data.rotation), data.scale);
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

    function getObject () {
        return new Promise(function (resolve, reject) {

                    object = loadObjectFromJSON(file3D, 0xd6d6d6);
                    //objectInit(object, data);
                    // this.fitToScreen();

                    resolve(object);
        });
    }

/* ************************************************************************** */

    function initMainScene () {
        return new Promise(function (resolve, reject) {
            getObject()
            .then(function (object) {
                p_scene.add(object);
            })
            .catch(function (error) {
                reject(error);
            });

            var ambientLight = new THREE.AmbientLight(0xffffff, 0.25),
                directLight1 = new THREE.DirectionalLight(0xffffff, 0.25),
                directLight2 = new THREE.DirectionalLight(0xffffff, 0.25),
                directLight3 = new THREE.DirectionalLight(0xffffff, 0.25),
                directLight4 = new THREE.DirectionalLight(0xffffff, 0.25);

                directLight1.position.set(-1000,     0, 1000);
                directLight2.position.set( 1000,     0, 1000);
                directLight4.position.set(    0,  1000, 1000);
                directLight3.position.set(    0, -1000, 1000);

                p_scene.add(ambientLight);
                p_scene.add(directLight1);
                p_scene.add(directLight2);
                p_scene.add(directLight3);
                p_scene.add(directLight4);

                resolve();
        });
    }

/* ************************************************************************** */

    function initAxisScene () {
        return new Promise(function (resolve, reject) {
            var axisAnchor = new THREE.Points();
                axisAnchor.position.set(0, 0, 0);

            var p_axis = new THREE.TransformControls(p_camera2, p_renderer2.domElement);
                p_axis.children[0].children[0].children.splice(6, 4);
                p_axis.dispose();
                p_axis.attach(axisAnchor);

                p_scene2.add(axisAnchor);
                p_scene2.add(p_axis);

                resolve();
        });
    }

/* ************************************************************************** */

    function initScenes () {
        return new Promise(function (resolve, reject) {
            initMainScene()
            .then(function () {
                renderArea.appendChild(p_renderer.domElement);
            })
            .catch(function (error) {
                console.log(error);
            });

            initAxisScene()
            .then(function () {
                renderArea.appendChild(p_renderer2.domElement);
            })
            .catch(function (error) {
                console.log(error);
            });

            resolve();
        });
    }

/* ************************************************************************** */

    /**
     * @description
     */
    function selectObject (mousePosition) {
        var raycaster  = new THREE.Raycaster(),
            intersects = [];

            raycaster.setFromCamera(mousePosition, p_camera);
            intersects = raycaster.intersectObjects([scene], true);

            if (intersects.length > 0) {
                return (intersects[0].length);
            }
            else
                return (null);
    }

/* ************************************************************************** */

    /**
     * @description
     */
    function axisUpdate () {
        p_camera2.position.copy(p_camera.position);
        p_camera2.position.setLength(200);
        p_camera2.lookAt(p_scene2.position);
    }

    function transformUpdate () {
        for (var i = 0; i < p_scene.children.length; i++) {
            if (p_scene.children[i] instanceof THREE.TransformControls)
                p_scene.children[i].update();
        }
    }

/* ************************************************************************** */

    /**
     * @description
     */
    function render () {
        p_renderer.render(p_scene, p_camera);
        p_renderer2.render(p_scene2, p_camera2);
    }

/* ************************************************************************** */

    /**
     * @description
     */
    function update () {
        axisUpdate();
        transformUpdate();
        p_controls.update();
        p_controls2.update();
    }

/* ************************************************************************** */

    /**
     * @description
     */
    function animate () {
        requestAnimationFrame(animate);

        render();
        update();
    }

/* ************************************************************************** */

    this.domElement = renderArea;
    this.scenes     = [p_scene   ,  p_scene2   ];
    this.cameras    = [p_camera  ,  p_camera2  ];
    this.renderers  = [p_renderer,  p_renderer2];
    this.controls   = [p_controls,  p_controls2];

/* ************************************************************************** */

    animate();
};

/* ************************************************************************** */

Viewer.prototype.constructor = Viewer;

/* ************************************************************************** */

/**
 * @description [Function] Makes the entire assembly fit into the screen
 */
Viewer.prototype.fitToScreen = function () {
    var object  = this.scenes[0].children[5];

    var box     = new THREE.Box3().setFromObject(object),
        center  = box.getCenter();

    if (object instanceof THREE.Group) {
        this.cameras[0].position.set(center.x, -(center.y + Math.abs(box.getSize().y / Math.sin((this.cameras[0].fov * (Math.PI / 180)) / 2))), box.max.z * (10 / Math.log(box.max.z)));
        this.cameras[0].lookAt(center);
        this.controls[0].target = center;
    }
};

/* ************************************************************************** */

/**
 * @description [Event Function] Resize renderers and updates scenes cameras
 */
Viewer.prototype.resize = function () {
    var element = this.domElement;

    this.cameras[0].aspect = (element.clientWidth       ) / (element.clientHeight       );
    this.cameras[1].aspect = (element.clientWidth * 0.15) / (element.clientHeight * 0.15);

    this.cameras[0].updateProjectionMatrix();
    this.cameras[1].updateProjectionMatrix();

    this.renderers[0].setSize((element.offsetWidth        ), (element.offsetHeight       ));
    this.renderers[1].setSize((element.offsetHeight * 0.15), (element.offsetHeight * 0.15));
};

/* ************************************************************************** */

/**
 * @description [Event Function] Returns the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToObject = function (mouseX, mouseY) {
    var mouse3D    = new THREE.Vector3((mouseX / this.domElement.clientWidth) * 2 - 1, -(mouseY / this.domElement.clientHeight) * 2 + 1, 0.5),
        raycaster  = new THREE.Raycaster(),
        intersects = [];

    raycaster.setFromCamera(mouse3D, this.cameras[0]);
    intersects = raycaster.intersectObject(this.scenes[0].children[5], true);

    if (intersects.length > 0) {
        delete intersects[0].face;
        delete intersects[0].faceIndex;
        delete intersects[0].index;

        return intersects[0];
    }
    else
        return (null);
};

/* ************************************************************************** */

/**
 * @description [Event Function] Returns the THREE.Group directly related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToGroup = function (mouseX, mouseY) {
    var mouse3D    = new THREE.Vector3((mouseX / this.domElement.clientWidth) * 2 - 1, -(mouseY / this.domElement.clientHeight) * 2 + 1, 0.5),
        raycaster  = new THREE.Raycaster(),
        intersects = [];

    raycaster.setFromCamera(mouse3D, this.cameras[0]);
    intersects = raycaster.intersectObject(this.scenes[0].children[5], true);

    if (intersects.length > 0) {
        delete intersects[0].face;
        delete intersects[0].faceIndex;
        delete intersects[0].index;
        intersects[0].object = intersects[0].object.parent;

        return intersects[0];
    }
    else
        return (null);
};

/* ************************************************************************** */

/**
 * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
 * @param {number} mouseX offsetX value of the mouse event
 * @param {number} mouseY offsetY value of the mouse event
 */
Viewer.prototype.rayToAssembly = function (mouseX, mouseY) {
    var canvas     = this.domElement;

    var mouse3D    = new THREE.Vector3((mouseX / canvas.clientWidth) * 2 - 1, -(mouseY / canvas.clientHeight) * 2 + 1, 0.5),
        raycaster  = new THREE.Raycaster(),
        intersects = [];

    var processIntersects = function (object) {
        if (object.parent instanceof THREE.Group)
            return processIntersects(object.parent);
        else
            return object;
    };

    raycaster.setFromCamera(mouse3D, this.cameras[0]);
    intersects = raycaster.intersectObject(this.scenes[0].children[5], true);

    if (intersects.length > 0) {
        delete intersects[0].face;
        delete intersects[0].faceIndex;
        delete intersects[0].index;
        intersects[0].object = processIntersects(intersects[0].object);

        return intersects[0];
    }
    else
        return (null);
};

/* ************************************************************************** */

/**
 * @description Assemble a matrix4 from the position, rotation and scale components of an object and returns this matrix
 * @param  {THREE.Vector3} pos Position vector of the object
 * @param  {THREE.Euler} rot Euler angle of the object
 * @param  {THREE.Vector3} scale Scale vector of the object
 * @return {THREE.Matrix4}
 */
Viewer.prototype.matrixCompose = function (pos, rot, scale) {
    return new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromEuler(rot), scale);
};

/* ************************************************************************** */

/**
 * @description Disassembles a matrix4 into its position, rotation and scale components and returns them in a JSON object
 * @param {THREE.Matrix4} matrix
 * @return {JSON}
 */
Viewer.prototype.matrixDecompose = function (matrix) {
    var pos = new THREE.Vector3(),
        rot = new THREE.Quaternion(),
        scale = new THREE.Vector3();

    matrix.decompose(pos, rot, scale);

    return {pos: pos, rot: new THREE.Euler().setFromQuaternion(rot), scale: scale};
};

/* ************************************************************************** */

/**
 * @description Adds the transformation axis to the object parameter
 * @param {THREE.Group} object object you want the transformation axis to be attached to
 */
Viewer.prototype.addTransform = function (object) {
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
};

/* ************************************************************************** */

/**
 * @description Removes the transformation axis from the scene
 */
Viewer.prototype.removeTransform = function () {
    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls) {
            this.scenes[0].children[i].detach();
            this.scenes[0].children[i].parent.remove(this.scenes[0].children[i]);
        }
    }
};

/* ************************************************************************** */

/**
 * @description Changes the transformation axis mode between 'translate', 'rotate' and 'scale'
 * @param {string} mode A string with the mode wanted for the transformation axis
 */
Viewer.prototype.setTransformMode = function (mode) {
    if (mode !== 'translate' && mode !== 'rotate' && mode !== 'scale')
        return;

    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.scenes[0].children[i].setMode(mode);
    }
};

/* ************************************************************************** */

/**
 * @description
 */
Viewer.prototype.changeTransformSpace = function () {
    for (var i = 0; i < this.scenes[0].children.length; i++) {
        if (this.scenes[0].children[i] instanceof THREE.TransformControls)
            this.scenes[0].children[i].setSpace(this.scenes[0].children[i].space === 'local' ? 'world' : 'local');
    }
};

/* ************************************************************************** */