import { World } from './world/world.js';
import './components/BirdInfoModal.js';

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

  // 设置鸟类点击事件监听
  document.addEventListener('birdClicked', (event) => {
    const { data } = event.detail;
    if (data && data.birdType) {
      // 显示鸟类信息模态框
      window.BirdInfoModal.show(data.birdType);
    }
  });

  // 开始动画循环
  world.start();
}

main().catch((err) => {
  console.error('应用启动时出错:', err);
});
