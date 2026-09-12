'use client';
import {useI18n} from '@/i18n/I18nProvider';
import Image from 'next/image';

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
      {/* The still, and only the still.
          Two drawings of the mascot exist: this one, which is portrait, and the video,
          which is landscape with white either side. They are not two states of one picture
          -- the dog is drawn at a different size and proportion in each -- so whichever box
          they share, the mascot changes size the moment the video takes over, and whatever
          crop hides the video's white margins cuts the still. Three attempts at reconciling
          them failed for that reason, and the request all along was to use the big one. */}
      <Image src="/brand/mascot-magnifier.png" width={168} height={168} alt="" priority className="search-overlay-art"/>

      <p className="search-overlay-title">{copy[locale]}</p>
    </div>
  </div>;
}
