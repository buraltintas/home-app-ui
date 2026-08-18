import type {Metadata} from 'next';
import {PostCard} from '@/components/PostCard';
import {CommentThread} from '@/components/CommentThread';
import {getComments,getPost} from '@/lib/server-api';

// This page used to ignore its own id and render a sample review, so every photo in the
// feed led to the same fictional store. It now shows the review that was tapped.
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params;
  const post=await getPost(id);
  return {title:`${post.store_name} · ${post.display_name}`,description:post.text.slice(0,160)};
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const [post,comments]=await Promise.all([getPost(id),getComments(id)]);
  return <main className="public-narrow">
    <PostCard post={post}/>
    <CommentThread postId={post.id} comments={comments}/>
  </main>;
}
