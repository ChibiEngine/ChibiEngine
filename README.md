# Chibi Engine (WIP)

L'objectif est de créer un moteur de jeu 2D Web afin de simplifier la création de jeux-vidéo.

Il fait office de wrapper par dessus le moteur de rendu [PixiJS](https://github.com/pixijs/pixijs).

## Objectifs
- API moderne, simple à prendre en main. Inspirée de [Flash](https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/package-detail.html) et [Cocos2d-x](https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/). 
- Axé sur la Programmation Orientée Objet de part un système de noeuds extensibles.
- Chargements des assets de manière transparente et dynamique.

## Roadmap

- [x] Système d'évènements
- [x] Chargement des ressources
- [x] Noeuds
- [x] Sprites
- [x] GameLoop
  - [x] Update loop
  - [x] Render loop
- [x] Entity Component System (ECS)
- [ ] Scènes ⚒️
  - [x] Basic implementation
  - [ ] Transitions
- [ ] Implémenter tous [les attributs de transformation](https://pixijs.download/dev/docs/PIXI.Container.html)..
- [ ] Traduction en anglais
- [ ] Documentation
- [ ] Caméra (inspirée de [pixi-viewport](https://github.com/davidfig/pixi-viewport))
    - [ ] Parallaxe
    - [ ] Lerp
    - [ ] Contraintes
    - [ ] Effets
- [x] Tweens et séquences (inspiré de [Cocos2d-x](https://docs.cocos.com/cocos2d-x/manual/en/actions/getting_started.html))
  - [x] Easing functions ([penner](https://github.com/bcherny/penner) / [phaser](https://github.com/photonstorm/phaser/tree/master/src/math/easing))
  - [ ] Implement missing actions
- [ ] Moteur d'animation personnalisé
  - [ ] Animations décrites en JSON
  - [ ] Intégrer des éléments en frame par frame
  - [ ] Éditeur d'animations 🔮
- [ ] Audio : SFX et Musiques avec gestion du volume
- [ ] Moteur physique
    - [ ] Wrapper autour de [planck.js](https://github.com/shakiba/planck.js/)
    - [ ] Wrapper autour de [box2d-wasm](https://github.com/Birch-san/box2d-wasm) 🔮
- [ ] Tilemap
- [ ] Filtres PIXI (shaders)
- [ ] Masques
- [ ] Meshes
- [ ] Chargement dynamique de noeud (prefab) ❓
- [ ] Optimisation par génération d'atlas au runtime 🔮
    - [ ] Ou ahead-of-time au compile-time ? Ou avec un CLI ?
- [ ] Support de la 3D avec [three.js](https://github.com/mrdoob/three.js) 🔮
- [ ] Version native Desktop/Android/iOS avec [cocos2d-x](https://github.com/cocos2d/cocos2d-x) 🔮

⚒️ Work in progress...

🔮 Fonctionnalité non essentielle qui arrivera dans un futur lointain

❓ Fonctionnalité potentiellement non pertinente

## Standby
- [ ] Réactivité générale
    1. Trop d’overhead induit par le mécanisme.
    2. Source de bugs et irrégularités.
        1. Toutes les propriétés sont redéfinies, pareil pour les méthodes.
        2. Utilise des hacks de JS.
    3. Trop compliqué pour les néophytes.

----

Chibiland - http://chibi.land/

Feavy 2022 - https://feavy.fr/