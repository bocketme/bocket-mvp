import Viewer from './Viewer'

var renderArea = document.getElementById('renderDiv');
var viewer = new Viewer(renderArea);
console.log(viewer);

/*********************************************/
/*                                           */
/*                Render Loop                */
/*                                           */
/*********************************************/
viewer.p_engine.runRenderLoop(function () {
    viewer.p_scene.render();
});

window.addEventListener('resize', function() {
    engine.resize();
});