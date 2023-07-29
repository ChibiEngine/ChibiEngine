# SVG (idea)

**Objectif :**

Créer un moteur de rendu WebGL d'images vectorielles comme le proposait Adobe Flash Player.

**Fonctionnalités :**
- Panning et zooming optimisés.
- Qualité conservée au zoom.

**Solutions possibles :**
1. Extraire naïvement tout le code du rendu des images SVG depuis le moteur Chromium et le porter en version standalone WASM.
2. Extraire seulement les bouts code servant au rendu des différents éléments SVG (path, rect, circle...) et les intégrer au moteur.
