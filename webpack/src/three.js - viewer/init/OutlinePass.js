import { Pass } from "postprocessing";

export default class OutlinePass extends Pass{
    constructor(){
        super();

        this.name = "OutlinePass";
        this.needsSwap = true;
        this.material = new MyMaterial();
        this.quad.material = this.material;
    }
    render(renderer, readBuffer, writeBuffer){
        this.material.uniforms.tDiffuse.value = readBuffer.texture;
        renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
    }
}
