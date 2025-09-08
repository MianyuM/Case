import { Color, Scene } from 'three';

function createScene() {
  const scene = new Scene();

  // 设置背景颜色为天蓝色
  scene.background = new Color('skyblue');

  return scene;
}

export { createScene };
