import {notFound} from 'next/navigation';
import {ProfileExperience} from '@/components/ProfileExperience';

export default async function Page({params}:{params:Promise<{section:string}>}){
  const {section}=await params;
  if(section!=='edit'&&section!=='reviews'&&section!=='messages'&&section!=='account')notFound();
  return <ProfileExperience section={section}/>;
}
