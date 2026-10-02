import {notFound} from 'next/navigation';
import {ProfileExperience} from '@/components/ProfileExperience';
import {HomeQuestions} from '@/components/HomeQuestions';
import {asLocale} from '@/lib/site';

const SECTIONS=['edit','reviews','messages','account','help'] as const;
type Section=(typeof SECTIONS)[number];

export default async function Page({params}:{params:Promise<{locale:string;section:string}>}){
  const {locale,section}=await params;
  if(!SECTIONS.includes(section as Section))notFound();
  // R66: the help page is the home page's own questions and answers, not a second copy of
  // them. They are rendered here, on the server, and handed to the page ready-made, so the
  // text of the about page is not shipped to the browser a second time inside the profile.
  // The profile is out of the index (see the layout), so the same answers on two addresses
  // cost the home page nothing.
  return <ProfileExperience section={section as Section} help={section==='help'?<HomeQuestions locale={asLocale(locale)}/>:undefined}/>;
}
