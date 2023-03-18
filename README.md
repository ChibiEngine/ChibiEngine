# Chibi Engine (WIP)

The goal is to create a 2D Web game engine to simplify game development.

It acts as a wrapper on top of the rendering engine [PixiJS](https://github.com/pixijs/pixijs).

## Objectives
- Modern API, easy to use. Inspired by [Flash](https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/package-detail.html) and [Cocos2d-x](https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/). 
- Focused on Object-Oriented Programming through an extensible node and component system.
- Implicit dynamic assets loading.

## Roadmap

- [x] Event system
- [x] Transparent resource loading
- [x] Nodes
- [x] Sprites
- [x] Game loops
  - [x] Update loop
  - [x] Render loop
- [x] Entity Component System (ECS)
- [ ] Scenes ⚒️
  - [x] Basic implementation
  - [ ] Transitions between scenes
- [ ] Automated position interpolation ⚒️
- [ ] Input ⚒️
  - [ ] Keyboard
  - [ ] Mouse
  - [ ] Gamepad
  - [ ] Touch
- [ ] Implement missing [transformation attributes](https://pixijs.download/dev/docs/PIXI.Container.html)..
- [ ] Audio: SFX and Music with volume control
- [ ] English translation ⚒️
- [x] Tweens and sequences (inspired by [Cocos2d-x](https://docs.cocos.com/cocos2d-x/manual/en/actions/getting_started.html))
  - [x] Easing functions ([penner](https://github.com/bcherny/penner) / [phaser](https://github.com/photonstorm/phaser/tree/master/src/math/easing))
  - [ ] Implement missing actions
- [ ] Camera (inspired by [pixi-viewport](https://github.com/davidfig/pixi-viewport))
  - [ ] Parallax
  - [ ] Lerp
  - [ ] Constraints
  - [ ] Effects
- [ ] Physics engine
  - [ ] Wrapper of [planck.js](https://github.com/shakiba/planck.js/)
  - [ ] Wrapper of [box2d-wasm](https://github.com/Birch-san/box2d-wasm) 🔮
- [ ] Refactoring & code cleanup
- [ ] Documentation
  - [ ] API Reference
  - [ ] Getting Started
- [ ] Custom animation engine
  - [ ] JSON Animation format
  - [ ] Frame-by-frame element integration
  - [ ] Animation editor 🔮
- [ ] Tilemap
- [ ] PIXI filters (shaders)
- [ ] Masks
- [ ] Meshes
- [ ] Dynamic node loading (prefab) ❓
- [ ] Atlas generation at runtime (for optimization) 🔮
    - [ ] Or ahead-of-time at compile-time? Or with a CLI?
- [ ] 3D support with [three.js](https://github.com/mrdoob/three.js) 🔮
- [ ] Native Desktop/Android/iOS version with [cocos2d-x](https://github.com/cocos2d/cocos2d-x) 🔮

⚒️ Work in progress...

🔮 Non-essential feature that will arrive in the distant future

❓ Potentially irrelevant feature

----

Chibiland - http://chibi.land/  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  • &nbsp;&nbsp;&nbsp;&nbsp;Feavy 2023 - https://feavy.fr/