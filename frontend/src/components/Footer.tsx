import Link from 'next/link';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-800/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center font-bold text-white text-lg">
                T
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Talanty</span>
                <span className="text-white/70">MG</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              La première marketplace freelance de Madagascar. Connectez-vous avec les meilleurs talents d&apos;Antananarivo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white/80 mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">S&apos;inscrire</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Connexion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/80 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2"><FiMail size={14} /> contact@talantymg.mg</li>
              <li>Antananarivo, Madagascar</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} TalantyMG — Fait avec ❤️ à Antananarivo
          </p>
          <div className="flex items-center gap-4 text-white/30">
            <Link href="https://github.com" className="hover:text-white transition-colors"><FiGithub size={18} /></Link>
            <Link href="https://linkedin.com" className="hover:text-white transition-colors"><FiLinkedin size={18} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
