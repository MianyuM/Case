import { Group, AnimationMixer, MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadBirds() {
  const loader = new GLTFLoader();

  // 创建一个鸟群组
  const birdGroup = new Group();

  try {
    // 加载不同的鸟类模型
    const birdModels = [
      { url: '/assets/models/Flamingo.glb', position: [-3, 0, 0], scale: 0.3 },
      { url: '/assets/models/Parrot.glb', position: [0, 0, 0], scale: 0.1 },
      { url: '/assets/models/Stork.glb', position: [3, 0, 0], scale: 0.3 }
    ];

    const birds = [];
    const mixers = [];

    for (let i = 0; i < birdModels.length; i++) {
      const modelData = birdModels[i];

      try {
        const gltf = await loader.loadAsync(modelData.url);
        const bird = gltf.scene;

        // 设置位置和缩放
        bird.position.set(...modelData.position);
        bird.scale.setScalar(modelData.scale);

        // 保存模型信息供点击检测使用
        bird.userData.modelUrl = modelData.url;

        // 设置动画
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new AnimationMixer(bird);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          mixers.push(mixer);
        }

        // 添加旋转动画
        bird.tick = (delta, rotationSpeed = 0.5) => {
          bird.rotation.y += delta * rotationSpeed;
        };

        birds.push(bird);
        birdGroup.add(bird);
      } catch (modelError) {
        console.warn(`无法加载模型 ${modelData.url}:`, modelError);
      }
    }

    // 标记为鸟群对象
    birdGroup.userData = { isBirdGroup: true };

    // 为整个鸟群添加动画循环
    birdGroup.tick = (delta, animParams) => {
      // 获取动画参数，如果没有传入则使用默认值
      const params = animParams || { rotationSpeed: 0.2, birdRotationSpeed: 0.5, autoRotate: true };

      // 更新动画混合器
      mixers.forEach(mixer => mixer.update(delta));

      // 更新每只鸟的自定义动画
      birds.forEach(bird => {
        if (bird.tick) bird.tick(delta, params.birdRotationSpeed);
      });

      // 让整个鸟群旋转（如果启用自动旋转）
      if (params.autoRotate) {
        birdGroup.rotation.y += delta * params.rotationSpeed;
      }
    };

    return birdGroup;

  } catch (error) {
    console.error('加载鸟类模型时出错:', error);

    // 如果模型加载失败，创建备用的简单几何体
    const { BoxGeometry, SphereGeometry, MeshStandardMaterial, Mesh } = await import('three');

    const fallbackGroup = new Group();

    // 创建简单的鸟形状作为备用
    const bodyGeometry = new BoxGeometry(1, 0.5, 2);
    const headGeometry = new SphereGeometry(0.3);
    const material = new MeshStandardMaterial({ color: 'orange' });

    // 创建三只备用鸟
    for (let i = 0; i < 3; i++) {
      const birdGroup = new Group();

      const body = new Mesh(bodyGeometry, material);
      const head = new Mesh(headGeometry, material);
      head.position.set(0, 0, 1.2);

      birdGroup.add(body, head);
      birdGroup.position.x = (i - 1) * 3;

      fallbackGroup.add(birdGroup);
    }

    // 标记为鸟群对象
    fallbackGroup.userData = { isBirdGroup: true };

    fallbackGroup.tick = (delta, animParams) => {
      const params = animParams || { rotationSpeed: 0.2, autoRotate: true };
      if (params.autoRotate) {
        fallbackGroup.rotation.y += delta * params.rotationSpeed;
      }
    };

    return fallbackGroup;
  }
}

export { loadBirds };
