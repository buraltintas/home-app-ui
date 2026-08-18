import type {Metadata} from 'next';
import {PostCard} from '@/components/PostCard';
import {CommentThread} from '@/components/CommentThread';
import {JsonLd} from '@/components/JsonLd';
import {getComments,getPost} from '@/lib/server-api';
import {canonicalFor,reviewPath} from '@/lib/site';
import {reviewPageJsonLd} from '@/lib/structured-data';

// This page used to ignore its own id and render a sample review, so every photo in the
// feed led to the same fictional store. It now shows the review that was tapped.
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params;
  const post=await getPost(id);
  const title=`${post.store_name} · ${post.display_name}`;
  const description=post.text.slice(0,160);
  // Without its own OpenGraph block every shared review previewed as the generic
  // homepage card, inherited from the root layout.
  const image=post.media[0]?`/api/media/${post.media[0].id}`:undefined;
  return {title,description,alternates:canonicalFor(reviewPath(post.id)),
    openGraph:{type:'article',url:reviewPath(post.id),title,description,publishedTime:post.created_at,...(image?{images:[{url:image}]}:{})},
    twitter:{card:image?'summary_large_image':'summary',title,description,...(image?{images:[image]}:{})}};
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const [post,comments]=await Promise.all([getPost(id),getComments(id)]);
  return <main className="public-narrow">
    <JsonLd data={reviewPageJsonLd(post)}/>
    <PostCard post={post}/>
    <CommentThread postId={post.id} comments={comments}/>
  </main>;
}
