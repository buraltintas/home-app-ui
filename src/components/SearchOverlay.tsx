'use client';
import {useI18n} from '@/i18n/I18nProvider';
import {MascotArt} from './MascotLoader';

const copy={
  tr:'Mağazalar sıralanıyor…',
  en:'Sorting stores…',
  de:'Geschäfte werden sortiert…',
  ru:'Сортируем магазины…',
} as const;

export function SearchOverlay(){
  const {locale}=useI18n();

  return <div className="search-overlay" role="status" aria-live="polite">
    <div className="search-overlay-card">
      {/* A bare video with a poster is what put Safari's own play button on this screen:
          autoplay is refused in low power mode, and the browser then offers the control
          it thinks the reader wants. A loading indicator you can press is not a loading
          indicator. This draws the still and lets the video take over only once it is
          genuinely running -- the same rule the profile and favourites loaders follow. */}
      <MascotArt className="search-overlay-art"/>

      <p className="search-overlay-title">{copy[locale]}</p>
    </div>
  </div>;
}
