import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  // 开启阻尼以获得更平滑的控制感觉
  controls.enableDamping = true;

  // 前进距离（向目标移动多少）
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
