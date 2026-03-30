import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'TalantyMG — Marketplace Freelance Madagascar',
  description: 'Trouvez les meilleurs freelances à Madagascar. Développeurs, designers, rédacteurs, traducteurs et bien plus.',
  keywords: 'freelance, Madagascar, Antananarivo, développeur, designer, services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a3e',
              color: '#fff',
              border: '1px solid rgba(99,102,241,0.3)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
