/* Setup the ajax loading manager */

// $.ajaxSetup({
//     timeout: 5000,
//     xhr: function () {
//         var xhr = new window.XMLHttpRequest();
//         xhr.upload.addEventListener("progress", function (event) {
//             if (event.lengthComputable) {
//                 var percentComplete = Math.round((event.loaded / event.total) * 100);
//                 console.log(percentComplete + "%");
//             }
//         }, false);
//         xhr.addEventListener("progress", function (event) {
//             if (event.lengthComputable) {
//                 var percentComplete = Math.round((event.loaded / event.total) * 100);
//                 console.log(percentComplete + "%");
//             }
//         }, false);
//         return (xhr);
//     }
// });

/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                OBJECT FUNCTIONS                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */


/**
 * @desc Asynchronously retrieves an object from the server and its associated material (if any)
 * @param {string} query String holding the required query to retrieve the object associated to the current node
 */
var getObjectFromServer = function (query, l) {
    return (new Promise(function(resolve, reject) {
        var objLoader = new THREE.OBJLoader(),
            mtlLoader = new THREE.MTLLoader(),
            tmpMtl, tmpObj;

        /* Get material */
        $.get("/get_mtl/nodeTest/parent-1/" + query + ".mtl")

        .done(function(mtl) {
            tmpMtl = mtl;
            tmpMtl = mtlLoader.parse(tmpMtl);
            tmpMtl.preload();
        })

        .fail(function(err) {
            tmpMtl = null;
        })

        .always(function() {
            /* Get object */
            $.get("/get_obj/nodeTest/parent-1/" + query + ".obj")

            .done(function(obj) {
                if (tmpMtl !== null)
                    objLoader.setMaterials(tmpMtl);
                tmpObj = objLoader.parse(obj.data);
                tmpObj.name = query;
                objInit(tmpObj);
                //fit here
                fitToScreen(tmpObj, camera);
                scenes[l].add(tmpObj);
                resolve(obj.id);
            })

            .fail(function() {
                reject(new Error("Error: no obj found"));
            });
        });
    }));
};


/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                UTILITY FUNCTIONS                           */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */

var objInit = function (group) {
    group.children.forEach(function(children) {
        children.geometry.computeBoundingSphere();
        children.material.fog = false;
        children.userData.initPos = new THREE.Vector3(children.position.x, children.position.y, children.position.z);
    });
    group.userData.initPos = new THREE.Vector3(group.position.x, group.position.y, group.position.z);
};

var getCenterPoint  = function (object) {
    var middle      = new THREE.Vector3();

    middle.x        = object.geometry.boundingSphere.center.x;
    middle.y        = object.geometry.boundingSphere.center.y;
    middle.z        = object.geometry.boundingSphere.center.z;

    object.localToWorld(middle);

    return (middle);
};

/**
 * @param object get a group of object
 * @returns {c|n|*|Vector3}
 */
var getaverageCenterPoint = function (object) {
    var index = 0;
    var middle = new THREE.Vector3(0, 0, 0);
    object.children.forEach(function(child) {
        middle.x += child.geometry.boundingSphere.center.x;
        middle.y += child.geometry.boundingSphere.center.y;
        middle.z += child.geometry.boundingSphere.center.z;
        index += 1;
    }, index, middle);
    if (index === 0)
        return middle;
    middle.x = middle.x / index;
    middle.y = middle.y / index;
    middle.z = middle.z / index;
    return middle;
};

var changeCheckerFloorDensity = function (index) {
    if (camera.position.distanceTo(controls.target) > 15)
        scenes[index].getObjectByName("checkerFloor").material.uniforms.scale.value = 16384;
    if (camera.position.distanceTo(controls.target) > 50)
        scenes[index].getObjectByName("checkerFloor").material.uniforms.scale.value = 4096;
    if (camera.position.distanceTo(controls.target) > 1000)
        scenes[index].getObjectByName("checkerFloor").material.uniforms.scale.value = 1024;
    if (camera.position.distanceTo(controls.target) > 5000)
        scenes[index].getObjectByName("checkerFloor").material.uniforms.scale.value = 256;
    if (camera.position.distanceTo(controls.target) > 25000)
        scenes[index].getObjectByName("checkerFloor").material.uniforms.scale.value = 64;
};

var enableControls = function (activate) {
    if (activate === true) {}
};

