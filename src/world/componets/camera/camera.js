import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(
    35, // fov
    1, // aspect ratio (会在 Resizer 中更新)
    0.1, // near
    100, // far
  );

  // 设置摄像机初始位置
  camera.position.set(-1.5, 1.5, 6.5);

  return camera;
}

export { createCamera };
