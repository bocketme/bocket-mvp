/**
 * @description
 * @author bocket.me
 * @param {HTMLElement} renderingDiv
 */

import AxisScene from './init/scene_axis';
import ViewerScene from './init/scene_3d';
import object3D from './init/object3D';
import * as THREE from 'three';

export class Viewer{
    constructor(renderArea){
        renderArea ? null : console.error(new Error("Render Area : Not Found"));

        /******************************************************************/
        /* renderArea Information */

        var p_width         = renderArea.offsetWidth,
            p_height        = renderArea.offsetHeight,
            p_axisSize      = p_height * 0.15,
            p_aspectRatio   = renderArea.clientWidth / renderArea.clientHeight;

        /******************************************************************/
        /* Initialization of scenes */
        this.objects    = new ViewerScene   (p_width, p_height, p_aspectRatio);
        this.axis       = new AxisScene     (p_axisSize);

        /*******************************************************************/
        /* Bind the camera of the scene_object with the camera of the scene_axis */

        this.axis.p_camera.up.copy(scene_object.p_camera.up);
        this.axis.p_camera.position.copy(scene_object.p_camera.position);
        this.axis.p_camera.position.setLength(200);
        this.axis.p_camera.lookAt(scene_axis.p_camera);

        /* initialisation de la scene_object */
        /******************************************************************/
        this.objects.initScene(renderArea);
        this.axis.initScene(renderArea);
        this.domElement = renderArea;
        animate();
    }

    static animate() {
        requestAnimationFrame(animate);

        /* render the scenes */
        this.objects.render();
        this.axis.render();

        /* update the scenes */
        this.objects.update(scene_object.p_camera.position);
        this.axis.p_controls.update();

        this.objects.transformUpdate();
        this.axis.p_controls.update();
    }

    /* ************************************************************************** */
    /*                                                                            */
    /*                          SCREEN MODIFIVATIONS                              */
    /*                                                                            */
    /* ************************************************************************** */

    /**
     * @description [Event Function] Returns the THREE.Group directly related to the object clicked on screen
     * @param {number} mouseX offsetX value of the mouse event
     * @param {number} mouseY offsetY value of the mouse event
     */
    fitToScreen () {
        var object = this.objects.p_scene.children[5];

        var box     = new THREE.Box3().setFromObject(object),
            center  = box.getCenter();

        if (object instanceof THREE.Group) {
            this.objects.p_camera.position.set(center.x, -(center.y + Math.abs(box.getSize().y / Math.sin((this.cameras[0].fov * (Math.PI / 180)) / 2))), box.max.z * (10 / Math.log(box.max.z)));
            this.objects.p_camera.lookAt(center);
            this.objects.p_controls.target = center;
        }
    }


    /**
     * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
     * @param {number} mouseX offsetX value of the mouse event
     * @param {number} mouseY offsetY value of the mouse event
     */
    resize () {
        var element = this.domElement;

        this.objects.p_camera.aspect    = (element.clientWidth       ) / (element.clientHeight       );
        this.axis.p_camera.aspect       = (element.clientWidth * 0.15) / (element.clientHeight * 0.15);

        this.objects.p_camera.updateProjectionMatrix();
        this.axis.p_camera.updateProjectionMatrix();

        this.objects.p_renderer.setSize((element.offsetWidth        ), (element.offsetHeight       ));
        this.axis.p_renderer.setSize((element.offsetHeight * 0.15), (element.offsetHeight * 0.15));
    }


    /* ************************************************************************** */
    /*                                                                            */
    /*                                  RAYS                                      */
    /*                                                                            */
    /* ************************************************************************** */

    /**
     * @description [Event Function] Returns the object clicked on screen
     * @param {number} mouseX offsetX value of the mouse event
     * @param {number} mouseY offsetY value of the mouse event
     */
    rayToObject(mouseX, mouseY) {
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
    }

