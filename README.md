# Chibi Engine (WIP)

L'objectif est de créer un moteur de jeu 2D Web afin de simplifier la création de jeux-vidéo. Il fait office de wrapper par dessus le moteur de rendu [PixiJS](https://github.com/pixijs/pixijs).

## Objectifs
- API moderne, simple à prendre en main. Inspirée de [Flash](https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/package-detail.html) et [Cocos2d-x](https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/). 
- Axé sur la Programmation Orientée Objet de part un système de noeuds extensibles.
- Chargements des assets de manière transparente et dynamique.

## Roadmap

- [x] Système d'évènements
- [x] Chargement des ressources
- [x] Noeuds
- [x] Sprites
- [ ] Positionnement réactif ?
- [ ] Comportements de Noeuds ⚒️
- [ ] Scènes ⚒️
    - [ ] Transitions
- [ ] GameLoop 
- [ ] Caméra (inspirée de [pixi-viewport](https://github.com/davidfig/pixi-viewport))
    - [ ] Parallaxe
    - [ ] Lerp
    - [ ] Contraintes
    - [ ] Effets
- [ ] Tweens et séquences (inspiré de [Cocos2d-x](https://docs.cocos.com/cocos2d-x/manual/en/actions/getting_started.html))
  - [ ] Easing functions ([penner](https://github.com/bcherny/penner) / [phaser](https://github.com/photonstorm/phaser/tree/master/src/math/easing))
- [ ] Moteur d'animation personnalisé
  - [ ] Éditeur d'animations
- [ ] Moteur physique ([planck.js](https://github.com/shakiba/planck.js/))
- [ ] Audio : SFX et Musiques avec gestion du volume
- [ ] Tilemap
- [ ] Filtres PIXI (shaders)
- [ ] Masques
- [ ] Meshes
- [ ] Chargement dynamique de noeud
- [ ] Optimisation par génération d'atlas au runtime
    - [ ] Ou ahead-of-time au compile-time ? Ou avec un CLI ?

⚒️ = Work in progress...

Chibiland - http://chibi.land/

Feavy 2022 - https://feavy.fr/
