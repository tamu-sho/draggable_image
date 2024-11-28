import * as THREE from 'three';
import Experience from '../Experience';

export default class TestObject {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.cardParams = this.experience.cardParams;

    this.setObject();
  }

  setObject() {
    // const geometry = new THREE.BoxGeometry(1, 1);
    // const material = new THREE.MeshMatcapMaterial({ color: '#ff0000' });

    // this.instance = new THREE.Mesh(geometry, material);
    // this.scene.add(this.instance);

    // card 表示エリアのサイズ
    const { width, height, col, row, gap } = this.cardParams;

    const screenWidth = width * col + gap * (col - 1) - width;
    const screenHeight = height * row + gap * (row - 1) - height;
    const halfCardColWidth = screenWidth / 2;
    const harlCardRowHeight = screenHeight / 2;

    const testMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(halfCardColWidth * 2, harlCardRowHeight * 2),
      new THREE.MeshBasicMaterial({ color: 'cyan' })
    );
    testMesh.position.z = -0.01;
    // testMesh.position.y = harlCardRowHeight / 2;
    this.scene.add(testMesh);
  }
}
