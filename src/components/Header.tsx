'use client';
import Link from 'next/link'; import {Heart,Home,Plus,Search,UserRound} from 'lucide-react'; import {useI18n} from '@/i18n/I18nProvider';
export function Header(){const {t}=useI18n();return <header className="site-header"><div className="nav-wrap"><Link href="/" className="wordmark">{t('wordmark')}</Link><nav aria-label="Primary"><Link href="/"><Home/><span>{t('home')}</span></Link><Link href="/discover"><Search/><span>{t('discover')}</span></Link><Link href="/favorites"><Heart/><span>{t('favorites')}</span></Link><Link href="/profile"><UserRound/><span>{t('profile')}</span></Link></nav><Link href="/create" className="create-link"><Plus/>{t('create')}</Link></div></header>}

