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

export function CategoryIcon({slug}:{slug:string}){
  const Icon=icons[slug]??House;
  return <span className="category-icon" aria-hidden="true"><Icon strokeWidth={1.8}/></span>;
}
