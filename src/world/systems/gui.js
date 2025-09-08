import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

class AnimationGUI {
  constructor() {
    this.gui = new GUI();
    this.params = {
      // 动画控制参数
      animationSpeed: 1.0,
      rotationSpeed: 0.2,
      birdRotationSpeed: 0.5,
      autoRotate: true,

      // 光照控制参数
      mainLightIntensity: 5,
      hemisphereIntensity: 2,

      // 摄像机控制参数
      enableDamping: true,
      dampingFactor: 0.05,

      // 场景控制参数
      backgroundColor: '#87CEEB',

      // 功能按钮
      resetCamera: () => this.resetCamera(),
      pauseAnimation: () => this.toggleAnimation(),
    };

    this.isPaused = false;
    this.originalAnimationLoop = null;

    this.setupGUI();
  }

  setupGUI() {
    // 动画控制文件夹
    const animationFolder = this.gui.addFolder('动画控制');
    animationFolder.add(this.params, 'animationSpeed', 0, 3, 0.1).name('动画速度');
    animationFolder.add(this.params, 'rotationSpeed', 0, 1, 0.01).name('鸟群旋转速度');
    animationFolder.add(this.params, 'birdRotationSpeed', 0, 2, 0.1).name('单鸟旋转速度');
    animationFolder.add(this.params, 'autoRotate').name('自动旋转');
    animationFolder.add(this.params, 'pauseAnimation').name('暂停/继续动画');
    animationFolder.open();

    // 光照控制文件夹
    const lightFolder = this.gui.addFolder('光照控制');
    lightFolder.add(this.params, 'mainLightIntensity', 0, 20, 0.5).name('主光源强度');
    lightFolder.add(this.params, 'hemisphereIntensity', 0, 10, 0.5).name('环境光强度');

    // 摄像机控制文件夹
    const cameraFolder = this.gui.addFolder('摄像机控制');
    cameraFolder.add(this.params, 'enableDamping').name('启用阻尼');
    cameraFolder.add(this.params, 'dampingFactor', 0.01, 0.2, 0.01).name('阻尼系数');
    cameraFolder.add(this.params, 'resetCamera').name('重置摄像机');

    // 场景控制文件夹
    const sceneFolder = this.gui.addFolder('场景控制');
    sceneFolder.addColor(this.params, 'backgroundColor').name('背景颜色');
  }

  // 连接到世界组件
  connectToWorld(world) {
    this.world = world;
    this.setupWorldConnections();
  }

  setupWorldConnections() {
    if (!this.world) return;

    // 监听参数变化并应用到世界
    const gui = this.gui;

    // 光照控制
    const lightFolder = gui.folders.find(f => f._title === '光照控制');
    if (lightFolder && this.world.mainLight && this.world.hemisphereLight) {
      lightFolder.controllers.forEach(controller => {
        if (controller.property === 'mainLightIntensity') {
          controller.onChange(value => {
            this.world.mainLight.intensity = value;
          });
        }
        if (controller.property === 'hemisphereIntensity') {
          controller.onChange(value => {
            this.world.hemisphereLight.intensity = value;
          });
        }
      });
    }

    // 摄像机控制
    const cameraFolder = gui.folders.find(f => f._title === '摄像机控制');
    if (cameraFolder && this.world.controls) {
      cameraFolder.controllers.forEach(controller => {
        if (controller.property === 'enableDamping') {
          controller.onChange(value => {
            this.world.controls.enableDamping = value;
          });
        }
        if (controller.property === 'dampingFactor') {
          controller.onChange(value => {
            this.world.controls.dampingFactor = value;
          });
        }
      });
    }

    // 场景控制
    const sceneFolder = gui.folders.find(f => f._title === '场景控制');
    if (sceneFolder && this.world.scene) {
      sceneFolder.controllers.forEach(controller => {
        if (controller.property === 'backgroundColor') {
          controller.onChange(value => {
            this.world.scene.background.setStyle(value);
          });
        }
      });
    }
  }

  resetCamera() {
    if (this.world && this.world.camera) {
      this.world.camera.position.set(-1.5, 1.5, 6.5);
      this.world.camera.lookAt(0, 0, 0);
      if (this.world.controls) {
        this.world.controls.reset();
      }
    }
  }

  toggleAnimation() {
    this.isPaused = !this.isPaused;

    if (this.world && this.world.loop) {
      if (this.isPaused) {
        this.world.loop.stop();
        // 更新按钮文本
        const animationFolder = this.gui.folders.find(f => f._title === '动画控制');
        const pauseController = animationFolder.controllers.find(c => c.property === 'pauseAnimation');
        if (pauseController) {
          pauseController.name('继续动画');
        }
      } else {
        this.world.loop.start();
        // 更新按钮文本
        const animationFolder = this.gui.folders.find(f => f._title === '动画控制');
        const pauseController = animationFolder.controllers.find(c => c.property === 'pauseAnimation');
        if (pauseController) {
          pauseController.name('暂停动画');
        }
      }
    }
  }

  // 获取动画参数供外部使用
  getAnimationParams() {
    return {
      speed: this.params.animationSpeed,
      rotationSpeed: this.params.rotationSpeed,
      birdRotationSpeed: this.params.birdRotationSpeed,
      autoRotate: this.params.autoRotate,
    };
  }

  // 销毁GUI
  destroy() {
    if (this.gui) {
      this.gui.destroy();
    }
  }
}

function createGUI() {
  return new AnimationGUI();
}

export { createGUI, AnimationGUI };
