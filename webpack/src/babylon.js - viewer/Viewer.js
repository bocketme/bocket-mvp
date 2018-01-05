import * as BABYLON from 'babylonjs';

export default class Viewer {
    constructor(renderArea) {
        this.p_engine = new BABYLON.Engine(renderArea, true);

        this.p_scene = new BABYLON.Scene(this.p_engine);

        this.p_camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.p_scene);
        this.p_camera.setTarget(BABYLON.Vector3.Zero());
        this.p_camera.attachControl(renderArea, false);

        var hemisphericLight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.p_scene);

        this.s_ground = BABYLON.Mesh.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, this.p_scene);
    }
}