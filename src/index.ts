import * as BABYLON from "babylonjs";
import { WebXRControllerComponent } from "babylonjs";
import * as Tone from 'tone'

const synth = new Tone.Synth().toDestination();

async function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine);
    scene.onPointerObservable.add((e)=>{
      if(e.type == BABYLON.PointerEventTypes.POINTERDOWN){
          console.log(e.pickInfo.pickedMesh.id);
          
          synth.triggerAttackRelease("C4", "8n");
      }
  })
  scene.enablePhysics(undefined, new BABYLON.AmmoJSPlugin());
  const sessionManager = new BABYLON.WebXRSessionManager(scene);
  const camera = new BABYLON.FreeCamera(//WebXRCamera
    "camera1",
    new BABYLON.Vector3(0, 5, -10),
    scene,
    //sessionManager
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;
  const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  sphere.position.y = 2;
  sphere.position.z = 5;
  sphere.onCollideObservable.add(() => console.log);

  const env = scene.createDefaultEnvironment();
  const xr = await scene.createDefaultXRExperienceAsync({
    //floorMeshes: [env.ground],
    uiOptions: {
      sessionMode: "immersive-vr",
    },
    optionalFeatures: true
  });
  console.log(xr)

// WebXR:
const input = xr.input; // if using the experience helper, otherwise, an instance of WebXRInput
input.onControllerAddedObservable.add((xrController /* WebXRInputSource instance */ ) => {
  console.log("controller", xrController)
    // more fun with the new controller, since we are in XR!
    xrController.onMotionControllerInitObservable.add((motionController) => {
      console.log( motionController.getComponentIds())
      const mainComponent = xrController.motionController.getMainComponent();
      // or get the trigger component, if present:
      const mainTrigger = xrController.motionController.getComponent(WebXRControllerComponent.TRIGGER_TYPE);
      mainComponent.onButtonStateChangedObservable.add((component /* WebXRControllerComponent */ ) => {
        console.log("button", component)
          // check for changes:
          // pressed changed?
          if (component.changes.pressed) {
              // is it pressed?
              if (component.changes.pressed.current === true) {
                  // pressed
              }
              // or a different way:
              if (component.pressed) {
                  // component is pressed.
              }
          }
      });
          // in webXR you can check if it is present and work accordingly:
    const thumbstick = xrController.motionController.getComponent(WebXRControllerComponent.THUMBSTICK_TYPE);
    if (thumbstick) {
        // Huzza! we have a thumbstick:
        thumbstick.onButtonStateChangedObservable // will trigger when the thumbstick is PRESSED or touched!

        thumbstick.onAxisValueChangedObservable // will trigger when axes of the thumbstick changed
    }
    });
    // xr supports all types of inputs, so some won't have a motion controller
    if (!xrController.motionController) {
        // using touch, hands, gaze, something else?
    }

});

  return scene;
};

async function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas, true);
  const scene = await createScene(engine, canvas);
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}

(async () => {
  try {
      await main();
  } catch (err) {
      console.error(err);
  }
})();