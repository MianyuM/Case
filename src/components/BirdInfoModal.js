// 鸟类信息数据库
const BIRD_DATA = {
  flamingo: {
    name: '火烈鸟',
    englishName: 'Flamingo',
    description: '火烈鸟是一种大型涉禽，以其鲜艳的粉红色羽毛和优雅的姿态而闻名。它们主要生活在热带和亚热带地区的咸水湖、泻湖和河口。',
    habitat: '咸水湖、泻湖、河口',
    diet: '小虾、藻类、小鱼',
    lifespan: '20-30年',
    wingspan: '140-165厘米',
    weight: '2-4公斤',
    specialFeatures: [
      '粉红色羽毛来自食物中的类胡萝卜素',
      '能够单腿站立长时间保持平衡',
      '具有特殊的滤食性喙部结构'
    ],
    image: '/assets/models/Flamingo.glb',
    color: '#FF69B4'
  },
  parrot: {
    name: '鹦鹉',
    englishName: 'Parrot',
    description: '鹦鹉是智力极高的鸟类，以其鲜艳的羽毛、强壮的喙部和模仿人类语言的能力而著称。它们是热带和亚热带地区的标志性鸟类。',
    habitat: '热带雨林、林地、草原',
    diet: '种子、果实、花蜜、昆虫',
    lifespan: '50-100年',
    wingspan: '80-100厘米',
    weight: '0.5-1.5公斤',
    specialFeatures: [
      '极高的智力，能够学习和模仿语言',
      '强壮的弯曲喙部，适合破开坚果',
      '鲜艳多彩的羽毛，具有社交功能'
    ],
    image: '/assets/models/Parrot.glb',
    color: '#32CD32'
  },
  stork: {
    name: '鹳鸟',
    englishName: 'Stork',
    description: '鹳鸟是大型涉禽，以其长腿、长颈和长喙而特征明显。它们是候鸟，以长距离迁徙和在屋顶筑巢的习性而闻名。',
    habitat: '湿地、草原、农田',
    diet: '鱼类、青蛙、小型哺乳动物、昆虫',
    lifespan: '25-35年',
    wingspan: '155-215厘米',
    weight: '2.5-4.5公斤',
    specialFeatures: [
      '出色的长距离迁徙能力',
      '在高处筑建大型巢穴',
      '具有优秀的飞行和滑翔技巧'
    ],
    image: '/assets/models/Stork.glb',
    color: '#4682B4'
  }
};

class BirdInfoModal {
  constructor() {
    this.modal = null;
    this.isVisible = false;
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    // 创建模态框HTML结构
    const modalHTML = `
      <div id="bird-info-modal" class="bird-modal">
        <div class="bird-modal-content">
          <div class="bird-modal-header">
            <h2 id="bird-name"></h2>
            <span class="bird-close">&times;</span>
          </div>
          <div class="bird-modal-body">
            <div class="bird-info-grid">
              <div class="bird-description">
                <p id="bird-description"></p>
              </div>
              <div class="bird-details">
                <div class="bird-detail-item">
                  <strong>栖息地:</strong>
                  <span id="bird-habitat"></span>
                </div>
                <div class="bird-detail-item">
                  <strong>食物:</strong>
                  <span id="bird-diet"></span>
                </div>
                <div class="bird-detail-item">
                  <strong>寿命:</strong>
                  <span id="bird-lifespan"></span>
                </div>
                <div class="bird-detail-item">
                  <strong>翼展:</strong>
                  <span id="bird-wingspan"></span>
                </div>
                <div class="bird-detail-item">
                  <strong>体重:</strong>
                  <span id="bird-weight"></span>
                </div>
              </div>
              <div class="bird-features">
                <h3>特殊特征</h3>
                <ul id="bird-features-list"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('bird-info-modal');
  }

  bindEvents() {
    // 关闭按钮事件
    const closeBtn = this.modal.querySelector('.bird-close');
    closeBtn.addEventListener('click', () => this.hide());

    // 点击背景关闭
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  show(birdType) {
    const birdInfo = BIRD_DATA[birdType];
    if (!birdInfo) {
      console.warn(`未找到鸟类信息: ${birdType}`);
      return;
    }

    // 填充数据
    document.getElementById('bird-name').textContent = `${birdInfo.name} (${birdInfo.englishName})`;
    document.getElementById('bird-description').textContent = birdInfo.description;
    document.getElementById('bird-habitat').textContent = birdInfo.habitat;
    document.getElementById('bird-diet').textContent = birdInfo.diet;
    document.getElementById('bird-lifespan').textContent = birdInfo.lifespan;
    document.getElementById('bird-wingspan').textContent = birdInfo.wingspan;
    document.getElementById('bird-weight').textContent = birdInfo.weight;

    // 填充特征列表
    const featuresList = document.getElementById('bird-features-list');
    featuresList.innerHTML = '';
    birdInfo.specialFeatures.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });

    // 设置主题色
    const header = this.modal.querySelector('.bird-modal-header');
    header.style.backgroundColor = birdInfo.color;

    // 显示模态框
    this.modal.style.display = 'block';
    this.isVisible = true;

    // 添加显示动画
    requestAnimationFrame(() => {
      this.modal.classList.add('bird-modal-show');
    });
  }

  hide() {
    this.modal.classList.remove('bird-modal-show');

    // 等待动画完成后隐藏
    setTimeout(() => {
      this.modal.style.display = 'none';
      this.isVisible = false;
    }, 300);
  }

  // 根据模型URL推断鸟类类型
  getBirdTypeFromUrl(url) {
    if (url.includes('Flamingo')) return 'flamingo';
    if (url.includes('Parrot')) return 'parrot';
    if (url.includes('Stork')) return 'stork';
    return null;
  }
}

// 创建全局实例
const birdInfoModal = new BirdInfoModal();

// 导出供Three.js使用
window.BirdInfoModal = birdInfoModal;

export { BirdInfoModal, BIRD_DATA };
