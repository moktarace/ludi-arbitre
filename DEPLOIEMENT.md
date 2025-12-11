# 📤 Guide de publication sur GitHub Pages

## Étape 1 : Créer le dépôt sur GitHub

1. Allez sur [GitHub](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"New"** ou **"+"** → **"New repository"**
3. Configurez le dépôt :
   - **Repository name** : `ludi-arbitre` (ou le nom de votre choix)
   - **Description** : `Chronomètre PWA pour arbitres de matchs d'improvisation théâtrale`
   - **Public** ✅ (pour GitHub Pages gratuit)
   - **Ne PAS cocher** : "Initialize with README" (on a déjà nos fichiers)
4. Cliquez sur **"Create repository"**

---

## Étape 2 : Lier votre dépôt local à GitHub

Copiez l'URL de votre nouveau dépôt (elle ressemble à : `https://github.com/VOTRE-USERNAME/ludi-arbitre.git`)

Puis exécutez ces commandes dans PowerShell :

```powershell
cd c:\git_clones\ludi\ludi-arbitre

# Ajouter le dépôt distant
git remote add origin https://github.com/VOTRE-USERNAME/ludi-arbitre.git

# Renommer la branche en main (standard GitHub)
git branch -M main

# Pousser les fichiers vers GitHub
git push -u origin main
```

**Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub !**

---

## Étape 3 : Activer GitHub Pages

1. Allez sur votre dépôt GitHub : `https://github.com/VOTRE-USERNAME/ludi-arbitre`
2. Cliquez sur **"Settings"** (⚙️)
3. Dans le menu de gauche, cliquez sur **"Pages"**
4. Dans **"Build and deployment"** :
   - **Source** : Sélectionnez `Deploy from a branch`
   - **Branch** : Sélectionnez `main` et `/root`
   - Cliquez sur **"Save"**

---

## Étape 4 : Attendre le déploiement

- GitHub va déployer votre site automatiquement (1-2 minutes)
- Vous verrez un message vert : "Your site is live at https://VOTRE-USERNAME.github.io/ludi-arbitre/"
- Cliquez sur le lien pour accéder à votre application !

---

## Étape 5 : Mettre à jour le README avec votre URL

Après le déploiement, mettez à jour `README.md` avec votre vraie URL :

```powershell
# Dans votre fichier README.md, remplacez toutes les occurrences de :
# VOTRE-USERNAME par votre vrai nom d'utilisateur GitHub
```

Puis faites un nouveau commit :

```powershell
cd c:\git_clones\ludi\ludi-arbitre
git add README.md
git commit -m "Update README with GitHub Pages URL"
git push
```

---

## 🎉 C'est terminé !

Votre application est maintenant :
- ✅ Hébergée sur GitHub
- ✅ Accessible publiquement via GitHub Pages
- ✅ Installable comme PWA
- ✅ Disponible hors ligne

### URL de votre application :
**https://VOTRE-USERNAME.github.io/ludi-arbitre/**

---

## 🔄 Pour mettre à jour l'application plus tard

```powershell
cd c:\git_clones\ludi\ludi-arbitre

# Modifier vos fichiers...

git add .
git commit -m "Description de vos modifications"
git push
```

GitHub Pages se mettra à jour automatiquement en 1-2 minutes !

---

## 📱 Partager l'application

Partagez simplement l'URL avec votre troupe d'impro :
- **URL directe** : `https://VOTRE-USERNAME.github.io/ludi-arbitre/`
- Fonctionne sur tous les appareils
- Installable sur mobile et ordinateur
- Aucune inscription requise

---

## 🐛 Résolution de problèmes

### Le site ne s'affiche pas ?
- Attendez 2-3 minutes après l'activation de GitHub Pages
- Vérifiez que la branche est bien `main` et le dossier `/root`
- Videz le cache du navigateur (Ctrl+Shift+R)

### Erreur lors du push ?
```powershell
# Si vous avez des problèmes d'authentification :
git remote set-url origin https://VOTRE-USERNAME@github.com/VOTRE-USERNAME/ludi-arbitre.git
git push
```

### Le Service Worker ne se met pas à jour ?
- Changez le `CACHE_NAME` dans `service-worker.js` (ex: `v1` → `v2`)
- Commitez et poussez les changements

---

**Besoin d'aide ?** Consultez la [documentation GitHub Pages](https://docs.github.com/en/pages)
