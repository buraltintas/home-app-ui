// A heading written as one string per language, with the phrase that carries the emphasis
// in brackets.
//
// It is one string rather than two because the emphasised phrase is not in the same place
// in every language -- it ends the Turkish sentence and opens the English one -- and a rule
// about position would have been right in one and wrong in the rest. Everything that needs
// the words without the decoration strips the brackets; only the heading that is looked at
// draws them.
//
// This lives here rather than beside one page because a second page wanted the same
// treatment, and the second copy of a rule is the one that drifts.
const EMPHASIS=/\[([^\]]+)\]/;

export function plainTitle(title:string){return title.replace(/[[\]]/g,'');}

export function emphasisedTitle(title:string,className='favorites-title-mark'){
  const found=title.match(EMPHASIS);
  if(!found)return title;
  const [before,after]=title.split(found[0]);
  return <>{before}<span className={className}>{found[1]}</span>{after}</>;
}
