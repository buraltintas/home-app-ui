import {about} from '@/content/legal/about';
import type {Block} from '@/content/legal/types';
import type {Locale} from '@/lib/types';

// The questions people ask before they trust a place they have not used. They are already
// written, checked and translated on the about page, so they are read from there rather
// than restated here: one wording, four languages, and no second copy to fall out of date.
//
// Native details/summary rather than a scripted accordion. It opens without JavaScript,
// it is keyboard operable and announced correctly on its own, and it has no animation to
// suppress for anybody who asked for less motion.
function renderBlock(block:Block,index:number){
  if('p' in block)return <p key={index}>{block.p}</p>;
  if('ul' in block)return <ul key={index}>{block.ul.map((item,i)=><li key={i}>{item}</li>)}</ul>;
  if('note' in block)return <p key={index} className="legal-note">{block.note}</p>;
  return null;
}

export function HomeQuestions({locale}:{locale:Locale}){
  const content=about.content[locale];
  return <section className="home-questions" aria-labelledby="home-questions-title">
    <h2 id="home-questions-title">{content.title}</h2>
    {content.sections.map(section=>
      <details key={section.id} className="home-question">
        <summary><span>{section.heading}</span></summary>
        <div className="home-question-body">{section.blocks.map(renderBlock)}</div>
      </details>)}
  </section>;
}
