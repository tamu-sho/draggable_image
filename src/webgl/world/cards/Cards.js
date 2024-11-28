import * as THREE from 'three';
import Experience from '../../Experience';
import { textureScaleConverter } from '../../utils/textureConverter';
import cardFragmentShader from '../../shaders/card/fragment.glsl';
import cardVertexShader from '../../shaders/card/vertex.glsl';

export default class Cards {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.draggable = this.experience.draggable;
    this.allTextures = this.experience.resources.itmes;
    this.camera = this.experience.camera;
    this.cardParams = this.experience.cardParams;

    this.targetPosition = { x: 0, y: 0 };

    // 使用テクスチャ
    this.textures = [
      this.allTextures['image1'],
      this.allTextures['image2'],
      this.allTextures['image3'],
      this.allTextures['image4'],
      this.allTextures['image5'],
      this.allTextures['image6'],
      this.allTextures['image7'],
      this.allTextures['image8'],
      this.allTextures['image9'],
      this.allTextures['image10'],
      this.allTextures['image11'],
      this.allTextures['image12'],
      this.allTextures['image13'],
      this.allTextures['image14'],
      this.allTextures['image15'],
      this.allTextures['image16'],
      this.allTextures['image17'],
      this.allTextures['image18'],
      this.allTextures['image19'],
      this.allTextures['image20'],
      this.allTextures['image21'],
      this.allTextures['image22'],
      this.allTextures['image23'],
      this.allTextures['image24'],
    ];

    // カードの自動アニメーション
    this.cardContainer = new THREE.Group();
    this.scene.add(this.cardContainer);

    // カードグループ
    this.cardsGroup = new THREE.Group();
    this.cardContainer.add(this.cardsGroup);

    // カードの配列
    this.cards = [];

