#!/bin/bash
# =============================================================================
# TalantyMG — Script de données de démonstration
# Créé 2 comptes PROVIDER et 1 compte CLIENT avec 10 services
# Usage : bash scripts/seed-data.sh
# =============================================================================

BASE_URL="http://localhost:3001"
PASS="Demo1234!"

echo "======================================"
echo "  TalantyMG — Seed données de démo"
echo "======================================"
echo ""

# Vérifier que l'API est disponible
echo "⏳ Vérification que l'API est disponible..."
for i in {1..10}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" 2>/dev/null)
  if [ "$STATUS" = "200" ]; then
    echo "✅ API disponible"
    break
  fi
  echo "   Attente... ($i/10)"
  sleep 3
done

if [ "$STATUS" != "200" ]; then
  echo "❌ L'API n'est pas disponible. Assurez-vous que docker-compose up est lancé."
  exit 1
fi

echo ""

# =============================================================================
# CRÉER LES COMPTES
# =============================================================================

echo "👤 Création des comptes..."

# Provider 1
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Rakoto Dev\",\"email\":\"rakoto.dev@talanty.mg\",\"password\":\"$PASS\",\"role\":\"PROVIDER\"}" \
  > /dev/null
echo "   ✅ PROVIDER: rakoto.dev@talanty.mg"

# Provider 2
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Fara Design\",\"email\":\"fara.design@talanty.mg\",\"password\":\"$PASS\",\"role\":\"PROVIDER\"}" \
  > /dev/null
echo "   ✅ PROVIDER: fara.design@talanty.mg"

# Client
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Client Test\",\"email\":\"client.test@talanty.mg\",\"password\":\"$PASS\",\"role\":\"CLIENT\"}" \
  > /dev/null
echo "   ✅ CLIENT: client.test@talanty.mg"

echo ""

# =============================================================================
# LOGIN PROVIDER 1 — Obtenir le token
# =============================================================================

echo "🔑 Login Provider 1..."
TOKEN1=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"rakoto.dev@talanty.mg\",\"password\":\"$PASS\"}" \
  | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

if [ -z "$TOKEN1" ]; then
  echo "❌ Login Provider 1 échoué. Vérifiez que le compte a bien été créé."
else
  echo "   ✅ Token obtenu"
fi

# =============================================================================
# CRÉER LES SERVICES — Provider 1 (Développement / Formation)
# =============================================================================

echo ""
echo "🛠️  Création des services Provider 1..."

# Service 1
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{
    "title": "Site web professionnel React/Next.js",
    "description": "Création complète de votre site web avec React ou Next.js. Design moderne, responsive, optimisé SEO. Livraison avec code source complet et déploiement inclus.",
    "category": "DEVELOPPEMENT_WEB",
    "price": 450000,
    "deliveryDays": 14
  }' > /dev/null
echo "   ✅ Site web React/Next.js"

# Service 2
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{
    "title": "Application mobile Android (Flutter)",
    "description": "Développement application mobile Android avec Flutter. Interface moderne, navigation fluide, intégration API REST. Déployable sur Play Store.",
    "category": "DEVELOPPEMENT_WEB",
    "price": 800000,
    "deliveryDays": 30
  }' > /dev/null
echo "   ✅ Application mobile Flutter"

# Service 3
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{
    "title": "API REST Spring Boot + PostgreSQL",
    "description": "Développement API REST complète avec Spring Boot, Spring Security JWT, JPA/Hibernate et PostgreSQL. Documentation Swagger incluse.",
    "category": "DEVELOPPEMENT_WEB",
    "price": 600000,
    "deliveryDays": 21
  }' > /dev/null
echo "   ✅ API REST Spring Boot"

# Service 4
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{
    "title": "Maintenance et correction de bugs",
    "description": "Analyse et correction de bugs sur votre application web ou mobile. Rapport détaillé des problèmes trouvés et des solutions appliquées.",
    "category": "DEVELOPPEMENT_WEB",
    "price": 150000,
    "deliveryDays": 3
  }' > /dev/null
echo "   ✅ Maintenance & correction bugs"

# Service 5
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{
    "title": "Formation initiation programmation web",
    "description": "Formation personnalisée pour débutants : HTML, CSS, JavaScript, bases React. Sessions en ligne ou présentiel à Antananarivo. Support pédagogique inclus.",
    "category": "FORMATION",
    "price": 200000,
    "deliveryDays": 7
  }' > /dev/null
echo "   ✅ Formation programmation web"

# =============================================================================
# LOGIN PROVIDER 2
# =============================================================================

echo ""
echo "🔑 Login Provider 2..."
TOKEN2=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"fara.design@talanty.mg\",\"password\":\"$PASS\"}" \
  | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

if [ -z "$TOKEN2" ]; then
  echo "❌ Login Provider 2 échoué."
else
  echo "   ✅ Token obtenu"
fi

# =============================================================================
# CRÉER LES SERVICES — Provider 2 (Design / Marketing / Photo)
# =============================================================================

echo ""
echo "🎨 Création des services Provider 2..."

# Service 6
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "title": "Logo et identité visuelle professionnelle",
    "description": "Création de logo unique et charte graphique complète pour votre entreprise. Formats vectoriels (SVG, PDF, PNG) fournis. Jusqu'\''à 3 propositions.",
    "category": "DESIGN_GRAPHIQUE",
    "price": 120000,
    "deliveryDays": 5
  }' > /dev/null
echo "   ✅ Logo et identité visuelle"

# Service 7
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "title": "Rédaction de contenu web et blog",
    "description": "Rédaction d'\''articles de blog, pages de vente, descriptions produits optimisés SEO. Contenu en français ou malgache, adapté à votre audience.",
    "category": "REDACTION",
    "price": 50000,
    "deliveryDays": 2
  }' > /dev/null
echo "   ✅ Rédaction contenu web"

# Service 8
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "title": "Gestion réseaux sociaux (1 mois)",
    "description": "Gestion complète de vos réseaux sociaux pendant 1 mois : Facebook, Instagram, LinkedIn. Création de contenu, planification, engagement communauté.",
    "category": "MARKETING_DIGITAL",
    "price": 180000,
    "deliveryDays": 30
  }' > /dev/null
echo "   ✅ Gestion réseaux sociaux"

# Service 9
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "title": "Séance photo professionnelle entreprise",
    "description": "Séance photo professionnelle pour votre entreprise ou événement à Antananarivo. Retouches incluses. Livraison 20+ photos HD en 48h.",
    "category": "PHOTOGRAPHIE",
    "price": 250000,
    "deliveryDays": 2
  }' > /dev/null
echo "   ✅ Séance photo professionnelle"

# Service 10
curl -s -X POST "$BASE_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "title": "Traduction français - malgache",
    "description": "Traduction professionnelle de documents, sites web ou applications du français vers le malgache et vice versa. Traducteur natif bilingue certifié.",
    "category": "TRADUCTION",
    "price": 30000,
    "deliveryDays": 1
  }' > /dev/null
echo "   ✅ Traduction français-malgache"

echo ""
echo "======================================"
echo "  ✅ Seed terminé avec succès !"
echo "======================================"
echo ""
echo "Comptes créés :"
echo "  PROVIDER → rakoto.dev@talanty.mg / $PASS"
echo "  PROVIDER → fara.design@talanty.mg / $PASS"
echo "  CLIENT   → client.test@talanty.mg / $PASS"
echo ""
echo "10 services disponibles sur http://localhost:3000/services"
echo ""
