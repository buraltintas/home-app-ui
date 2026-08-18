import type {Metadata} from 'next';import {PostCard} from '@/components/PostCard';import {feedPost} from '@/lib/fixtures';import {getServerI18n} from '@/i18n/server';
export async function generateMetadata():Promise<Metadata>{const {t}=await getServerI18n();return {title:t.verified,description:feedPost.text}}
export default async function Page(){const {t}=await getServerI18n();return <main className="public-narrow"><PostCard post={feedPost}/><section className="comments-section"><p className="eyebrow">{t.comments}</p><h2>3 {t.communityComments}</h2><p>{t.commentsBody}</p></section></main>}
