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
import Link from 'next/link';
import {Fragment} from 'react';

// Two marks, both written into the string for the same reason: which word carries the
// emphasis, and which word is the one being offered, are facts about the sentence. Square
// brackets colour a phrase. Braces fill a word -- the heading's verb, drawn as the thing it
// stands for -- without making it a control. It is not one: the field below it is.
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

// The same convention, one sentence lower: a word in brackets, and here it is the word that
// goes somewhere. Written into the string for the reason the emphasis is -- which word names
// the destination is a fact about the sentence, and it is not the same word, or in the same
// place, in four languages.
export function sentenceWithLink(text:string,href:string,className='inline-link'){
  const found=text.match(/\[([^\]]+)\]/);
  if(!found)return <>{lines(text)}</>;
  const [before,after]=text.split(found[0]);
  return <>{lines(before)}<Link href={href} className={className}>{found[1]}</Link>{lines(after)}</>;
}

export function emphasisedTitle(title:string,className='favorites-title-mark'){
  const parts=[];
  let last=0;
  let key=0;
  for(const found of title.matchAll(MARKED)){
    const at=found.index??0;
    if(at>last)parts.push(<Fragment key={key++}>{lines(title.slice(last,at))}</Fragment>);
    if(found[1]!==undefined)parts.push(<span key={key++} className={className}>{lines(found[1])}</span>);
    else parts.push(<span key={key++} className="title-chip">{found[2]}</span>);
    last=at+found[0].length;
  }
  if(last<title.length)parts.push(<Fragment key={key++}>{lines(title.slice(last))}</Fragment>);
  return <>{parts}</>;
}
