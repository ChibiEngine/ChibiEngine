import Game from "../engine/game/Game";
import Example1 from "./Example1";
import "./pixi";
import ExampleAtlas from "./ExampleAtlas";
import ExampleReactivePositioning from "./ExampleReactivePositioning";

const game = new Game({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    // antialias: true,
    // autoResize: true,
});

// game.addScene(new Example1());
// game.addScene(new ExampleAtlas());
game.addScene(new ExampleReactivePositioning());
