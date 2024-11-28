import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience';
import { tan } from 'three/examples/jsm/nodes/Nodes.js';

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.cardParams = this.experience.cardParams;

    this.setInstance();
    // this.setControls();

    // 投射平面取得用
    this.frustum = new THREE.Frustum();
  }

  setInstance() {
    const { height, gap, row } = this.cardParams;
    this.instance = new THREE.PerspectiveCamera(
      45, // default 45
      this.sizes.width / this.sizes.height,
      0.01,
      20
    );

    // カメラの距離の算出方法
    const screeHeight = (height + gap) * (row - 1);
    const posZ = screeHeight * 1.2;
    this.instance.position.set(0, 0, posZ);

    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  // リサイズ処理
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  // Tick処理
  update() {
    // this.controls.update();
    // カメラの投影されている円錐平面の取得
    this.instance.updateMatrix();
    this.instance.updateMatrixWorld();
    const martix = new THREE.Matrix4().multiplyMatrices(
      this.instance.projectionMatrix,
      this.instance.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(martix);

    // console.log(this.frustum);
  }
}