    this.setCards();
  }

  // cardの作成
  setCards() {
    const { width, height, col, row, gap } = this.cardParams;

    const startX = (width * col + gap * (col - 1)) / 2 - width / 2;
    const startY = (height * row + gap * (row - 1)) / 2 - height / 2;

    const geometry = new THREE.PlaneGeometry(width, height, 50);
    const material = new THREE.ShaderMaterial({
      vertexShader: cardVertexShader,
      fragmentShader: cardFragmentShader,
      uniforms: {
        uTexture: { value: null },
        uCount: { value: 0 },
        uUvScale: { value: new THREE.Vector2() },
      },
    });

    let i = 0;
    for (let x = 0; x < col; x++) {
      for (let y = 0; y < row; y++) {
        const mat = material.clone();
        mat.uniforms.uTexture.value = this.textures[i++ % this.textures.length];

        const uvScale = textureScaleConverter(
          mat.uniforms.uTexture.value,
          width / height
        );
        mat.uniforms.uUvScale.value.set(uvScale[0], uvScale[1]);

        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.x = x * width + x * gap - startX;
        mesh.position.y = y * height + y * gap - startY;

        mesh.position.y += x % 2 === 0 ? (height + gap) / 2 : 0;

        this.cardsGroup.add(mesh);
        this.cards.push(mesh);
      }
    }
  }

  // // // カードの位置を更新する処理 (スクリーン基準)
  // updateCardPosition() {
  //   const { width, height, col, row, gap } = this.cardParams;

  //   const screenWidth = width * col + gap * (col - 1) - width;
  //   const screenHeight = height * row + gap * (row - 1) - height;

  //   for (let i = 0; i < this.cards.length; i++) {
  //     const card = this.cards[i];
  //     const cardWorldPosition = card.getWorldPosition(new THREE.Vector3());
  //     let testPosition = new THREE.Vector3();

  //     if (cardWorldPosition.y < 0) {
  //       testPosition.copy(cardWorldPosition).y += height / 2 + gap;
  //       testPosition.x = 0;
  //       if (!this.camera.frustum.containsPoint(testPosition)) {
  //         card.position.y += screenHeight + height + gap;

  //         // カードの画像を更新
  //         const count = ++card.material.uniforms.uCount.value;
  //         card.material.uniforms.uTexture.value = this.textures.at(
  //           (i + count * col * row) % this.textures.length
  //         );
  //       }
  //     } else {
  //       testPosition.copy(cardWorldPosition).y -= height / 2 + gap;
  //       testPosition.x = 0;
  //       if (!this.camera.frustum.containsPoint(testPosition)) {
  //         card.position.y -= screenHeight + height + gap;

  //         // カードの画像を更新
  //         const count = --card.material.uniforms.uCount.value;
  //         card.material.uniforms.uTexture.value = this.textures.at(
  //           (i + count * col * row) % this.textures.length
  //         );
  //       }
  //     }

  //     if (cardWorldPosition.x < 0) {
  //       testPosition.copy(cardWorldPosition).x += width / 2 + gap;
  //       testPosition.y = 0;
  //       if (!this.camera.frustum.containsPoint(testPosition)) {
  //         card.position.x += screenWidth + width + gap;

  //         // カードの画像を更新
  //         const count = ++card.material.uniforms.uCount.value;
  //         card.material.uniforms.uTexture.value = this.textures.at(
  //           (i + count * col * row) % this.textures.length
  //         );
  //       }
  //     } else {
  //       testPosition.copy(cardWorldPosition).x -= width / 2 + gap;
  //       testPosition.y = 0;
  //       if (!this.camera.frustum.containsPoint(testPosition)) {
  //         card.position.x -= screenWidth + width + gap;

  //         // カードの画像を更新
  //         const count = --card.material.uniforms.uCount.value;
  //         card.material.uniforms.uTexture.value = this.textures.at(
  //           (i + count * col * row) % this.textures.length
  //         );
  //       }
  //     }
  //   }
  // }

  // // カードの位置を更新する処理 (カード基準)
  updateCardPosition() {
    const { width, height, col, row, gap } = this.cardParams;

    const screenWidth = width * col + gap * (col - 1) - width;
    const screenHeight = height * row + gap * (row - 1) - height;
    const halfCardColWidth = screenWidth / 2;
    const harlCardRowHeight = screenHeight / 2;

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const cardWorldPosition = card.getWorldPosition(new THREE.Vector3());
      let testPosition = new THREE.Vector3();

      if (cardWorldPosition.y < 0) {
        testPosition.copy(cardWorldPosition).y += height / 2 + gap;
        testPosition.x = 0;
        if (testPosition.y < -harlCardRowHeight) {
          card.position.y += screenHeight + height + gap;

          // カードの画像を更新
          const count = ++card.material.uniforms.uCount.value;
          card.material.uniforms.uTexture.value = this.textures.at(
            (i + count * col * row) % this.textures.length
          );
        }
      } else {
        testPosition.copy(cardWorldPosition).y -= height / 2 + gap;
        testPosition.x = 0;
        if (testPosition.y > harlCardRowHeight) {
          card.position.y -= screenHeight + height + gap;

          // カードの画像を更新
          const count = --card.material.uniforms.uCount.value;
          card.material.uniforms.uTexture.value = this.textures.at(
            (i + count * col * row) % this.textures.length
          );
        }
      }

      if (cardWorldPosition.x < 0) {
        testPosition.copy(cardWorldPosition).x += width / 2 + gap;
        testPosition.y = 0;
        if (testPosition.x < -halfCardColWidth) {
          card.position.x += screenWidth + width + gap;

          // カードの画像を更新
          const count = ++card.material.uniforms.uCount.value;
          card.material.uniforms.uTexture.value = this.textures.at(
            (i + count * col * row) % this.textures.length
          );
        }
      } else {
        testPosition.copy(cardWorldPosition).x -= width / 2 + gap;
        testPosition.y = 0;
        if (testPosition.x > halfCardColWidth) {
          card.position.x -= screenWidth + width + gap;

          // カードの画像を更新
          const count = --card.material.uniforms.uCount.value;
          card.material.uniforms.uTexture.value = this.textures.at(
            (i + count * col * row) % this.textures.length
          );
        }
      }
    }
  }

  // Tickの処理
  update() {
    // カメラの自動スクロール
    if (!this.draggable.isMouseDown) {
      this.cardContainer.position.x += this.time.delta * 0.00008;
      this.cardContainer.position.y -= this.time.delta * 0.00008;
    }

    // ドラッグのアニメーション
    this.cardsGroup.position.x = THREE.MathUtils.lerp(
      this.cardsGroup.position.x,
      this.targetPosition.x,
      0.125
    );
    this.cardsGroup.position.y = THREE.MathUtils.lerp(
      this.cardsGroup.position.y,
      this.targetPosition.y,
      0.125
    );

    this.updateCardPosition();
  }

  // ドラッグ処理
  drag() {
    const currentMouse = this.draggable.currentMousePosition;
    const prevMouse = this.draggable.prevMousePosition;

    // 移動距離
    this.targetPosition.x += (currentMouse.x - prevMouse.x) * 4.15;
    this.targetPosition.y += (currentMouse.y - prevMouse.y) * 4.15;
  }
}
