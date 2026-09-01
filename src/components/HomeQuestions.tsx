import {about} from '@/content/legal/about';
import {Disclosure} from '@/components/Disclosure';
import type {Block} from '@/content/legal/types';
import type {Locale} from '@/lib/types';

// The questions people ask before they trust a place they have not used. They are already
// written, checked and translated on the about page, so they are read from there rather
// than restated here: one wording, four languages, and no second copy to fall out of date.
//
function renderBlock(block:Block,index:number){
  if('p' in block)return <p key={index}>{block.p}</p>;
  if('h3' in block)return <h3 key={index}>{block.h3}</h3>;
  if('ul' in block)return <ul key={index}>{block.ul.map((item,i)=><li key={i}>{item}</li>)}</ul>;
  if('table' in block)return <div className="home-question-table" key={index}><table>
    <thead><tr>{block.table.head.map((cell,i)=><th key={i} scope="col">{cell}</th>)}</tr></thead>
    <tbody>{block.table.rows.map((row,rowIndex)=><tr key={rowIndex}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
  if('note' in block)return <p key={index} className="legal-note">{block.note}</p>;
  return null;
}

export function HomeQuestions({locale}:{locale:Locale}){
  const content=about.content[locale];
  return <section className="home-questions" aria-labelledby="home-questions-title">
    <Disclosure className="home-question home-question-primary" headingId="home-questions-title" summary={content.title}>
      <div className="home-question-body"><p>{content.summary}</p></div>
    </Disclosure>
    {content.sections.map(section=>
      <Disclosure key={section.id} className="home-question" summary={section.heading}>
        <div className="home-question-body">{section.blocks.map(renderBlock)}</div>
      </Disclosure>)}
  </section>;
}
