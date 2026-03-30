# TalantyMG — Marketplace Freelance Madagascar

> **Plateforme avancée avec architecture 3 couches : Next.js + Node.js + Spring Boot + PostgreSQL**

## Architecture

```
Frontend (Next.js :3000)
        ↓  JWT Middleware
API Middleware (Node.js :3001)  ← Logique métier, validation, agrégation
        ↓  JWT Spring Security
API Backend (Spring Boot :8080) ← Couche données, JPA
        ↓
PostgreSQL (:5432)
```

## Démarrage rapide

```bash
# Cloner le projet
git clone https://github.com/VOTRE_COMPTE/talanty-mg.git
cd talanty-mg

# Lancer tout avec Docker
docker-compose up --build

# L'app est accessible sur http://localhost:3000
```

## Développement local (sans Docker)

### Backend Spring Boot
```bash
cd backend-api
# Configurer PostgreSQL localement d'abord
./mvnw spring-boot:run
```

### Middleware Node.js
```bash
cd middleware-api
cp .env.example .env
npm install
npm run dev
```

### Frontend Next.js
```bash
cd frontend
npm install
npm run dev
```

## Technologies

| Couche | Technologie | Port |
|---|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS | 3000 |
| API Middleware | Node.js + Express + JWT | 3001 |
| API Backend | Spring Boot 3 + Spring Security | 8080 |
| Base de données | PostgreSQL 16 | 5432 |
| Containerisation | Docker + Docker Compose | — |

## Sécurité (Double couche)

1. **API Node.js** : JWT propre + Rate Limiting + Helmet + Validation
2. **API Spring Boot** : Spring Security + JWT + CORS restrictif

## Équipe

Projet réalisé à l'**ESMIA Madagascar** — Méthode Agile (Scrum)

Voir [docs/rapport-agile-sprint1.md](docs/rapport-agile-sprint1.md) pour le rapport Agile.
