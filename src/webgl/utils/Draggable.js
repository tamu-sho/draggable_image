import EventEmitter from './EventEmitter';
import Experience from '../Experience';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

export default class Draggable extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;

    this.isMouseDown = false;
    this.currentMousePosition = { x: 0, y: 0 };
    this.prevMousePosition = { x: 0, y: 0 };

    // PC
    // ---------------------------------------------------
    // ドラッグの開始
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;

      const normalizeX = e.clientX / this.sizes.height;
      const normalizeY = 1 - e.clientY / this.sizes.height;

      this.currentMousePosition = { x: normalizeX, y: normalizeY };
      this.prevMousePosition = { x: normalizeX, y: normalizeY };
    });

    // ドラッグの終了
    this.canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
    });

    // ドラッグの検知
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        const normalizeX = e.clientX / this.sizes.height;
        const normalizeY = 1 - e.clientY / this.sizes.height;

        this.currentMousePosition = { x: normalizeX, y: normalizeY };

        this.trigger('drag');

        this.prevMousePosition = this.currentMousePosition;
      }
    });

    // タッチデバイス
    // ---------------------------------------------------
    // ドラッグの開始
    this.canvas.addEventListener('touchstart', (e) => {
      console.log('touchstart', e.changedTouches[0]);

      const touch = e.changedTouches[0];

      this.isMouseDown = true;
      const normalizeX = touch.clientX / this.sizes.height;
      const normalizeY = 1 - touch.clientY / this.sizes.height;
      this.currentMousePosition = { x: normalizeX, y: normalizeY };
      this.prevMousePosition = { x: normalizeX, y: normalizeY };
    });

    // ドラッグの終了
    this.canvas.addEventListener('touchend', () => {
      console.log('touchend');
      this.isMouseDown = false;
    });
    this.canvas.addEventListener('touchcancel', () => {
      console.log('touchcancel');
      this.isMouseDown = false;
    });

    // ドラッグの検知
    this.canvas.addEventListener('touchmove', (e) => {
      console.log('touchmove');

      const touch = e.changedTouches[0];

      if (this.isMouseDown) {
        const normalizeX = touch.clientX / this.sizes.height;
        const normalizeY = 1 - touch.clientY / this.sizes.height;

        this.currentMousePosition = { x: normalizeX, y: normalizeY };

        this.trigger('drag');

        this.prevMousePosition = this.currentMousePosition;
      }
    });
  }
}
