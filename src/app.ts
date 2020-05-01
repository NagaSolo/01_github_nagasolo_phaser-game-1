import "phaser";
const config: GameConfig = {
  title: "Lari Lari Anak",
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#18216D"
};
export class LarilarianakGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
window.onload = () => {
  var game = new LarilarianakGame(config);
};