/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                           OBJECT EVENT FUNCTION                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */


/**
 *  @param Object to be fit to the screen
 *  @param camera The camera of the scene where the object is suppose to be
 */
var fitToScreen = function (object, camera) {
    var objectCenter = getaverageCenterPoint(object),
        box = new THREE.Box3().setFromObject(object),
        fov = camera.fov * (Math.PI / 180),
        objectSize = Math.max(box.min.y, box.max.y, box.getSize().y);

    camera.position.set(0, -(objectCenter.y + Math.abs(objectSize / Math.sin(fov / 2))), 100);
    camera.lookAt(objectCenter);
};

/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                               EVENT FUNCTIONS                              */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */


var onWindowResize = function () {
    camera.aspect = (renderArea.clientWidth / 2) / renderArea.clientHeight;
    camera.updateProjectionMatrix();

    renderers[0].setSize((renderArea.clientWidth / 2), renderArea.clientHeight);
    renderers[1].setSize((renderArea.clientWidth / 2), renderArea.clientHeight);

    composer[0].setSize((renderArea.clientWidth / 2), renderArea.clientHeight);
    composer[1].setSize((renderArea.clientWidth / 2), renderArea.clientHeight);

    effectFXAA[0].uniforms.resolution.value.set(1 / (renderArea.clientWidth / 2), 1 / renderArea.clientHeight);
    effectFXAA[1].uniforms.resolution.value.set(1 / (renderArea.clientWidth / 2), 1 / renderArea.clientHeight);
};


/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                 MAIN FUNCTIONS                             */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */

/* ************************************************************************** */

var renderArea = /* $("#splitView")[0] */ document.getElementById("splitView"),
    renderSurfaces = [document.getElementById("surface1"), document.getElementById("surface2")];

/* **************************** scenes[] VARIABLES ***************************** */

var camera,
    controls,
    renderers = [],
    scenes = [];

/* ************************ EFFECT COMPOSER VARIABLES *********************** */

var composer = [],
    effectFXAA = [],
    outlinePass = [];

/* *********************** END OF VARIABLE DECLARATION ********************** */


/**
 * Initialise the scenes[] and its components
 *
 */
