'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { STATUS_CONFIG, type Booking } from '@/lib/api';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiBriefcase, FiPackage, FiLogOut, FiPlus, FiRefreshCw } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/dashboard');
      setDashboard(res.data);
    } catch (err) {
      toast.error('Erreur de chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  const stats = dashboard?.stats || {};
  const recentBookings: Booking[] = dashboard?.recentClientBookings || [];
  const receivedBookings: Booking[] = dashboard?.recentReceivedBookings || [];

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status });
      toast.success(status === 'CONFIRMED' ? 'Réservation confirmée !' : status === 'COMPLETED' ? 'Marqué comme terminé !' : 'Annulé');
      loadDashboard();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bonjour, <span className="gradient-text">{user.fullName}</span> 👋
              </h1>
              <p className="text-white/50 mt-1">
                <span className={`badge ${user.role === 'PROVIDER' ? 'bg-gold-500/20 text-gold-400' : 'bg-primary-500/20 text-primary-400'}`}>
                  {user.role === 'PROVIDER' ? '💼 Freelance' : '🛒 Client'}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              {user.role === 'PROVIDER' && (
                <Link href="/services/create" className="btn-gold flex items-center gap-2 text-sm">
                  <FiPlus size={16} /> Nouveau service
                </Link>
              )}
              <button onClick={loadDashboard} className="btn-secondary flex items-center gap-2 text-sm">
                <FiRefreshCw size={16} /> Actualiser
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Mes réservations', value: stats.totalClientBookings ?? 0, icon: FiPackage, color: 'text-primary-400' },
              { label: 'En attente', value: stats.pending ?? 0, icon: FiRefreshCw, color: 'text-yellow-400' },
              { label: 'Confirmées', value: stats.confirmed ?? 0, icon: FiBriefcase, color: 'text-blue-400' },
              { label: 'Terminées', value: stats.completed ?? 0, icon: FiBriefcase, color: 'text-green-400' },
            ].map(stat => (
              <div key={stat.label} className="card p-5">
                <div className={`${stat.color} mb-2`}><stat.icon size={22} /></div>
                <div className="text-3xl font-bold text-white">{loading ? '—' : stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            {['overview', ...(user.role === 'PROVIDER' ? ['received'] : [])].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px ${
                  activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-white/50 hover:text-white'
                }`}>
                {tab === 'overview' ? '📋 Mes réservations' : '📨 Reçues'}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'overview' ? recentBookings : receivedBookings).length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Aucune réservation</h3>
                  <p className="text-white/50 mb-6">
                    {activeTab === 'overview'
                      ? 'Vous n\'avez pas encore de réservations.'
                      : 'Aucune commande reçue pour l\'instant.'}
                  </p>
                  <Link href="/services" className="btn-primary inline-flex">Voir les services</Link>
                </div>
              ) : (
                (activeTab === 'overview' ? recentBookings : receivedBookings).map((booking) => {
                  const statusCfg = STATUS_CONFIG[booking.status];
                  return (
                    <div key={booking.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{booking.service?.title}</h3>
                        <p className="text-sm text-white/50 mt-0.5">
                          {new Date(booking.createdAt).toLocaleDateString('fr-MG', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                        {activeTab === 'received' && booking.client && (
                          <p className="text-sm text-white/60 mt-1">Client : <span className="text-white">{booking.client.fullName}</span></p>
                        )}
                        {booking.clientNote && (
                          <p className="text-sm text-white/40 mt-2 italic">"{booking.clientNote}"</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`badge ${statusCfg?.color}`}>{statusCfg?.label}</span>
                        <span className="text-gold-400 font-bold">
                          {new Intl.NumberFormat('fr-MG').format(booking.service?.price)} MGA
                        </span>
                        {/* Boutons d'action — côté PROVIDER onglet Reçues */}
                        {activeTab === 'received' && (
                          <div className="flex gap-2">
                            {booking.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                  className="px-3 py-1.5 text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                                >
                                  Confirmer
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                  className="px-3 py-1.5 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  Refuser
                                </button>
                              </>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                                className="px-3 py-1.5 text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                              >
                                Terminer
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
