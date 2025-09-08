import { Raycaster, Vector2 } from 'three';

class ClickHandler {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.clickableObjects = [];

    this.bindEvents();
  }

  bindEvents() {
    // 添加点击事件监听
    this.renderer.domElement.addEventListener('click', (event) => {
      this.handleClick(event);
    });

    // 添加鼠标悬停效果
    this.renderer.domElement.addEventListener('mousemove', (event) => {
      this.handleMouseMove(event);
    });
  }

  // 注册可点击对象
  addClickableObject(object, data = {}) {
    object.userData.clickable = true;
    object.userData.clickData = data;
    this.clickableObjects.push(object);
  }

  // 移除可点击对象
  removeClickableObject(object) {
    object.userData.clickable = false;
    object.userData.clickData = null;
    const index = this.clickableObjects.indexOf(object);
    if (index > -1) {
      this.clickableObjects.splice(index, 1);
    }
  }

  // 处理点击事件
  handleClick(event) {
    // 计算鼠标位置（标准化设备坐标）
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 更新射线投射器
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 检测交集
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      // 找到第一个可点击的对象
      for (let i = 0; i < intersects.length; i++) {
        const intersectedObject = intersects[i].object;
        const clickableParent = this.findClickableParent(intersectedObject);

        if (clickableParent && clickableParent.userData.clickable) {
          this.handleObjectClick(clickableParent, intersects[i]);
          break;
        }
      }
    }
  }

  // 处理鼠标移动（悬停效果）
  handleMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // 重置所有对象的悬停状态
    this.clickableObjects.forEach(obj => {
      if (obj.userData.isHovered) {
        obj.userData.isHovered = false;
        this.resetObjectAppearance(obj);
      }
    });

    // 检查是否悬停在可点击对象上
    let isHoveringClickable = false;
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const intersectedObject = intersects[i].object;
        const clickableParent = this.findClickableParent(intersectedObject);

        if (clickableParent && clickableParent.userData.clickable) {
          clickableParent.userData.isHovered = true;
          this.highlightObject(clickableParent);
          isHoveringClickable = true;
          break;
        }
      }
    }

    // 更改鼠标样式
    this.renderer.domElement.style.cursor = isHoveringClickable ? 'pointer' : 'default';
  }

  // 查找可点击的父对象
  findClickableParent(object) {
    let current = object;
    while (current) {
      if (current.userData && current.userData.clickable) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  // 处理对象点击
  handleObjectClick(object, intersection) {
    const clickData = object.userData.clickData;

    // 创建点击事件
    const clickEvent = new CustomEvent('birdClicked', {
      detail: {
        object,
        intersection,
        data: clickData
      }
    });

    // 分发事件
    document.dispatchEvent(clickEvent);

    // 添加点击动画效果
    this.animateClick(object);
  }

  // 高亮对象
  highlightObject(object) {
    object.traverse((child) => {
      if (child.isMesh && child.material) {
        // 保存原始发光度
        if (child.material.emissive && !child.userData.originalEmissive) {
          child.userData.originalEmissive = child.material.emissive.clone();
        }

        // 添加发光效果
        if (child.material.emissive) {
          child.material.emissive.setHex(0x444444);
        }
      }
    });
  }

  // 重置对象外观
  resetObjectAppearance(object) {
    object.traverse((child) => {
      if (child.isMesh && child.material && child.userData.originalEmissive) {
        child.material.emissive.copy(child.userData.originalEmissive);
      }
    });
  }

  // 点击动画
  animateClick(object) {
    const originalScale = object.scale.clone();
    const targetScale = originalScale.clone().multiplyScalar(1.1);

    // 简单的缩放动画
    const duration = 200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用easeOut缓动
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      if (progress < 0.5) {
        // 放大阶段
        const scaleProgress = easeProgress * 2;
        object.scale.lerpVectors(originalScale, targetScale, scaleProgress);
      } else {
        // 缩小阶段
        const scaleProgress = (easeProgress - 0.5) * 2;
        object.scale.lerpVectors(targetScale, originalScale, scaleProgress);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        object.scale.copy(originalScale);
      }
    };

    animate();
  }

  // 销毁
  destroy() {
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('click', this.handleClick);
      this.renderer.domElement.removeEventListener('mousemove', this.handleMouseMove);
    }
    this.clickableObjects = [];
  }
}

function createClickHandler(camera, scene, renderer) {
  return new ClickHandler(camera, scene, renderer);
}

export { createClickHandler, ClickHandler };