var init = function () {
    var width = renderArea.offsetWidth / 2,
        height = renderArea.offsetHeight,
        aspectRatio = (renderArea.clientWidth / 2) / renderArea.clientHeight;

    /* ******************************** SCENE ******************************* */

    for (var i = 0; i < 2; i++) {
        scenes[i] = new THREE.Scene();
        scenes[i].fog = new THREE.FogExp2(0xffffff, 0.00001);

        renderers[i] = new THREE.WebGLRenderer({
            canvas: renderSurfaces[i],
            logarithmicDepthBuffer: true,
            alpha: true
        });
        renderers[i].setClearColor(0xffffff);
        renderers[i].setSize(width, height);
    }

    camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 2147483647);
    camera.up.set(0, 0, 1);
    camera.position.set(0, -150, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    controls = new THREE.OrbitControls(camera, renderArea);
    controls.zoomSpeed = 1 / (Math.log10(camera.position.distanceTo(controls.target)));

    /* ****************************** LIGHTING ****************************** */

    for (var j = 0; j < 2; j++) {
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.25),
            directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.25),
            directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.25),
            directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.25),
            directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.25);

        directionalLight1.position.set(-1000, 0, 1000);
        directionalLight2.position.set(1000, 0, 1000);
        directionalLight3.position.set(0, -1000, 1000);
        directionalLight4.position.set(0, 1000, 1000);


        scenes[j].add(ambientLight);
        scenes[j].add(directionalLight1);
        scenes[j].add(directionalLight2);
        scenes[j].add(directionalLight3);
        scenes[j].add(directionalLight4);
    }


    /* **************************** POST-PROCESS **************************** */

    for (var k = 0; k < 2; k++) {
        var renderPass = new THREE.RenderPass(scenes[k], camera);

        composer[k] = new THREE.EffectComposer(renderers[k]);
        composer[k].setSize(width, height);

        outlinePass[k] = new THREE.OutlinePass(new THREE.Vector2(renderArea.offsetWidth, renderArea.offsetHeight), scenes[k], camera);

        effectFXAA[k] = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA[k].uniforms.resolution.value.set(1 / width, 1 / height);
        effectFXAA[k].renderToScreen = true;

        composer[k].addPass(renderPass);
        composer[k].addPass(outlinePass[k]);
        composer[k].addPass(effectFXAA[k]);
    }

    /* *************************** ADDING OBJECTS *************************** */

    for (var l = 0; l < 2; l++) {
        // var floorShader = {
        //     uniforms: {
        //         color1: {
        //             type: "c",
        //             value: new THREE.Color(0xffffff)
        //         },
        //         color2: {
        //             type: "c",
        //             value: new THREE.Color(0x000000)
        //         },
        //         scale: {
        //             type: "f",
        //             value: 2048
        //         },
        //         opacity: {
        //             type: "f",
        //             value: 0.1
        //         },
        //         fogColor: {
        //             type: "c",
        //             value: scenes[l].fog.color
        //         },
        //         fogDensity: {
        //             type: "f",
        //             value: scenes[l].fog.density
        //         }
        //     },
        //     fragmentShader: `
        //     varying vec2    vUv;
        //     uniform vec3    color1;
        //     uniform vec3    color2;
        //     uniform float   scale;
        //     uniform float   opacity;

        //     #define LOG2 1.442695
        //     #define whiteCompliment(a) (1.0 - saturate(a))
        //     ${THREE.ShaderChunk.fog_pars_fragment}

        //     void main()
        //     {
        //         vec2 center = -1.0 + 2.0 * vUv;
        //         vec2 uv = floor(center.xy * scale);

        //         if (mod(uv.x + uv.y, 2.0) > 0.5)
        //             gl_FragColor = vec4(color1, opacity);
        //         else
        //             gl_FragColor = vec4(color2, opacity);

        //         ${THREE.ShaderChunk.fog_fragment}

        //         gl_FragColor = vec4(gl_FragColor.xyz, opacity);
        //     }
        //     `,
        //     vertexShader: `
        //     varying vec2 vUv;
        //     varying float fogDepth;

        //     void main()
        //     {
        //         vUv = uv;
        //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        //         fogDepth = -gl_Position.z;
        //     }
        //     `
        // };

        // var floorMaterial = new THREE.ShaderMaterial({
        //     vertexShader: floorShader.vertexShader,
        //     fragmentShader: floorShader.fragmentShader,
        //     uniforms: floorShader.uniforms,
        //     side: THREE.DoubleSide,
        //     fog: true,
        //     transparent: true
        // });
        // var floorGeometry = new THREE.PlaneGeometry(262144, 262144, 1, 1);
        // var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        // floorMesh.name = "checkerFloor";

        // scenes[l].add(floorMesh);
    }
    getObjectFromServer("shuttle", 0)
        .then(function() {
            getObjectFromServer("AssembledObjects", 1)
                .then(function() {
                    var objet1 = scenes[0].children[5].children[0].geometry.attributes.position.array;
                    var objet2 = scenes[1].children[5].children[0].geometry.attributes.position.array;
                    var t0, t1, result1, result2;

                    /* Algo JA */
                    // t0 = performance.now();
                    // objectDiff(scenes[0].children[5].children[0].geometry.attributes.position.array,
                    //     scenes[1].children[5].children[0].geometry.attributes.position.array,
                    //     0xffff66);
                    // t1 = performance.now();
                    // result1 = t1 - t0;
                    // console.log("JA: " + (result1) + "ms");

                    /* Algo Alexis */
                    // t0 = performance.now();
                    // diffTest(objet1, objet2);
                    // t1 = performance.now();
                    // result2 = t1 - t0;
                    // console.log("Alexis: " + (result2) + "ms");

                    // console.log(diffTest(objet1, objet2));
                });
            });
};

var animate = function () {
    requestAnimationFrame(animate);

    // keyboard.update();
    // stats.update();
    for (var i = 0; i < 2; i++) {
        // changeCheckerFloorDensity(i);
        controls.update();
        composer[i].render();
    }
};

/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                  MAIN SCRIPT                               */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */

/* ************************************************************************** */
/*                                                                            */
/*                                    MAIN                                    */
/*                                                                            */
/* ************************************************************************** */


init();
animate();


/* ************************************************************************** */
/*                                                                            */
/*                                   EVENT                                    */
/*                                                                            */
/* ************************************************************************** */

window.addEventListener("resize", onWindowResize, false);