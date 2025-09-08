const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container, camera, renderer) {
    // 立即调用一次 setSize 来设置初始大小
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => {
      // 每当窗口大小调整时设置大小
      setSize(container, camera, renderer);
      // 执行此操作只是为了修复奇怪的错误
      // 其中画布没有调整大小直到第二次调整窗口大小事件
      this.onResize();
    });
  }

  onResize() { }
}

export { Resizer };
