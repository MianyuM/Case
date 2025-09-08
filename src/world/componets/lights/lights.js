import { DirectionalLight, HemisphereLight } from 'three';

function createLights() {
  // 创建主方向光
  const mainLight = new DirectionalLight('white', 5);
  mainLight.position.set(10, 10, 10);

  // 创建环境光
  const hemisphereLight = new HemisphereLight(
    'white', // 天空颜色
    'darkslategrey', // 地面颜色  
    2, // 强度
  );

  return { mainLight, hemisphereLight };
}

export { createLights };
