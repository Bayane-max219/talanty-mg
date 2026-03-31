'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { ServiceOffer, Booking, STATUS_CONFIG } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const user = getUser();

  const [myServices, setMyServices] = useState<ServiceOffer[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('services');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }

    const fetches: Promise<void>[] = [
      api.get('/api/bookings/my')
        .then(res => setMyBookings(Array.isArray(res.data) ? res.data : []))
        .catch(() => {}),
    ];

    if (user.role === 'PROVIDER') {
      fetches.push(
        api.get('/api/services/my/list')
          .then(res => setMyServices(Array.isArray(res.data) ? res.data : []))
          .catch(() => {})
      );
    }

    Promise.all(fetches).finally(() => setLoading(false));
  }, [user, router]);

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await api.delete(`/api/services/${serviceId}`);
      setMyServices(prev => prev.filter(s => s.id !== serviceId));
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Profile header */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-3xl font-bold text-white border-2 border-primary-500/40">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
              <p className="text-white/50">{user.email}</p>
              <span className={`badge mt-2 ${
                user.role === 'PROVIDER'
                  ? 'bg-gold-500/20 text-gold-400'
                  : user.role === 'ADMIN'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-primary-500/20 text-primary-400'
              }`}>
                {user.role === 'PROVIDER' ? '⭐ Freelancer' : user.role === 'ADMIN' ? '🛡 Admin' : '👤 Client'}
              </span>
            </div>
            {user.role === 'PROVIDER' && (
              <Link href="/services/create" className="btn-primary hidden sm:inline-flex items-center gap-2">
                + Nouveau service
              </Link>
            )}
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-white">{myBookings.length}</p>
            <p className="text-white/40 text-sm">Réservations</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {myBookings.filter(b => b.status === 'COMPLETED').length}
            </p>
            <p className="text-white/40 text-sm">Terminées</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {myBookings.filter(b => b.status === 'PENDING').length}
            </p>
            <p className="text-white/40 text-sm">En attente</p>
          </div>
          {user.role === 'PROVIDER' && (
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-gold-400">{myServices.length}</p>
              <p className="text-white/40 text-sm">Services</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        {user.role === 'PROVIDER' && (
          <div className="flex gap-1 bg-dark-800/50 rounded-xl p-1 mb-6 w-fit">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-primary-600 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Mes services
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bookings'
                  ? 'bg-primary-600 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Mes réservations
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (

          /* Services tab */
          activeTab === 'services' && user.role === 'PROVIDER' ? (
            <div>
              {myServices.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-4xl mb-4">📦</p>
                  <p className="text-white/50 mb-4">Vous n&apos;avez pas encore de service</p>
                  <Link href="/services/create" className="btn-primary">Créer mon premier service</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myServices.map(service => (
                    <div key={service.id} className="card p-5 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-dark-600 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {service.imageUrl
                          ? <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                          : <span className="text-2xl">🔧</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{service.title}</p>
                        <p className="text-white/40 text-sm">{service.price.toLocaleString('fr-MG')} MGA</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gold-400 text-xs">★ {service.averageRating.toFixed(1)}</span>
                          <span className="text-white/30 text-xs">({service.totalReviews} avis)</span>
                          {service.isActive
                            ? <span className="badge bg-green-500/20 text-green-400 text-xs">Actif</span>
                            : <span className="badge bg-red-500/20 text-red-400 text-xs">Inactif</span>
                          }
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/services/${service.id}`} className="btn-secondary py-2 px-3 text-sm">
                          Voir
                        </Link>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors"
                        >
                          Suppr.
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (

            /* Bookings tab */
            <div>
              {myBookings.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-4xl mb-4">📋</p>
                  <p className="text-white/50 mb-4">Aucune réservation pour l&apos;instant</p>
                  <Link href="/services" className="btn-primary">Explorer les services</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map(booking => {
                    const cfg = STATUS_CONFIG[booking.status];
                    return (
                      <div key={booking.id} className="card p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link href={`/services/${booking.service.id}`} className="font-semibold text-white hover:text-primary-400 transition-colors truncate block">
                              {booking.service.title}
                            </Link>
                            <p className="text-white/40 text-sm mt-0.5">
                              {booking.service.price.toLocaleString('fr-MG')} MGA • {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                            {booking.clientNote && (
                              <p className="text-white/50 text-sm mt-2 italic">"{booking.clientNote}"</p>
                            )}
                          </div>
                          <span className={`badge flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </main>
  );
}
