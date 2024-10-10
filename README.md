# Chibi Engine (WIP)

[![npm version](https://badge.fury.io/js/chibiengine.svg)](https://badge.fury.io/js/chibiengine)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ChibiEngine_ChibiEngine&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ChibiEngine_ChibiEngine)

## Goal

![illustration](https://github.com/user-attachments/assets/70701c00-8025-4e88-874a-c8dc4868dea0)

Chibi Engine aims to offer a modern and simple approach to game development with web technologies. It takes advantage of TypeScript and ES6 features such as asynchronism, classes, and mixins for a flexible and maintainable programming methodology, inspired by popular game engines.

Its main objective is to pave the way for cross-engine game development. In this way it introduces an abstraction layer over existing engines to simplify the development process, gathering their common features under a unified API, while still allowing developers to leverage specific engine capabilities.

Additionally, Chibi Engine aims to integrate usual game creation features such as an entity component system, a physics engine and camera system.

Currently, the main target is [PixiJS](https://github.com/pixijs/pixijs).

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
- [x] Automated props interpolation (position, rotation, size)
- [ ] Input
  - [x] Keyboard
  - [x] Mouse
  - [x] Touch
  - [ ] Gamepad
- [ ] Implement missing [transformation attributes](https://pixijs.download/dev/docs/PIXI.Container.html)..
- [ ] Audio: SFX and Music with volume control
- [ ] English translation ⚒️
- [x] Tweens and sequences (inspired by [Cocos2d-x](https://docs.cocos.com/cocos2d-x/manual/en/actions/getting_started.html))
  - [x] Easing functions ([penner](https://github.com/bcherny/penner) / [phaser](https://github.com/photonstorm/phaser/tree/master/src/math/easing))
  - [ ] Implement missing actions
- [ ] Camera (inspired by [pixi-viewport](https://github.com/davidfig/pixi-viewport))
  - [x] Bounds
  - [x] Lerp
  - [ ] Parallax
  - [ ] Effects
- [ ] Physics engine ⚒️
  - [ ] Wrapper of [box2d-wasm](https://github.com/Birch-san/box2d-wasm) ⚒️
  - [ ] Wrapper of [planck.js](https://github.com/shakiba/planck.js/) ❓
- [ ] Refactoring & code cleanup
- [ ] Separate ChibiEngine common API and Pixi implementation
- [ ] Documentation
  - [ ] API Reference
  - [ ] Guide
- [ ] Simple animations (scaling, rotation, translation, tinting of elements)
  - [ ] JSON Animation format (defines skins, skin parts and animations)
  - [ ] Frame-by-frame element integration
  - [ ] Mesh transformation 🔮
  - [ ] Animation editor 🔮
- [ ] Tilemap
- [ ] Masks
- [ ] Meshes
- [ ] Dynamic node loading (prefab) ❓
- [ ] Atlas generation tool CLI (for optimization) ❓
- [ ] 3D support with [babylon.js](https://github.com/BabylonJS/Babylon.js) or [three.js](https://github.com/mrdoob/three.js) 🔮
- [ ] Native Desktop/Android/iOS version with [cocos2d-x](https://github.com/cocos2d/cocos2d-x) 🔮

⚒️ Work in progress...

🔮 Non-essential feature that will arrive in the distant future

❓ Potentially irrelevant feature

----

Chibiland - http://chibi.land/  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  • &nbsp;&nbsp;&nbsp;&nbsp;Feavy 2023 - https://feavy.fr/
