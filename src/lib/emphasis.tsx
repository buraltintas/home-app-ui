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
import {ChevronDown} from 'lucide-react';
import {Fragment} from 'react';

// Two marks, both written into the string for the same reason: which word carries the
// emphasis, and which word is the one being offered, are facts about the sentence. Square
// brackets colour a phrase. Braces turn a word into the shape of a control -- filled, with
// the arrow that means "there is a list under this" -- without making it one. It is the
// heading's verb; pressing it is what the field below is for.
const MARKED=/\[([^\]]+)\]|\{([^}]+)\}/g;

export function plainTitle(title:string){return title.replace(/[[\]{}]/g,'').replace(/\n/g,' ');}

// A newline in the string is a line break in the heading. It is written into the string
// rather than produced by narrowing a column, because where a heading should break is a
// fact about the sentence and differs per language: Turkish wants "Sana uygun / Mağazaları
// / bul", and the same three lines forced on the English one would break it mid-phrase.
function lines(text:string){
  const parts=text.split('\n');
  return parts.map((part,index)=>index===0?part:<Fragment key={index}><br/>{part}</Fragment>);
}

export function emphasisedTitle(title:string,className='favorites-title-mark'){
  const parts=[];
  let last=0;
  let key=0;
  for(const found of title.matchAll(MARKED)){
    const at=found.index??0;
    if(at>last)parts.push(<Fragment key={key++}>{lines(title.slice(last,at))}</Fragment>);
    if(found[1]!==undefined)parts.push(<span key={key++} className={className}>{lines(found[1])}</span>);
    else parts.push(<span key={key++} className="title-chip">{found[2]}<ChevronDown aria-hidden="true"/></span>);
    last=at+found[0].length;
  }
  if(last<title.length)parts.push(<Fragment key={key++}>{lines(title.slice(last))}</Fragment>);
  return <>{parts}</>;
}