    /**
     * @description [Event Function] Returns the THREE.Group directly related to the object clicked on screen
     * @param {number} mouseX offsetX value of the mouse event
     * @param {number} mouseY offsetY value of the mouse event
     */
    rayToGroup(mouseX, mouseY) {
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
    }

    /**
     * @description [Event Function] Returns the highest THREE.Group related to the object clicked on screen
     * @param {number} mouseX offsetX value of the mouse event
     * @param {number} mouseY offsetY value of the mouse event
     */
    rayToAssembly(mouseX, mouseY) {
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
    }



    /* ************************************************************************** */
    /*                                                                            */
    /*                                  MATRIX                                    */
    /*                                                                            */
    /* ************************************************************************** */

    /**
     * @description Assemble a matrix4 from the position, rotation and scale components of an object and returns this matrix
     * @param  {THREE.Vector3} pos Position vector of the object
     * @param  {THREE.Euler} rot Euler angle of the object
     * @param  {THREE.Vector3} scale Scale vector of the object
     * @return {THREE.Matrix4}
     */
    matrixCompose(pos, rot, scale) {
        return new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromEuler(rot), scale);
    };


    /**
     * @description Disassembles a matrix4 into its position, rotation and scale components and returns them in a JSON object
     * @param {THREE.Matrix4} matrix
     * @return {JSON}
     */
    matrixDecompose(matrix) {
        var pos = new THREE.Vector3(),
            rot = new THREE.Quaternion(),
            scale = new THREE.Vector3();

        matrix.decompose(pos, rot, scale);

        return {pos: pos, rot: new THREE.Euler().setFromQuaternion(rot), scale: scale};
    };


    /* ************************************************************************** */
    /*                                                                            */
    /*                                  TRANSFORM                                 */
    /*                                                                            */
    /* ************************************************************************** */

    /**
     * @description Adds the transformation axis to the object parameter
     * @param {THREE.Group} object object you want the transformation axis to be attached to
     */
    addTransform(object) {
        var transform;

        if (!object) {
            this.removeTransform();
            return;
        }

        for (var i = 0; i < this.objects.p_scene.children.length; i++) {
            if (this.objects.p_scene.children[i] instanceof THREE.TransformControls)
                this.removeTransform();
        }

        transform = new THREE.TransformControls(this.objects.p_camera, this.objects.p_renderer.domElement);
        transform.attach(object);
        this.objects.p_scene.add(transform);
    }

    /* ************************************************************************** */
    /*                                                                            */
    /*                                  TRANSFORM                                 */
    /*                                                                            */
    /* ************************************************************************** */

    /**
     * @description Removes the transformation axis from the scene
     */
    removeTransform() {
        for (var i = 0; i < this.scenes[0].children.length; i++) {
            if (this.objects.p_scene.children[i] instanceof THREE.TransformControls) {
                this.objects.p_scene.children[i].detach();
                this.objects.p_scene.children[i].parent.remove(this.scenes[0].children[i]);
            }
        }
    }

    setTransformMode(mode) {
        if (mode !== 'translate' && mode !== 'rotate' && mode !== 'scale')
            return;

        for (var i = 0; i < this.scenes[0].children.length; i++) {
            if (this.objects.p_scene.children[i] instanceof THREE.TransformControls)
                this.objects.p_scene.children[i].setMode(mode);
        }
    }

    changeTransformSpace() {
        for (var i = 0; i < this.scenes[0].children.length; i++) {
            if (this.objects.p_scene.children[i] instanceof THREE.TransformControls)
                this.objects.p_scene.children[i].setSpace(this.objects.p_scene.children[i].space === 'local' ? 'world' : 'local');
        }
    };


    /* ************************************************************************** */
    /*                                                                            */
    /*                                  OBJECT3D                                  */
    /*                                                                            */
    /* ************************************************************************** */

    //?????????

    addAssembly(){

    }

    addPart(){

    }

    removeAssembly(){

    }
    removePart(){

    }


}
