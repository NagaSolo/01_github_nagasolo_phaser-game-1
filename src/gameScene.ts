import "phaser";

export class GameScene extends Phaser.Scene {
  delta: number;
  lastStarTime: number;
  starsCaught: number;
  starsFallen: number;
  sand: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(/*params: any*/): void {
    this.delta = 1000;
    this.lastStarTime = 0;
    this.starsCaught = 0;
    this.starsFallen = 0;
  }

  preload(): void {
    this.load.image("kid", "assets/hat-kid.png");
    this.load.image("stone", "assets/stone-block.png");
    this.load.image("star", "assets/rainbow-star.png");
  }

  create(): void {
    this.stone = this.physics.add.staticGroup({
      key: 'stone',
      frameQuantity: 20
    });
    Phaser.Actions.PlaceOnLine(this.stone.getChildren(),
      new Phaser.Geom.Line(20, 580, 820, 580));
    this.stone.refresh();

    this.info = this.add.text(10, 10, '',
      { font: '24px Arial Bold', fill: '#FBFBAC' });
  }

  update(time: number): void {
    var diff: number = time - this.lastStarTime;
    if (diff > this.delta) {
      this.lastStarTime = time;
      if (this.delta > 500) {
        this.delta -= 20;
      }
      this.emitStar();
    }
    this.info.text =
      this.starsCaught + " caught - " +
      this.starsFallen + " fallen (max 3)";
  }

  private onClick(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0x00ff00);
      star.setVelocity(0, 0);
      this.starsCaught += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
      }, [star], this);
    }
  }

  private onFall(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0xff0000);
      this.starsFallen += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
        if (this.starsFallen > 2) {
          this.scene.start("ScoreScene", { starsCaught: this.starsCaught });
        }
      }, [star], this);
    }
  }

  private emitStar(): void {
    var star: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(25, 775);
    var y = 26;
    star = this.physics.add.image(x, y, "star");

    star.setDisplaySize(50, 50);
    star.setVelocity(0, 200);
    star.setInteractive();

    star.on('pointerdown', this.onClick(star), this);
    this.physics.add.collider(star, this.stone, this.onFall(star), null, this);
  }
};
