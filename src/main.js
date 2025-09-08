import { World } from './world/world.js';

async function main() {
  // 获取场景容器
  const container = document.querySelector('#scene-container');

  // 如果容器不存在，创建一个
  if (!container) {
    const newContainer = document.createElement('div');
    newContainer.id = 'scene-container';
    newContainer.style.width = '100vw';
    newContainer.style.height = '100vh';
    newContainer.style.overflow = 'hidden';
    document.body.appendChild(newContainer);
  }

  // 创建一个新的世界
  const world = new World(container || document.querySelector('#scene-container'));

  // 完成加载过程
  await world.init();

  // 开始动画循环
  world.start();
}

main().catch((err) => {
  console.error('应用启动时出错:', err);
});
