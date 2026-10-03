import type {ReactNode} from 'react';

// What a button shows while the thing it started is still running.
//
// It used to be a word, and the word was the search page's: confirming a review, naming a
// purchase and sending a comment all said "Aranıyor…". The label now stays where it is,
// unseen, and three dots stand over it. Keeping it means the button keeps its width -- it
// does not jump narrower and back when the dots come and go -- and keeps its accessible
// name; the button itself carries aria-busy. The dots are drawn, not typed, so there is
// no word to translate and no word to get wrong.
export function BusyLabel({busy,children}:{busy:boolean;children:ReactNode}){
  return <span className="busy-label" data-busy={busy||undefined}>
    <span>{children}</span>
    {busy&&<span className="busy-dots" aria-hidden="true"><span/><span/><span/></span>}
  </span>;
}
