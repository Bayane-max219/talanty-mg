'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { CATEGORIES } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function CreateServicePage() {
  const router = useRouter();
  const user = getUser();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryDays: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image trop grande (max 2MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setForm(f => ({ ...f, imageUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'PROVIDER') { router.push('/dashboard'); }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.category || !form.price) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/services', {
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        deliveryDays: form.deliveryDays ? parseInt(form.deliveryDays) : undefined,
        imageUrl: form.imageUrl || undefined,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'PROVIDER') return null;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm flex items-center gap-2 mb-4 transition-colors">
            ← Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Créer un service</h1>
          <p className="text-white/50 mt-2">Proposez votre expertise aux clients malgaches</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Titre */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-3">
              Informations de base
            </h2>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Titre du service <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="ex: Création de site web professionnel"
                className="input-field"
                maxLength={100}
              />
              <p className="text-white/30 text-xs mt-1">{form.title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Décrivez votre service en détail : ce que vous faites, votre expérience, ce que le client recevra..."
                rows={6}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Catégorie <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="input-field"
              >
                <option value="">Choisir une catégorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prix et délai */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-3">
              Tarification
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Prix (MGA) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="50000"
                    min="0"
                    className="input-field pr-14"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">MGA</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Délai de livraison (jours)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.deliveryDays}
                    onChange={e => setForm(f => ({ ...f, deliveryDays: e.target.value }))}
                    placeholder="7"
                    min="1"
                    max="90"
                    className="input-field pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">j</span>
                </div>
              </div>
            </div>

            {form.price && (
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
                <p className="text-primary-400 text-sm">
                  💡 Votre service sera affiché à <strong>{parseFloat(form.price || '0').toLocaleString('fr-MG')} MGA</strong>
                </p>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-3">
              Image (optionnel)
            </h2>

            {/* Upload depuis PC */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Uploader une image depuis votre PC
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-3xl mb-2">📁</span>
                  <p className="text-sm text-white/50">
                    <span className="text-primary-400 font-semibold">Cliquez pour choisir</span> une image
                  </p>
                  <p className="text-xs text-white/30 mt-1">PNG, JPG, JPEG — max 2MB</p>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Aperçu image uploadée */}
            {imagePreview && (
              <div className="relative">
                <div className="rounded-xl overflow-hidden aspect-video bg-dark-700">
                  <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setForm(f => ({ ...f, imageUrl: '' })); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {!imagePreview && (
              <p className="text-white/30 text-xs">Sans image, l&apos;icône de la catégorie sera utilisée</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/dashboard" className="btn-secondary flex-1 text-center">
              Annuler
            </Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publication...
                </span>
              ) : 'Publier le service'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
