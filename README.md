# 🎭 Chrono Arbitre - Match d'Improvisation

Application de chronomètre pour arbitres de matchs d'improvisation théâtrale.

## 🎯 Fonctionnalités

- **Catégories prédéfinies** : Longue (6min), Moyenne (4min), Courte (2min), Caucus (20s)
- **Temps personnalisé** : Définissez votre propre durée
- **Contrôles intuitifs** : Démarrer, Pause, Reset
- **⏱️ Ajustement en direct** : Ajoutez ou retirez 1 minute pendant l'impro
- **📳 Alertes vibrantes pour signes de main** : Vibrations aux moments clés (3min, 2min, 1min, 30s, 10s, 5s)
- **🔒 Pas de mise en veille** : L'écran reste allumé pendant le chrono (Wake Lock API)
- **Barre de progression visuelle** : Visualisation du temps restant
- **Notifications visuelles** : Rappels à l'écran pour les signes de main
- **Historique** : Sauvegarde automatique des 10 derniers chronos
- **Design responsive** : Fonctionne sur mobile, tablette et ordinateur
- **Thème sombre** : Interface adaptée pour une utilisation en salle

## 🚀 Installation

### Option 1 : Utilisation directe
1. Ouvrez simplement le fichier `index.html` dans votre navigateur

### Option 2 : Serveur local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si vous avez http-server installé)
npx http-server
```

Puis ouvrez http://localhost:8000 dans votre navigateur

## 📱 Utilisation

1. **Sélectionnez une catégorie** : Cliquez sur l'un des boutons de catégorie ou choisissez "Personnalisé"
2. **Démarrez le chrono** : Cliquez sur "▶ Démarrer"
3. **Gérez le temps** : Utilisez "⏸ Pause" pour mettre en pause, "⟲ Reset" pour réinitialiser
4. **Recevez les alertes** : Votre appareil vibrera aux moments clés pour vous rappeler de faire les signes de main :
   - **3 minutes** : 🖐️ 3 doigts
   - **2 minutes** : ✌️ 2 doigts
   - **1 minute** : ☝️ 1 doigt
   - **30 secondes** : Signe spécial
   - **10 secondes** : Dernière alerte
   - **5 secondes** : Alerte finale
5. **Pas de mise en veille** : L'écran reste allumé automatiquement pendant le chrono
6. **Consultez l'historique** : Tous vos chronos sont automatiquement sauvegardés

## 🎨 Catégories d'improvisation

- **Longue (6 minutes)** : Pour les improvisations longues et développées
- **Moyenne (4 minutes)** : Durée standard pour la plupart des impros
- **Courte (2 minutes)** : Impro rapide et dynamique
- **Caucus (20 secondes)** : Temps de concertation entre joueurs
- **Personnalisé** : Définissez votre propre durée

## 💾 Sauvegarde

L'historique des chronos est automatiquement sauvegardé dans le navigateur (localStorage).
Les données persistent même après fermeture du navigateur.

## 📳 Vibrations & Wake Lock

### Vibrations
L'application utilise l'API Vibration pour vous alerter aux moments clés :
- Patterns de vibration différents selon le temps restant
- Permet de faire les signes de main sans regarder l'écran
- Peut être désactivé via l'option dédiée

### Wake Lock (Pas de veille)
- L'écran reste allumé pendant qu'un chrono est actif
- Utilise l'API Screen Wake Lock
- Se désactive automatiquement à la fin du chrono ou en pause

## 📱 Compatibilité

- ✅ Chrome / Edge
- ✅ Firefox
- ✅ Safari
- ✅ Navigateurs mobiles (iOS & Android)

## 🛠️ Technologies

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript Vanilla (ES6+)
- Vibration API (alertes haptiques)
- Screen Wake Lock API (empêcher la mise en veille)
- LocalStorage API (sauvegarde de l'historique)

## � Installation (PWA)

L'application est une Progressive Web App (PWA) installable :

### Sur mobile (Android/iOS) :
1. Ouvrez l'application dans votre navigateur
2. Recherchez l'option "Ajouter à l'écran d'accueil" ou "Installer l'application"
3. L'icône apparaîtra sur votre écran d'accueil
4. L'app fonctionnera même hors ligne !

### Sur ordinateur (Chrome/Edge) :
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur le bouton d'installation dans la barre d'adresse (icône +)
3. Ou cliquez sur le bouton "📱 Installer l'application" en bas de page
4. L'app sera accessible depuis votre menu des applications

### Mode hors ligne
- Tous les fichiers sont mis en cache automatiquement
- L'application fonctionne sans connexion Internet
- Les données sont sauvegardées localement

## �📄 Licence

Projet libre d'utilisation pour la communauté d'improvisation théâtrale.

## 🎪 Pour la communauté impro

Créé avec ❤️ pour les arbitres et passionnés d'improvisation théâtrale !

---

**Bon match d'impro ! 🎭🎪**
