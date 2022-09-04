import Game from "../engine/game/Game";
import MainScene from "./MainScene";

const game = new Game({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: 1,
    // antialias: true,
    // autoResize: true,
});

game.addScene(new MainScene());
