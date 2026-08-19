import Link from 'next/link';
import type {Block,LegalDoc} from '@/content/legal/types';
import {legalDocumentsArePublishable} from '@/lib/legal-facts';
import {localePath} from '@/lib/site';
import type {Locale} from '@/lib/types';

const pendingNotice:Record<Locale,{title:string;body:string}>={
  tr:{title:'Bu belge hukuki incelemeyi bekliyor',body:'Bu metin ürünün gerçekte nasıl çalıştığını anlatır, ancak veri sorumlusunun kimliği ve iletişim bilgileri henüz tamamlanmadığı için yürürlükte değildir. Tamamlanana kadar bağlayıcı bir belge olarak değerlendirilmemelidir.'},
  en:{title:'This document is awaiting legal review',body:'The text below describes how the product actually works, but it is not in force: the identity and contact details of the data controller are not yet complete. Until they are, it should not be treated as a binding document.'},
  de:{title:'Dieses Dokument wartet auf die rechtliche Prüfung',body:'Der folgende Text beschreibt, wie das Produkt tatsächlich funktioniert, ist aber nicht in Kraft: Identität und Kontaktdaten des Verantwortlichen sind noch nicht vollständig. Bis dahin ist es nicht als bindendes Dokument zu verstehen.'},
  ru:{title:'Документ ожидает юридической проверки',body:'Текст ниже описывает, как продукт работает в действительности, но не имеет силы: личность и контактные данные оператора данных пока не указаны. До этого момента документ не следует считать обязывающим.'},
};

const meta:Record<Locale,{version:string;effective:string;updated:string;contents:string;related:string}>={
  tr:{version:'Sürüm',effective:'Yürürlük',updated:'Son güncelleme',contents:'İçindekiler',related:'İlgili belgeler'},
  en:{version:'Version',effective:'Effective',updated:'Last updated',contents:'Contents',related:'Related documents'},
  de:{version:'Version',effective:'Gültig ab',updated:'Zuletzt aktualisiert',contents:'Inhalt',related:'Verwandte Dokumente'},
  ru:{version:'Версия',effective:'Вступает в силу',updated:'Обновлено',contents:'Содержание',related:'Связанные документы'},
};

function renderBlock(block:Block,index:number){
  if('p' in block)return <p key={index}>{block.p}</p>;
  if('h3' in block)return <h3 key={index}>{block.h3}</h3>;
  if('ul' in block)return <ul key={index}>{block.ul.map((item,i)=><li key={i}>{item}</li>)}</ul>;
  if('note' in block)return <p key={index} className="legal-note">{block.note}</p>;
  return <div key={index} className="legal-table-wrap"><table>
    <thead><tr>{block.table.head.map((cell,i)=><th key={i} scope="col">{cell}</th>)}</tr></thead>
    <tbody>{block.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}

export function LegalDocument({doc,locale,related=[]}:{doc:LegalDoc;locale:Locale;related?:{href:string;label:string}[]}){
  const content=doc.content[locale];
  const copy=meta[locale];
  const pending=doc.requiresEntity&&!legalDocumentsArePublishable;
  return <main className="legal-page">
    <article>
      <header className="legal-header">
        <h1>{content.title}</h1>
        <p className="legal-summary">{content.summary}</p>
        <dl className="legal-meta">
          <div><dt>{copy.version}</dt><dd>{doc.version}</dd></div>
          <div><dt>{copy.effective}</dt><dd><time dateTime={doc.effective}>{doc.effective}</time></dd></div>
          <div><dt>{copy.updated}</dt><dd><time dateTime={doc.updated}>{doc.updated}</time></dd></div>
        </dl>
      </header>

      {pending&&<aside className="legal-pending" role="note">
        <strong>{pendingNotice[locale].title}</strong>
        <p>{pendingNotice[locale].body}</p>
      </aside>}

      {content.sections.length>1&&<nav className="legal-toc" aria-label={copy.contents}>
        <h2>{copy.contents}</h2>
        <ol>{content.sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol>
      </nav>}

      {content.sections.map(section=><section key={section.id} id={section.id} className="legal-section">
        <h2>{section.heading}</h2>
        {section.blocks.map(renderBlock)}
      </section>)}

      {related.length>0&&<nav className="legal-related" aria-label={copy.related}>
        <h2>{copy.related}</h2>
        <ul>{related.map(entry=><li key={entry.href}><Link href={localePath(locale,entry.href)}>{entry.label}</Link></li>)}</ul>
      </nav>}
    </article>
  </main>;
}
