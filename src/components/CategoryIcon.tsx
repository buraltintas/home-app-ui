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

// Thirteen of the sixteen categories have a picture of their own -- the set that was drawn
// for this product, one per category, a thing rather than a symbol. The three without one
// (decoration, tableware, storage) keep the line icon they had; a picture invented for them
// would be a different set, and a mixed set is worse than a mixed medium.
const pictures=new Set(['bedding','furniture','home_textile','kitchenware','curtain','carpet','bathroom','lighting','home_accessories','small_appliances','major_appliances','household','garden']);

// Whether a category has a drawing of its own. Thirteen do; decoration, tableware and
// storage are still on line icons, and a caller that wants to show the drawing large needs
// to know which it is going to get before it reserves the room.
export function hasCategoryPicture(slug:string){return pictures.has(slug);}

export function CategoryIcon({slug}:{slug:string}){
  if(pictures.has(slug))return <span className="category-icon is-picture" aria-hidden="true">
    <Image src={`/categories/${slug}.png`} width={96} height={96} alt=""/>
  </span>;
  const Icon=icons[slug]??House;
  return <span className="category-icon" aria-hidden="true"><Icon strokeWidth={1.8}/></span>;
}
