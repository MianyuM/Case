import { createCamera } from './componets/camera/camera.js';
import { createScene } from './componets/scene/scene.js';
import { createLights } from './componets/lights/lights.js';
import { loadBirds } from './componets/scene/birds/birds.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

// 这些变量是模块范围的: 它们不能从
// 这个模块之外被访问
let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const controls = createControls(camera, renderer.domElement);

    const { mainLight, hemisphereLight } = createLights();

    loop.updatables.push(controls);

    scene.add(mainLight, hemisphereLight);

    new Resizer(container, camera, renderer);
  }

  async init() {
    const birds = await loadBirds();
    loop.updatables.push(birds);
    scene.add(birds);
  }

  render() {
    // 绘制单帧
    renderer.render(scene, renderer);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // 告诉每个对象执行一帧的动画
      this.tick();

      // 渲染一帧
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // 只有当 delta 更改时才调用 .tick
    const delta = clock.getDelta();

    for (const object of this.updatables) {
      if (object.tick) {
        object.tick(delta);
      }
    }
  }
}

// 导入时钟
import { Clock } from 'three';

const clock = new Clock();

export { World };
