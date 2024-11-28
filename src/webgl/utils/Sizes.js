import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    // セットアップ
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // リサイズイベント
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger('resize');
    });
  }
}
