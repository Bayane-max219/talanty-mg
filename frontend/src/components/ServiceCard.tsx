'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiStar, FiClock } from 'react-icons/fi';
import type { ServiceOffer } from '@/lib/api';
import { CATEGORIES } from '@/lib/api';

interface Props {
  service: ServiceOffer;
}

export default function ServiceCard({ service }: Props) {
  const category = CATEGORIES.find(c => c.value === service.category);
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/services/${service.id}`} className="card block overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-primary-800/50 to-dark-700 overflow-hidden">
        {service.imageUrl && !imgError ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl opacity-40">
            {category?.icon || '🔧'}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge bg-dark-800/80 text-white/70 backdrop-blur-sm">
            {category?.icon} {category?.label || service.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors mb-2">
          {service.title}
        </h3>

        {/* Provider */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary-600/30 flex items-center justify-center text-xs text-primary-400">
            {service.provider?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm text-white/50 truncate">{service.provider?.fullName}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gold-400">
            <FiStar size={14} className="fill-gold-400" />
            <span className="text-sm font-semibold">{service.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-white/30">({service.totalReviews})</span>
          </div>
          {service.deliveryDays && (
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <FiClock size={12} />
              <span>{service.deliveryDays}j</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline gap-1">
          <span className="text-white/40 text-xs">À partir de</span>
          <span className="text-gold-400 font-bold text-lg">
            {new Intl.NumberFormat('fr-MG').format(service.price)}
          </span>
          <span className="text-white/30 text-xs">MGA</span>
        </div>
      </div>
    </Link>
  );
}
