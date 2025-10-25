
# Widget Preview Instagram × Notion
Bio 150 éditable + Upload Avatar (Vercel Blob) + Feed 3 colonnes

## Données Notion
- Base "Calendrier éditorial" (DB) avec propriétés :
  - **Fichier final** (Files & media) — image du post
  - **Date de publication** (Date) — tri
- Page "Profil" avec propriétés :
  - **Bio** (Rich text) — bio ≤ 150 chars
  - **Avatar** (URL) — lien public de l'image de profil

## Variables Vercel (Project → Settings → Environment Variables)
- `NOTION_TOKEN` (obligatoire)
- `NOTION_DATABASE_ID` (recommandé)
- `NOTION_BIO_PAGE_ID` (obligatoire pour bio/avatar)
- `PROFILE_NAME` (optionnel)
- `PROFILE_FOLLOWERS` (optionnel)
- `PROFILE_FOLLOWING` (optionnel)
- `BLOB_READ_WRITE_TOKEN` (obligatoire pour l'upload avatar)

## Endpoints
- `GET /api/posts` — lit la DB (Fichier final, Date de publication)
- `GET /api/get_profile` — renvoie { name, initials, followers, following, bio, avatarUrl }
- `POST /api/update_bio` — { bio } → met à jour propriété "Bio"
- `POST /api/upload` — { filename, contentType, base64 } → upload Vercel Blob (public) → { url }
- `POST /api/set_avatar` — { url } → écrit dans propriété "Avatar" de la page profil
- `POST /api/reorder` — (optionnel) réassigne dates selon nouvel ordre

## Activer Vercel Blob (2 min)
1. Sur Vercel, onglet **Storage → Blob** : créer un bucket (si demandé).
2. Aller dans **Settings → Tokens** : créer un **Read-Write Token**.
3. Copier le token dans la variable d'env **BLOB_READ_WRITE_TOKEN**.

## Déploiement
- Via GitHub → *New Project* sur vercel.com
- ou via CLI :
    npx vercel
    npx vercel --prod

## Embed Notion
- Dans ta page → `/embed` → colle l'URL publique du projet.

## Remarques
- L'upload accepte PNG/JPG ≤ 2 Mo.
- Si tu veux redimensionner en 1024×1024 avant upload, ajoute un canvas côté client.
