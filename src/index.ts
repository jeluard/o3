import * as BABYLON from "babylonjs";

async function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -10),
    scene
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

  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
    },
  });
  console.log(xr)

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