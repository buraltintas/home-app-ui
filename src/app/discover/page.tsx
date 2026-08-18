import type {Metadata} from 'next';import {cookies} from 'next/headers';import {SearchExperience} from '@/components/SearchExperience';import type {Locale} from '@/lib/types';
const titles:Record<Locale,string>={tr:'Keşfet',en:'Discover',de:'Entdecken',ru:'Поиск магазинов'};
export async function generateMetadata():Promise<Metadata>{const value=(await cookies()).get('bosagezme_locale')?.value;const locale=(['tr','en','de','ru'].includes(value??'')?value:'tr') as Locale;return {title:titles[locale]};}
export default function Page(){return <SearchExperience/>}
