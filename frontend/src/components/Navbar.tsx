'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/api';
import { FiBriefcase, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
              T
            </div>
            <span className="font-bold text-xl">
              <span className="gradient-text">Talanty</span>
              <span className="text-white/70">MG</span>
            </span>
          </Link>

          {/* Nav Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-white/70 hover:text-white transition-colors font-medium">
              Services
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-1.5">
                  <FiUser size={16} />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary flex items-center gap-2 text-sm">
                  <FiLogOut size={16} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors font-medium">
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass rounded-2xl mb-4 p-4 flex flex-col gap-3 animate-fade-in">
            <Link href="/services" className="text-white/80 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Services</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-white/80 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/10">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-white/80 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link href="/auth/register" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>Commencer gratuitement</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
