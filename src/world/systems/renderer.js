import { WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });

  // 开启物理正确的光照
  renderer.useLegacyLights = false;

  return renderer;
}

export { createRenderer };
