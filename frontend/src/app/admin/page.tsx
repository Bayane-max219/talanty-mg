'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { ServiceOffer, User, STATUS_CONFIG } from '@/lib/api';
import { getUser } from '@/lib/auth';

interface AdminStats {
  totalServices: number;
  activeServices: number;
  totalUsers?: number;
}

export default function AdminPage() {
  const router = useRouter();
  const currentUser = getUser();

  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalServices: 0, activeServices: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) { router.push('/auth/login'); return; }
    if (currentUser.role !== 'ADMIN') { router.push('/dashboard'); return; }

    api.get('/api/services')
      .then(res => {
        const list: ServiceOffer[] = Array.isArray(res.data) ? res.data :
          (res.data?.content || res.data?.data || []);
        setServices(list);
        setStats({
          totalServices: list.length,
          activeServices: list.filter((s: ServiceOffer) => s.isActive).length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser, router]);

  const handleToggleService = async (serviceId: number, isActive: boolean) => {
    try {
      await api.put(`/api/services/${serviceId}`, { isActive: !isActive });
      setServices(prev => prev.map(s =>
        s.id === serviceId ? { ...s, isActive: !isActive } : s
      ));
      setStats(prev => ({
        ...prev,
        activeServices: isActive ? prev.activeServices - 1 : prev.activeServices + 1,
      }));
    } catch {
      alert('Erreur lors de la mise à jour');
    }
  };

  if (!currentUser || currentUser.role !== 'ADMIN') return null;

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.provider.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Catégories stats
  const categoryCount = services.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🛡</span>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-white/40">Gestion de la plateforme TalantyMG</p>
          </div>
          <span className="badge bg-red-500/20 text-red-400">Administrateur</span>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">Services total</span>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalServices}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">Services actifs</span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{stats.activeServices}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">Services inactifs</span>
              <span className="text-2xl">⏸</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{stats.totalServices - stats.activeServices}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">Catégories</span>
              <span className="text-2xl">🏷</span>
            </div>
            <p className="text-3xl font-bold text-primary-400">{Object.keys(categoryCount).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-800/50 rounded-xl p-1 mb-6 w-fit">
          {([['overview', 'Vue d\'ensemble'], ['services', 'Services']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-primary-600 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'overview' ? (

          /* Overview */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Top catégories */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Top catégories</h2>
              {topCategories.length === 0 ? (
                <p className="text-white/40 text-sm">Aucune donnée</p>
              ) : (
                <div className="space-y-3">
                  {topCategories.map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">{cat.replace(/_/g, ' ')}</span>
                          <span className="text-white/40">{count}</span>
                        </div>
                        <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 rounded-full"
                            style={{ width: `${(count / stats.totalServices) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Services récents */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Services récents</h2>
              {services.length === 0 ? (
                <p className="text-white/40 text-sm">Aucun service</p>
              ) : (
                <div className="space-y-3">
                  {services.slice(0, 5).map(service => (
                    <div key={service.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {service.imageUrl
                          ? <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                          : <span className="text-lg">🔧</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{service.title}</p>
                        <p className="text-xs text-white/40">{service.provider.fullName}</p>
                      </div>
                      <span className={`badge text-xs ${service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {service.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card p-6 md:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-5">Actions rapides</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/services" className="flex flex-col items-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl transition-colors">
                  <span className="text-2xl">🔍</span>
                  <span className="text-sm text-white/70">Voir les services</span>
                </Link>
                <Link href="/dashboard" className="flex flex-col items-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl transition-colors">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm text-white/70">Dashboard</span>
                </Link>
                <button
                  onClick={() => setActiveTab('services')}
                  className="flex flex-col items-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl transition-colors"
                >
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm text-white/70">Gérer services</span>
                </button>
                <Link href="/" className="flex flex-col items-center gap-2 p-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl transition-colors">
                  <span className="text-2xl">🏠</span>
                  <span className="text-sm text-white/70">Accueil</span>
                </Link>
              </div>
            </div>

          </div>
        ) : (

          /* Services management */
          <div>
            <div className="flex items-center gap-3 mb-5">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre ou freelancer..."
                className="input-field max-w-sm"
              />
              <span className="text-white/40 text-sm">{filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}</span>
            </div>

            {filteredServices.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-white/50">Aucun service trouvé</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredServices.map(service => (
                  <div key={service.id} className="card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-600 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {service.imageUrl
                        ? <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                        : <span className="text-xl">🔧</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{service.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-white/40 text-sm">{service.provider.fullName}</span>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-white/40 text-sm">{service.price.toLocaleString('fr-MG')} MGA</span>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-gold-400 text-xs">★ {service.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/services/${service.id}`} className="px-3 py-1.5 text-xs btn-secondary">
                        Voir
                      </Link>
                      <button
                        onClick={() => handleToggleService(service.id, service.isActive)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          service.isActive
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        {service.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
