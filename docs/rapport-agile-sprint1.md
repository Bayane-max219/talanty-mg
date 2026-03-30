# TalantyMG — Rapport Agile Sprint 1

## Informations générales

| Champ | Valeur |
|---|---|
| **Projet** | TalantyMG — Marketplace Freelance Madagascar |
| **Équipe** | 2 développeurs (binôme) |
| **Méthode** | Scrum (Agile) |
| **Sprint** | Sprint 1 — Mise en place architecture & authentification |
| **Durée** | 1 semaine (Semaine 1 sur 4) |
| **Date** | Semaine du 24 Mars 2026 |

---

## Vision du produit

**TalantyMG** ("Talanty" = Talent en malgache) est une marketplace en ligne qui connecte les freelances malgaches avec les clients à Antananarivo et dans tout Madagascar.

### Problème résolu
- Pas de plateforme locale structurée pour trouver des freelances à Antananarivo
- Les professionnels malgaches manquent de visibilité en ligne
- Les clients ont du mal à trouver des prestataires de confiance

### Valeur commerciale
- Commission sur chaque transaction
- Abonnements premium pour freelances
- Publicité ciblée locale

---

## Architecture technique (3 technologies)

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE MVC - 3 COUCHES             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [COUCHE PRÉSENTATION]    Next.js 14 (Port 3000)           │
│  Frontend React + TypeScript + Tailwind CSS                 │
│                    │                                        │
│                    ▼ HTTP / JWT Middleware                  │
│                                                             │
│  [COUCHE LOGIQUE MÉTIER]  Node.js + Express (Port 3001)    │
│  API 2 — Validation, règles métier, agrégation             │
│  JWT Middleware + Rate Limiting + Helmet                    │
│                    │                                        │
│                    ▼ HTTP / JWT Spring Security             │
│                                                             │
│  [COUCHE DONNÉES]         Spring Boot (Port 8080)          │
│  API 1 — JPA/Hibernate + Spring Security + PostgreSQL      │
│                    │                                        │
│                    ▼                                        │
│            PostgreSQL (Port 5432)                          │
│                                                             │
│  [CONTAINERISATION]       Docker + Docker Compose          │
└─────────────────────────────────────────────────────────────┘
```

### Double Sécurité
- **Couche 1 (API Spring Boot)** : Spring Security + JWT — contrôle d'accès aux données
- **Couche 2 (API Node.js)** : JWT Middleware + Rate Limiting + Helmet — contrôle de la logique métier
- Résultat : Un utilisateur malveillant doit contourner **deux systèmes de sécurité indépendants**

---

## Équipe & Rôles Scrum

| Rôle | Personne | Responsabilités |
|---|---|---|
| **Product Owner** | Membre 1 | Backlog, priorisation, user stories |
| **Scrum Master** | Membre 2 | Facilitation, suppression blocages |
| **Dev Backend** | Membres 1 & 2 | Spring Boot, PostgreSQL |
| **Dev Middleware** | Membres 1 & 2 | Node.js, Express |
| **Dev Frontend** | Membres 1 & 2 | Next.js, UI/UX |

*Note : En binôme, les rôles sont partagés. Dans une équipe de 6, ils seraient séparés.*

---

## Product Backlog

### Épics

| ID | Épic | Priorité |
|---|---|---|
| E1 | Authentification & Sécurité | 🔴 Haute |
| E2 | Gestion des services | 🔴 Haute |
| E3 | Système de réservation | 🟡 Moyenne |
| E4 | Dashboard utilisateur | 🟡 Moyenne |
| E5 | Évaluations & Avis | 🟢 Basse |
| E6 | Déploiement Docker | 🔴 Haute |

### User Stories — Sprint 1

| ID | Story | Points | État |
|---|---|---|---|
| US-01 | En tant qu'utilisateur, je veux m'inscrire en tant que Client ou Freelance | 5 | ✅ Done |
| US-02 | En tant qu'utilisateur, je veux me connecter de façon sécurisée | 3 | ✅ Done |
| US-03 | En tant que visiteur, je veux voir la liste des services disponibles | 3 | ✅ Done |
| US-04 | En tant que Freelance, je veux publier un nouveau service | 5 | ✅ Done |
| US-05 | En tant que Client, je veux réserver un service | 5 | 🔄 En cours |
| US-06 | En tant qu'utilisateur, je veux voir mon tableau de bord | 3 | ✅ Done |
| US-07 | En tant que dev, je veux containeriser l'app avec Docker | 8 | ✅ Done |

**Total Sprint 1 : 32 points story**

---

## Sprint Planning — Sprint 1

### Objectif du Sprint
*Mettre en place l'architecture complète avec les 3 technologies et implémenter l'authentification sécurisée.*

### Daily Standup Format
- **Qu'ai-je fait hier ?**
- **Que vais-je faire aujourd'hui ?**
- **Quels obstacles rencontré-je ?**

---

## Sprint Review — Sprint 1

### Démo réalisée
- [x] Architecture Docker compose fonctionnelle (3 services + PostgreSQL)
- [x] Inscription / Connexion (double JWT)
- [x] Liste des services (pagination, filtres, recherche)
- [x] Publication de service (Freelance uniquement)
- [x] Dashboard utilisateur
- [x] Design professionnel dark theme

### Vélocité Sprint 1 : 24/32 points (75%)

---

## Sprint Retrospective — Sprint 1

| 👍 Ce qui a bien marché | 👎 Ce qui peut s'améliorer | 💡 Actions pour Sprint 2 |
|---|---|---|
| Architecture claire dès le début | Tests unitaires insuffisants | Ajouter tests Jest & JUnit |
| Docker facilite le déploiement | Documentation API manquante | Documenter avec Swagger/OpenAPI |
| Design cohérent et professionnel | Pas de gestion d'images | Intégrer upload d'images |

---

## Planning Sprint 2

| US | Description | Points |
|---|---|---|
| US-08 | Système d'évaluation (1-5 étoiles + commentaire) | 8 |
| US-09 | Notifications en temps réel | 8 |
| US-10 | Upload d'images (services, avatar) | 5 |
| US-11 | Tests unitaires & intégration | 8 |
| US-12 | Documentation API Swagger | 3 |

---

## Définition of Done (DoD)

Un élément du backlog est **DONE** quand :
- [ ] Le code est fonctionnel et testé
- [ ] Les tests unitaires passent
- [ ] Poussé sur GitHub (`git push`)
- [ ] La fonctionnalité est déployable avec `docker-compose up`
- [ ] Code review effectuée par le binôme
- [ ] Aucune régression sur les fonctionnalités existantes

---

## Burndown Chart Sprint 1 (simulé)

```
Points restants
32 |*
28 |  *
24 |    *
20 |      *  *
16 |           *
12 |             *
 8 |               *
 4 |                 *
 0 |___________________*
   L  M  M  J  V  S  D
```

---

## GitHub Commits Strategy

Pour montrer la progression au professeur :
- Commit à chaque User Story complétée
- Format : `feat(US-XX): description courte`
- Push quotidien minimum
- Branches : `main` (stable), `develop` (développement)

### Convention de commits
```
feat(auth): add JWT double security layer
fix(booking): prevent self-service booking
chore(docker): configure PostgreSQL health check
docs(agile): add sprint 1 retrospective
```

---

*Rapport généré — TalantyMG v1.0 — ESMIA Madagascar 2026*
