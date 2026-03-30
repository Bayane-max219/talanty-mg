'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import api, { CATEGORIES, type ServiceOffer } from '@/lib/api';
import { FiSearch, FiFilter, FiLoader } from 'react-icons/fi';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), size: '12' };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;

      const res = await api.get('/api/services', { params });
      setServices(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [page, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchServices();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explorer les <span className="gradient-text">services</span>
            </h1>
            <p className="text-white/50 text-lg">
              {services.length > 0 ? `${services.length} services disponibles` : 'Trouvez le talent idéal'}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  className="input-field pl-12"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary px-5">Chercher</button>
            </form>

            <select
              className="input-field md:w-64"
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(0); }}
            >
              <option value="">Toutes les catégories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => { setCategory(''); setPage(0); }}
              className={`badge cursor-pointer transition-all ${
                !category ? 'bg-primary-600 text-white' : 'bg-dark-700 text-white/60 hover:bg-dark-600'
              }`}
            >
              Tous
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); setPage(0); }}
                className={`badge cursor-pointer transition-all ${
                  category === cat.value ? 'bg-primary-600 text-white' : 'bg-dark-700 text-white/60 hover:bg-dark-600'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <FiLoader className="animate-spin text-primary-400" size={40} />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucun service trouvé</h3>
              <p className="text-white/50">Essayez d&apos;autres mots-clés ou catégories</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {services.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        page === i ? 'bg-primary-600 text-white' : 'bg-dark-700 text-white/50 hover:bg-dark-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense>
      <ServicesContent />
    </Suspense>
  );
}
