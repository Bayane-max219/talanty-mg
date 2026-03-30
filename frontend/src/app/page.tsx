import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiArrowRight, FiStar, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { CATEGORIES } from '@/lib/api';

export default function HomePage() {
  const stats = [
    { label: 'Freelances actifs', value: '500+' },
    { label: 'Services disponibles', value: '1200+' },
    { label: 'Clients satisfaits', value: '800+' },
    { label: 'Projets réalisés', value: '2000+' },
  ];

  const features = [
    {
      icon: <FiShield className="text-primary-400" size={24} />,
      title: 'Sécurisé et fiable',
      desc: 'Double couche de sécurité avec Spring Security et JWT. Vos données sont protégées.',
    },
    {
      icon: <FiStar className="text-gold-400" size={24} />,
      title: 'Freelances vérifiés',
      desc: 'Tous les prestataires sont évalués par la communauté. Trouvez le meilleur talent.',
    },
    {
      icon: <FiTrendingUp className="text-green-400" size={24} />,
      title: 'Croissez votre activité',
      desc: 'Développez votre présence en ligne et trouvez des clients à Antananarivo et dans tout Madagascar.',
    },
    {
      icon: <FiUsers className="text-purple-400" size={24} />,
      title: 'Communauté locale',
      desc: 'Rejoignez la communauté des professionnels malgaches. Collaborez, apprenez, grandissez.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 badge bg-primary-600/20 text-primary-300 border border-primary-500/30 mb-6 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Plateforme #1 à Madagascar
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Trouvez les meilleurs{' '}
            <span className="gradient-text">talents</span>{' '}
            de Madagascar
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            TalantyMG connecte les clients avec les meilleurs freelances d&apos;Antananarivo.
            Développeurs, designers, rédacteurs — tous vos besoins en un seul endroit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services" className="btn-primary flex items-center gap-2 text-base">
              Explorer les services
              <FiArrowRight />
            </Link>
            <Link href="/auth/register" className="btn-gold flex items-center gap-2 text-base">
              Devenir freelance
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5">
                <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Explorez par catégorie</h2>
            <p className="text-white/50">Trouvez exactement ce dont vous avez besoin</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/services?category=${cat.value}`}
                className="card p-4 text-center group cursor-pointer"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Pourquoi choisir TalantyMG ?</h2>
            <p className="text-white/50">La plateforme conçue pour les professionnels malgaches</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-primary-500/20">
            <h2 className="section-title mb-4">
              Prêt à rejoindre la communauté ?
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Inscrivez-vous gratuitement et commencez à travailler ou à trouver des clients dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn-primary flex items-center gap-2">
                Créer un compte gratuit <FiArrowRight />
              </Link>
              <Link href="/services" className="btn-secondary">
                Voir les services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
