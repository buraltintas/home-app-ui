import Image from 'next/image';
import {homeBannerCopy} from '@/content/home';
import {getServerI18n} from '@/i18n/server';

export async function HomeDiscoveryBanner(){
  const {locale}=await getServerI18n();
  const copy=homeBannerCopy[locale];
  return <section className="home-discovery-banner" aria-labelledby="home-discovery-banner-title">
    <Image
      className="home-discovery-banner-image"
      src="/brand/home-discovery-banner.webp"
      fill
      sizes="(max-width: 900px) 100vw, 1200px"
      alt=""
    />
    <div className="home-discovery-banner-shade" aria-hidden="true"/>
    <div className="home-discovery-banner-content">
      <h2 id="home-discovery-banner-title">{copy.title}</h2>
      <ol>
        {copy.steps.map(step=><li key={step.title}><strong>{step.title}</strong><span>{step.body}</span></li>)}
      </ol>
    </div>
  </section>;
}
