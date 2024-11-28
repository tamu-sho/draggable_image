import * as THREE from 'three';
import Sizes from './utils/Sizes';
import Camera from './Camera';
import Renderer from './Renderer';
import Time from './utils/Time';
import World from './world/World';
import Debug from './utils/Debug';
import Resources from './utils/Resources';
import sources from './sources';
import Draggable from './utils/Draggable';

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // 複数のインスタンスが作成されないように制限
    if (instance) {
      return instance;
    }
    instance = this;

    // カード配置のパラメーター
    this.cardParams = {
      width: 1.0,
      height: 1.3,
      row: 4,
      col: 8, //偶数が良い
      gap: 0.125,
    };

    // グローバルからアクセスできるように(Debug用)
    window.experience = this;

    this.canvas = _canvas;

    // セットアップ
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.draggable = new Draggable();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // リサイズイベント
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Tickイベント
    this.time.on('tick', () => {
      this.update();
    });

    // ドラッグイベント
    this.draggable.on('drag', () => {
      this.drag();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
  drag() {
    this.world.drag();
  }
}
