import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

// Injecter le token automatiquement
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gérer les erreurs d'auth
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Types ──────────────────────────────────────────────────────────────────────
export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

export interface ServiceOffer {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  deliveryDays?: number;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  provider: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface Booking {
  id: number;
  service: ServiceOffer;
  client: User;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  clientNote?: string;
  providerNote?: string;
  createdAt: string;
}

export const CATEGORIES = [
  { value: 'DEVELOPPEMENT_WEB', label: 'Développement Web', icon: '💻' },
  { value: 'DESIGN_GRAPHIQUE', label: 'Design Graphique', icon: '🎨' },
  { value: 'REDACTION', label: 'Rédaction', icon: '✍️' },
  { value: 'MARKETING_DIGITAL', label: 'Marketing Digital', icon: '📊' },
  { value: 'TRADUCTION', label: 'Traduction', icon: '🌍' },
  { value: 'COMPTABILITE', label: 'Comptabilité', icon: '🧮' },
  { value: 'PHOTOGRAPHIE', label: 'Photographie', icon: '📸' },
  { value: 'VIDEO', label: 'Vidéo', icon: '🎬' },
  { value: 'FORMATION', label: 'Formation', icon: '📚' },
  { value: 'AUTRE', label: 'Autre', icon: '🔧' },
];

export const STATUS_CONFIG = {
  PENDING:     { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400' },
  CONFIRMED:   { label: 'Confirmé',   color: 'bg-blue-500/20 text-blue-400' },
  IN_PROGRESS: { label: 'En cours',   color: 'bg-purple-500/20 text-purple-400' },
  COMPLETED:   { label: 'Terminé',    color: 'bg-green-500/20 text-green-400' },
  CANCELLED:   { label: 'Annulé',     color: 'bg-red-500/20 text-red-400' },
};
