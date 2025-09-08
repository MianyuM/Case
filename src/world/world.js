import { createCamera } from './componets/camera/camera.js';
import { createScene } from './componets/scene/scene.js';
import { createLights } from './componets/lights/lights.js';
import { loadBirds } from './componets/scene/birds/birds.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { createGUI } from './systems/gui.js';
import { createClickHandler } from './systems/clickHandler.js';

// 这些变量是模块范围的: 它们不能从
// 这个模块之外被访问
let camera;
let renderer;
let scene;
let loop;
let gui;
let clickHandler;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const controls = createControls(camera, renderer.domElement);
    const { mainLight, hemisphereLight } = createLights();

    // 创建GUI控制面板
    gui = createGUI();

    // 创建点击处理器
    clickHandler = createClickHandler(camera, scene, renderer);

    // 保存引用以便GUI访问
    this.camera = camera;
    this.scene = scene;
    this.controls = controls;
    this.mainLight = mainLight;
    this.hemisphereLight = hemisphereLight;
    this.loop = loop;
    this.clickHandler = clickHandler;

    // 连接GUI到世界组件
    gui.connectToWorld(this);

    loop.updatables.push(controls);
    scene.add(mainLight, hemisphereLight);

    new Resizer(container, camera, renderer);
  }

  async init() {
    const birds = await loadBirds();
    loop.updatables.push(birds);
    scene.add(birds);

    // 注册鸟类为可点击对象
    this.registerBirdsAsClickable(birds);
  }

  registerBirdsAsClickable(birdGroup) {
    // 遍历鸟群中的每只鸟
    birdGroup.traverse((child) => {
      if (child.isMesh || (child.isGroup && child.children.length > 0)) {
        // 检查是否是鸟类模型
        let birdType = null;

        // 遍历父级查找模型来源信息
        let current = child;
        while (current && !birdType) {
          if (current.userData && current.userData.modelUrl) {
            if (current.userData.modelUrl.includes('Flamingo')) birdType = 'flamingo';
            else if (current.userData.modelUrl.includes('Parrot')) birdType = 'parrot';
            else if (current.userData.modelUrl.includes('Stork')) birdType = 'stork';
          }
          current = current.parent;
        }

        // 如果没有找到，根据位置推断（备用方案）
        if (!birdType && child.position) {
          if (child.position.x < -2) birdType = 'flamingo';
          else if (child.position.x > 2) birdType = 'stork';
          else birdType = 'parrot';
        }

        if (birdType) {
          clickHandler.addClickableObject(child, { birdType });
        }
      }
    });
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

  destroy() {
    this.stop();
    if (gui) {
      gui.destroy();
    }
    if (clickHandler) {
      clickHandler.destroy();
    }
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

    // 获取GUI动画参数
    const animParams = gui ? gui.getAnimationParams() : { speed: 1, rotationSpeed: 0.2, birdRotationSpeed: 0.5, autoRotate: true };

    // 应用动画速度倍数
    const adjustedDelta = delta * animParams.speed;

    for (const object of this.updatables) {
      if (object.tick) {
        // 如果是鸟群对象，传递GUI参数
        if (object.userData && object.userData.isBirdGroup) {
          object.tick(adjustedDelta, animParams);
        } else {
          object.tick(adjustedDelta);
        }
      }
    }
  }
}

// 导入时钟
import { Clock } from 'three';

const clock = new Clock();

export { World };
