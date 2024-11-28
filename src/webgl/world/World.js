import Experience from '../Experience';
import TestObject from './TestObject';
import Cards from './cards/Cards';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      // セットアップ
      this.cards = new Cards();
      // this.testObject = new TestObject();
    });
  }

  // Tick処理
  update() {
    if (this.cards) this.cards.update();
  }

  // ドラッグ処理
  drag() {
    if (this.cards) this.cards.drag();
  }
}
