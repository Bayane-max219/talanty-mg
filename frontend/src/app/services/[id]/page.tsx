'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { ServiceOffer, CATEGORIES, STATUS_CONFIG } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = getUser();

  const [service, setService] = useState<ServiceOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [note, setNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    api.get(`/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(() => router.push('/services'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleBook = async () => {
    if (!user) { router.push('/auth/login'); return; }
    setBooking(true);
    setError('');
    try {
      await api.post('/api/bookings', { serviceId: Number(id), clientNote: note });
      setBooked(true);
      setShowModal(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; error?: string } } };
      setError(e.response?.data?.error || e.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setBooking(false);
    }
  };

  const category = CATEGORIES.find(c => c.value === service?.category);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!service) return null;

  const isOwner = user?.userId === service.provider.id;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white/70 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white/70 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-white/70">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Service info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-dark-700 aspect-video relative">
              {service.imageUrl && !imgError ? (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">{category?.icon || '🔧'}</span>
                </div>
              )}
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="badge bg-primary-600/90 text-white text-xs">
                  {category?.icon} {category?.label || service.category}
                </span>
              </div>
            </div>

            {/* Title + rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{service.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={`text-lg ${i <= Math.round(service.averageRating) ? 'text-gold-400' : 'text-white/20'}`}>★</span>
                  ))}
                  <span className="text-white font-semibold ml-1">{service.averageRating.toFixed(1)}</span>
                  <span className="text-white/40 text-sm">({service.totalReviews} avis)</span>
                </div>
                {service.deliveryDays && (
                  <span className="flex items-center gap-1 text-white/50 text-sm">
                    <span>⏱</span> Livraison {service.deliveryDays}j
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Description du service</h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {/* Provider info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">À propos du freelancer</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-xl font-bold text-primary-400">
                  {service.provider.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{service.provider.fullName}</p>
                  <p className="text-white/40 text-sm">{service.provider.email}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT — Booking card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-sm">Prix</p>
                  <p className="text-3xl font-bold text-white">
                    {service.price.toLocaleString('fr-MG')}
                    <span className="text-base font-normal text-white/40 ml-1">MGA</span>
                  </p>
                </div>
                {service.deliveryDays && (
                  <span className="text-white/50 text-sm">/ {service.deliveryDays} jour{service.deliveryDays > 1 ? 's' : ''}</span>
                )}
              </div>

              {booked ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-400 font-semibold">✓ Réservation envoyée !</p>
                  <p className="text-white/50 text-sm mt-1">Le freelancer va vous contacter</p>
                  <Link href="/dashboard" className="text-primary-400 text-sm hover:underline mt-2 inline-block">
                    Voir mes réservations →
                  </Link>
                </div>
              ) : isOwner ? (
                <div className="bg-dark-600/50 rounded-xl p-4 text-center text-white/40 text-sm">
                  Vous ne pouvez pas réserver votre propre service
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={() => { if (!user) router.push('/auth/login'); else setShowModal(true); }}
                    className="btn-primary w-full text-center"
                  >
                    {user ? 'Réserver ce service' : 'Connectez-vous pour réserver'}
                  </button>
                </>
              )}

              <div className="border-t border-white/5 pt-4 space-y-2 text-sm text-white/40">
                <div className="flex justify-between">
                  <span>Catégorie</span>
                  <span className="text-white/70">{category?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Publié le</span>
                  <span className="text-white/70">
                    {service.createdAt
                      ? new Date(service.createdAt).toLocaleDateString('fr-FR')
                      : 'Récemment'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-5">
            <h3 className="text-xl font-bold text-white">Confirmer la réservation</h3>
            <div className="bg-dark-700/60 rounded-xl p-4">
              <p className="font-medium text-white">{service.title}</p>
              <p className="text-primary-400 font-semibold mt-1">{service.price.toLocaleString('fr-MG')} MGA</p>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Message au freelancer (optionnel)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Décrivez votre besoin..."
                rows={3}
                className="input-field resize-none"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={handleBook} disabled={booking} className="btn-primary flex-1">
                {booking ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
