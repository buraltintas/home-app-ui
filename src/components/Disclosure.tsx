'use client';

import {useId,useState} from 'react';
import type {ReactNode} from 'react';

type Props={
  children:ReactNode;
  className:string;
  headingId?:string;
  summary:ReactNode;
};

// A controlled disclosure keeps the content in the document while its grid row changes
// between zero and its intrinsic height. This makes opening and closing equally smooth in
// every supported browser without sacrificing button semantics or keyboard operation.
export function Disclosure({children,className,headingId,summary}:Props){
  const [open,setOpen]=useState(false);
  const contentId=useId();
  const control=<button
    type="button"
    className="disclosure-summary"
    aria-expanded={open}
    aria-controls={contentId}
    onClick={()=>setOpen(value=>!value)}
  >
    <span className="disclosure-summary-copy">{summary}</span>
    <span className="disclosure-caret" aria-hidden="true"/>
  </button>;

  return <div className={`${className} disclosure${open?' is-open':''}`}>
    {headingId?<h2 id={headingId} className="disclosure-heading">{control}</h2>:control}
    <div id={contentId} className="disclosure-reveal" aria-hidden={!open} inert={!open}>
      <div className="disclosure-reveal-inner">{children}</div>
    </div>
  </div>;
}
