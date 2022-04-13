var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // create animation object to move sphere up higher
    var move_sphere = {obj: sphere, prop: 'position', val: new BABYLON.Vector3(-5, 4, 0), dims: ['x', 'y', 'z']};

    var materialSphere = new BABYLON.StandardMaterial("texture1", scene);
    materialSphere.diffuseColor = new BABYLON.Color3(0, 1, 1);  //Green
    sphere.material = materialSphere;

    // create animation object to dim light
    var dim_light = {obj: light, prop: 'intensity', val: 2, dims: false};

    var startPosition = new BABYLON.Vector3(-5, 4, 0);
    var endPosition = new BABYLON.Vector3(5, 4, 0);
    
    var box1 = BABYLON.Mesh.CreateBox("Box1", 1, scene);
    var materialBox = new BABYLON.StandardMaterial("texture1", scene);
    materialBox.diffuseColor = new BABYLON.Color3(0, 1, 0);  //Green
    //Applying materials
    box1.material = materialBox;

    var move_box1 = {obj: box1, prop: 'position', val: startPosition, val: endPosition, dims: ['x', 'y', 'z']};

 //BABYLON.Animation.CreateAndStartAnimation("anim", box1, "position", 30, 100, startPosition, endPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    


    // create array of animations
    var animations = [];

    // add sphere and light animations to array
    animations.push(move_sphere);
    animations.push(dim_light);
    animations.push(move_box1);

    // execute animations
    document.getElementById('renderCanvas').addEventListener('click', function(){
        animate(animations, scene, 10);
    });
   



    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};
        window.initFunction = async function() {
            
            
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});