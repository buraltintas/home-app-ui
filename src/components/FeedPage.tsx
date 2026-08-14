'use client';
import {feedPost} from '@/lib/fixtures';import {useI18n} from '@/i18n/I18nProvider';import {PostCard} from './PostCard';
export function FeedPage(){const {t}=useI18n();return <main className="feed-layout"><section className="feed-main"><header className="feed-intro"><p className="eyebrow">{t('wordmark')} · {t('home')}</p><h1>{t('feedTitle')}</h1><p>{t('feedIntro')}</p></header><PostCard post={feedPost}/></section><aside className="feed-aside"><p className="eyebrow">Discover, visit, share</p><blockquote>“Before I spend time going there, I can finally see what this physical home store is really like.”</blockquote><div className="aside-rule"/><span>İstanbul · Berlin · Antalya</span></aside></main>}

