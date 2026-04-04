# TalantyMG — Marketplace Freelance Madagascar

> **Plateforme de mise en relation entre freelances (PROVIDER) et clients (CLIENT)**
> Architecture 3 couches : Next.js 14 + Node.js Express + Spring Boot 3 + PostgreSQL 16

---

## Architecture globale

```
┌─────────────────────────────────────────────────────────┐
│  NAVIGATEUR (http://localhost:3000)                      │
│  Frontend Next.js 14 — TypeScript + Tailwind CSS        │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP + JWT (Bearer token)
                       ▼
┌─────────────────────────────────────────────────────────┐
│  API Middleware Node.js (http://localhost:3001)          │
│  Express + JWT validation + Rate Limiting + Helmet      │
│  → Relaie les requêtes vers Spring Boot                  │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP + JWT Spring (interne Docker)
                       ▼
┌─────────────────────────────────────────────────────────┐
│  API Backend Spring Boot (http://localhost:8080)         │
│  Spring Security + JPA/Hibernate + JWT                   │
│  → Logique métier, accès base de données                 │
└──────────────────────┬──────────────────────────────────┘
                       │  JDBC / PostgreSQL Driver
                       ▼
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL 16 (localhost:5432)                          │
│  Base : talanty_db — Tables : users, service_offers,    │
│  bookings, reviews                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Prérequis

- **Docker Desktop** installé et en cours d'exécution
- Aucun autre prérequis (npm, Java, etc. ne sont PAS nécessaires)
- Ports libres : 3000, 3001, 8080, 5432

---

## Lancement du projet (première fois)

```bash
# 1. Cloner le dépôt
git clone https://github.com/Bayane-max219/talanty-mg.git
cd talanty-mg

# 2. Lancer tous les containers (build + démarrage)
docker-compose up --build

# Attendre que les 4 containers soient "healthy" (~2 minutes)
# ✅ talanty-postgres     — Base de données prête
# ✅ talanty-backend      — Spring Boot démarré (port 8080)
# ✅ talanty-middleware   — Node.js démarré (port 3001)
# ✅ talanty-frontend     — Next.js démarré (port 3000)

# 3. Ouvrir dans le navigateur
# http://localhost:3000
```

### Relancer le projet (fois suivantes)

```bash
cd talanty-mg
docker-compose up
```

---

## Peupler la base de données (données de démo)

Après le premier lancement, exécuter le script de seed pour créer des comptes et des services de démonstration :

**Sur Windows (Git Bash ou PowerShell) :**
```bash
bash scripts/seed-data.sh
```

**Ou manuellement via le navigateur :**
1. Aller sur http://localhost:3000/auth/register
2. Créer un compte PROVIDER (Freelance)
3. Aller sur http://localhost:3000/services/create pour ajouter des services
4. Créer un compte CLIENT et réserver des services

---

## Comptes de démonstration (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| PROVIDER | rakoto.dev@talanty.mg | Demo1234! |
| PROVIDER | fara.design@talanty.mg | Demo1234! |
| CLIENT | client.test@talanty.mg | Demo1234! |

---

## Rebuild après modification du code

```bash
# Modifier le code Java (backend) → rebuild backend
docker-compose build backend-api && docker-compose up -d --force-recreate backend-api

# Modifier le code Next.js (frontend) → rebuild frontend
docker-compose build frontend && docker-compose up -d --force-recreate frontend

# Modifier le code Node.js (middleware) → rebuild middleware
docker-compose build middleware-api && docker-compose up -d --force-recreate middleware-api

# Rebuild complet sans cache (si problème)
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## Réinitialiser la base de données

> ⚠️ **ATTENTION** : Ceci supprime TOUTES les données

```bash
docker-compose down -v
docker-compose up --build
```

---

## Endpoints API

### Middleware (port 3001) — À utiliser depuis le frontend

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /api/auth/register | Non | Créer un compte |
| POST | /api/auth/login | Non | Se connecter |
| GET | /api/services | Non | Liste des services |
| GET | /api/services/:id | Non | Détail d'un service |
| POST | /api/services | PROVIDER | Créer un service |
| PUT | /api/services/:id | PROVIDER | Modifier un service |
| DELETE | /api/services/:id | PROVIDER | Supprimer un service |
| GET | /api/services/my/list | PROVIDER | Mes services |
| POST | /api/bookings | CLIENT | Réserver un service |
| GET | /api/bookings/my | Oui | Mes réservations |
| GET | /api/bookings/provider | PROVIDER | Réservations reçues |
| PUT | /api/bookings/:id/status | PROVIDER | Changer statut |
| GET | /api/dashboard | Oui | Données dashboard |

### Statuts de réservation

```
PENDING → CONFIRMED → COMPLETED
         ↓
      CANCELLED
```

---

## Technologies utilisées

| Couche | Technologies | Version |
|--------|-------------|---------|
| Frontend | Next.js, TypeScript, Tailwind CSS, React Hot Toast, React Icons | Next.js 14 |
| Middleware | Node.js, Express, JWT, Helmet, express-rate-limit, express-validator | Node.js 20 |
| Backend | Spring Boot, Spring Security, JPA/Hibernate, Lombok, Jackson | Spring Boot 3 |
| Base de données | PostgreSQL | 16 |
| Containerisation | Docker, Docker Compose | — |

---

## Structure du projet

```
talanty-mg/
├── frontend/                    # Application Next.js
│   └── src/
│       ├── app/                 # Pages (App Router)
│       │   ├── page.tsx         # Page d'accueil
│       │   ├── auth/            # Login + Register
│       │   ├── services/        # Liste, détail, création
│       │   ├── dashboard/       # Tableau de bord
│       │   └── profile/         # Profil utilisateur
│       ├── components/          # Composants réutilisables
│       └── lib/                 # api.ts, auth.ts
├── middleware-api/              # API Node.js Express
│   └── src/
│       ├── app.js               # Point d'entrée
│       ├── routes/              # Définition des routes
│       ├── controllers/         # Logique des endpoints
│       ├── middleware/          # Auth JWT, validation
│       └── services/            # Client HTTP vers Spring Boot
├── backend-api/                 # API Spring Boot
│   └── src/main/java/mg/talanty/
│       ├── model/               # Entités JPA (User, ServiceOffer, Booking)
│       ├── controller/          # Endpoints REST
│       ├── service/             # Logique métier
│       ├── repository/          # Accès base de données (JPA)
│       ├── security/            # JWT + Spring Security
│       └── dto/                 # Objets de transfert de données
├── scripts/
│   └── seed-data.sh             # Script de données de démo
├── docs/
│   └── ARCHITECTURE.html        # Documentation technique complète
├── docker-compose.yml           # Configuration Docker
└── README.md
```

---

## Sécurité (Double couche JWT)

```
Client → [JWT Middleware Token] → Node.js vérifie
       → [JWT Spring Token]    → Spring Boot vérifie
```

Deux tokens JWT distincts :
1. **Token Middleware** (`middlewareTalantyMG2024Secret!`) — Signé par Node.js pour le frontend
2. **Token Spring** (`talantyMGsecretKey2024SuperSecure@Madagascar!`) — Signé par Spring Boot pour Node.js

---

## Équipe

Projet réalisé à l'**ESMIA Madagascar** — Méthode Agile (Scrum)

- **Bayane** (Bayane-max219)
- **James Maillard** (JamesMaillard)
