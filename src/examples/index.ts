import Game from "../engine/game/Game";
import Example1 from "./assets_loading/Example1";
// import "./pixi";
import ExampleAtlas from "./atlas/ExampleAtlas";
import ExampleReactivePositioning from "./reactive_positioning/ExampleReactivePositioning";
import ExampleTweens from "./tweens/ExampleTweens";
import ExampleComponents from "./components/ExampleComponents";
import ExampleUpdateLoop from "./gameloop/ExampleUpdateLoop";
import ExampleKeyboard from "./keyboard/ExampleKeyboard";

const game = new Game({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    // antialias: true,
    // autoResize: true,
});

// game.addScene(new ExampleKeyboard());
// game.addScene(new ExampleAtlas());
// game.addScene(new ExampleUpdateLoop());
game.addScene(new ExampleKeyboard());
// game.addScene(new ExampleTweens());
// game.addScene(new ExampleReactivePositioning());
// game.addScene(new ExampleComponents());
// game.addScene(new ExampleReactive());
