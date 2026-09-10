// The three navigation shapes, drawn here rather than taken from the icon library.
//
// The destination you are on fills its shape with the accent, and the house has to keep
// its doorway open while it does. The library draws the house as two paths with the door
// first, so filling both paints the house straight over the door -- there is no ordering a
// stylesheet can apply to fix that. Owning the markup is what makes "fill the house, not
// the door" expressible: the solid layer is a single path holding both outlines with
// `evenodd`, so the door is a hole in the fill rather than a shape drawn under it.
//
// Each icon is one element in two states. The solid layer is unfilled until the link is
// current; the outline is always drawn, so the shape reads the same either way.

const frame={viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'} as const;

const HOUSE='M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z';
const DOOR='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8';
const HEART='M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5';

export function NavHome(){
  return <svg {...frame} aria-hidden="true">
    <path className="nav-icon-solid" fillRule="evenodd" d={`${HOUSE} ${DOOR}`}/>
    <path d={HOUSE}/>
    <path d={DOOR}/>
  </svg>;
}

export function NavSearch(){
  return <svg {...frame} aria-hidden="true">
    <circle className="nav-icon-solid" cx="11" cy="11" r="8"/>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.34-4.34"/>
  </svg>;
}

export function NavFavorites(){
  return <svg {...frame} aria-hidden="true">
    <path className="nav-icon-solid" d={HEART}/>
    <path d={HEART}/>
  </svg>;
}
