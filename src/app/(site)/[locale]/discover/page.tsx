import type {Metadata} from 'next';import {SearchExperience} from '@/components/SearchExperience';import {getServerI18n} from '@/i18n/server';import {canonicalFor,shareImage} from '@/lib/site';import type {Locale} from '@/lib/types';
const titles:Record<Locale,string>={tr:'Keşfet',en:'Discover',de:'Entdecken',ru:'Поиск магазинов'};
export async function generateMetadata():Promise<Metadata>{const {locale}=await getServerI18n();return {title:titles[locale],alternates:canonicalFor(locale,'/discover'),openGraph:{url:'/discover',title:titles[locale],images:[shareImage]}};}
export default function Page(){return <SearchExperience/>}
