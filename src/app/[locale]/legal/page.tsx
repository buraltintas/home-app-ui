import type {Metadata} from 'next';
import Link from 'next/link';
import {JsonLd} from '@/components/JsonLd';
import {about} from '@/content/legal/about';
import {accountDeletion} from '@/content/legal/account-deletion';
import {locationPrivacy} from '@/content/legal/location-privacy';
import {kvkkAydinlatma} from '@/content/legal/kvkk-aydinlatma';
import {privacy} from '@/content/legal/privacy';
import {terms} from '@/content/legal/terms';
import {childrenPrivacy,commercialCommunications,contact,cookies,kvkkBasvuru,reportContent} from '@/content/legal/trust';
import {getServerI18n} from '@/i18n/server';
import {legalDocumentsArePublishable} from '@/lib/legal-facts';
import {metaDescription} from '@/lib/legal-page';
import {absolute,canonicalFor,localePath,shareImage} from '@/lib/site';
import type {Locale} from '@/lib/types';

const copy:Record<Locale,{title:string;summary:string;version:string;updated:string;pendingTitle:string;pendingBody:string}>={
  tr:{title:'Hukuki belgeler',summary:'Boşa Gezme!’nin nasıl çalıştığını ve verilerinizle ne yaptığını anlatan belgeler. Her belge kendi sürümünü ve yürürlük tarihini taşır.',version:'Sürüm',updated:'Son güncelleme',pendingTitle:'Hazırlanmakta olan belgeler',pendingBody:'Gizlilik politikası, KVKK aydınlatma metni, kullanım koşulları ve çerez politikası, veri sorumlusunun kimliği ve iletişim bilgileri tamamlandığında yayımlanacaktır. Bu bilgiler tamamlanmadan bu belgeleri yayımlamak, kimin sorumlu olduğunu belirtmeyen bir metin ortaya çıkarırdı.'},
  en:{title:'Legal documents',summary:'Documents describing how Boşa Gezme! works and what it does with your data. Each carries its own version and effective date.',version:'Version',updated:'Last updated',pendingTitle:'Documents in preparation',pendingBody:'The privacy policy, KVKK disclosure, terms of service and cookie policy will be published once the identity and contact details of the data controller are complete. Publishing them before then would produce a document that does not say who is responsible for it.'},
  de:{title:'Rechtliche Dokumente',summary:'Dokumente dazu, wie Boşa Gezme! funktioniert und was mit deinen Daten geschieht. Jedes trägt seine eigene Version und ein Gültigkeitsdatum.',version:'Version',updated:'Zuletzt aktualisiert',pendingTitle:'Dokumente in Vorbereitung',pendingBody:'Datenschutzerklärung, KVKK-Information, Nutzungsbedingungen und Cookie-Richtlinie werden veröffentlicht, sobald Identität und Kontaktdaten des Verantwortlichen vollständig sind. Eine frühere Veröffentlichung ergäbe ein Dokument, das nicht benennt, wer dafür verantwortlich ist.'},
  ru:{title:'Правовые документы',summary:'Документы о том, как работает Boşa Gezme! и что происходит с вашими данными. У каждого своя версия и дата вступления в силу.',version:'Версия',updated:'Обновлено',pendingTitle:'Документы в подготовке',pendingBody:'Политика конфиденциальности, уведомление KVKK, условия использования и политика cookie будут опубликованы после того, как будут указаны личность и контактные данные оператора данных. Публикация раньше дала бы документ, не называющий ответственное лицо.'},
};

export async function generateMetadata():Promise<Metadata>{
  const {locale}=await getServerI18n();
  const description=metaDescription(copy[locale].summary);
  return {title:copy[locale].title,description,alternates:canonicalFor(locale,'/legal'),openGraph:{url:'/legal',title:copy[locale].title,description,images:[shareImage]}};
}

export default async function Page(){
  const {locale}=await getServerI18n();
  const text=copy[locale];
  const docs=[about,contact,terms,privacy,kvkkAydinlatma,kvkkBasvuru,cookies,locationPrivacy,accountDeletion,childrenPrivacy,commercialCommunications,reportContent];
  return <main className="legal-page">
    <JsonLd data={{'@context':'https://schema.org','@type':'CollectionPage',name:text.title,description:text.summary,url:absolute('/legal'),inLanguage:locale,isPartOf:{'@id':`${absolute('/')}#website`}}}/>
    <header className="legal-header">
      <h1>{text.title}</h1>
      <p className="legal-summary">{text.summary}</p>
    </header>
    <ul className="legal-index">
      {docs.map(doc=><li key={doc.slug}>
        <Link href={localePath(locale,`/${doc.slug}`)}><strong>{doc.content[locale].title}</strong></Link>
        <p>{doc.content[locale].summary}</p>
        <small>{text.version} {doc.version} · {text.updated} <time dateTime={doc.updated}>{doc.updated}</time></small>
      </li>)}
    </ul>
    {!legalDocumentsArePublishable&&<aside className="legal-pending" role="note">
      <strong>{text.pendingTitle}</strong>
      <p>{text.pendingBody}</p>
    </aside>}
  </main>;
}
