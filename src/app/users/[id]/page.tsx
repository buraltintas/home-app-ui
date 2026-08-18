import type {Metadata} from 'next';
import {PostCard} from '@/components/PostCard';
import {getServerI18n} from '@/i18n/server';
import {getProfile,getUserPosts} from '@/lib/server-api';

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params;
  const profile=await getProfile(id);
  return {title:`${profile.display_name} (@${profile.username})`,description:profile.bio||undefined};
}

// Every visitor used to land on the same invented person. This reads the profile whose
// id is in the URL, and shows the reviews that person actually wrote.
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const {t,locale}=await getServerI18n();
  const [profile,posts]=await Promise.all([getProfile(id),getUserPosts(id)]);
  return <main className="profile-page">
    <header className="public-profile">
      <div className="profile-avatar">{profile.display_name.slice(0,1).toLocaleUpperCase(locale)}</div>
      <div>
        <p className="eyebrow">@{profile.username}</p>
        <h1>{profile.display_name}</h1>
        {profile.bio&&<p>{profile.bio}</p>}
        {profile.city&&<span>{profile.city}</span>}
      </div>
      <dl>
        <div><dt>{t.followers}</dt><dd>{profile.follower_count}</dd></div>
        <div><dt>{t.following}</dt><dd>{profile.following_count}</dd></div>
        <div><dt>{t.profileReviews}</dt><dd>{profile.post_count}</dd></div>
      </dl>
    </header>
    <section className="profile-feed">
      {posts.length===0?<p>{t.noReviewsBody}</p>:posts.map(post=><PostCard key={post.id} post={post}/>)}
    </section>
  </main>;
}
