import Image from 'next/image';
import {
  Archive,
  Armchair,
  Bath,
  BedDouble,
  Blender,
  CookingPot,
  Flower2,
  Frame,
  House,
  LampCeiling,
  Layers3,
  PanelsTopLeft,
  RectangleHorizontal,
  Refrigerator,
  Sprout,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

const icons:Record<string,LucideIcon>={
  furniture:Armchair,
  home_textile:Layers3,
  lighting:LampCeiling,
  decoration:Frame,
  kitchenware:CookingPot,
  bathroom:Bath,
  carpet:RectangleHorizontal,
  curtain:PanelsTopLeft,
  bedding:BedDouble,
  tableware:Utensils,
  storage:Archive,
  home_accessories:Flower2,
  household:House,
  garden:Sprout,
  major_appliances:Refrigerator,
  small_appliances:Blender,
};

// Thirteen of the sixteen categories have a photograph of their own -- the set shot for this
// product, one per category, a room rather than a symbol. Every file is 720x400 with the
// photograph centred on transparency, so all thirteen render at the same height whatever
// their own width is. The three without one (decoration, tableware, storage) keep the line
// icon they had; a picture invented for them would be a different set, and a mixed set is
// worse than a mixed medium.
const pictures=new Set(['bedding','furniture','home_textile','kitchenware','curtain','carpet','bathroom','lighting','home_accessories','small_appliances','major_appliances','household','garden']);

// Whether a category has a photograph of its own. Thirteen do; decoration, tableware and
// storage are still on line icons, and a caller that wants to show the picture large needs
// to know which it is going to get before it reserves the room.
export function hasCategoryPicture(slug:string){return pictures.has(slug);}

// The drawn shop whose sign carries the category's name. The same thirteen: the set was
// drawn as one, and a category without a sign is one nobody drew rather than one we chose
// to leave out -- so it simply shows nothing rather than borrowing a neighbour's shop.
export function hasCategorySign(slug:string){return pictures.has(slug);}

export function CategoryIcon({slug}:{slug:string}){
  if(pictures.has(slug))return <span className="category-icon is-picture" aria-hidden="true">
    <Image src={`/categories/${slug}.webp`} width={720} height={400} alt="" sizes="88px"/>
  </span>;
  const Icon=icons[slug]??House;
  return <span className="category-icon" aria-hidden="true"><Icon strokeWidth={1.8}/></span>;
}
