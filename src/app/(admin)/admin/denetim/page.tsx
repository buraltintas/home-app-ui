import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminPager} from '../AdminPager';
import {getBlockedAttempts,getHeldReviews,type HeldFinding} from '@/lib/admin-api';
import {adminDate} from '@/lib/admin-time';
import {getServerI18n} from '@/i18n/server';

export const dynamic='force-dynamic';

// What each finding is, in the words the decision is made in.
const kinds:Record<HeldFinding['kind'],string>={
  insult:'Hakaret',
  threat:'Tehdit',
  accusation:'Suç isnadı',
  personal_data:'Kişisel veri',
  other_crime:'Diğer suç unsuru',
};

// Each note under the heading the reviewer answered it under -- the site's own words for the
// eight questions, read from the same dictionary the review form reads, not a second copy.
const {t}=getServerI18n('tr');
const noteLabels:Record<string,string>={
  availability:t.criterionAvailability,value:t.criterionValue,layout:t.criterionLayout,staff_care:t.criterionStaffCare,
  staff_knowledge:t.criterionStaffKnowledge,checkout:t.criterionCheckout,returns:t.criterionReturns,cleanliness:t.criterionCleanliness,
};

// The reviews the check held back. The rule is the product owner's: anything carrying an
// element of a crime is not published until a person has read it, and there is no middle
// level. Each row shows every part a visitor would read and the passage the check pointed
// at, so the decision is made on the words.
export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}){
  const {page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const [result,blocked]=await Promise.all([getHeldReviews(page),getBlockedAttempts(0)]);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>Denetim</h1>
    <p className="admin-lead">Yayımlanmadan önce okunması gereken değerlendirmeler. Yayımla, olduğu gibi siteye çıkarır ve mağazanın puanına ekler; kaldır, siteden uzak tutar. Yazan kişi durumu Değerlendirmelerim sayfasında görür.</p>
    <div className="admin-held-list">
      {result.data.rows.map(review=><article key={review.id} className="admin-held">
        <header>
          <strong>{review.store_name}</strong>
          <span>{review.author||'—'} · {review.rating} · {adminDate(review.created_at)}</span>
        </header>
        {review.verdict==='unchecked'
          ?<p className="admin-note">Kontrol çalışamadı{review.error?` (${review.error})`:''}; okunmadan yayımlanmaması için bekletildi.</p>
          :<ul className="admin-held-findings">{review.findings.map((finding,index)=><li key={index}><b>{kinds[finding.kind]??finding.kind}</b> “{finding.quote}”</li>)}</ul>}
        <dl className="admin-held-parts">
          {Object.entries(review.criterion_notes??{}).map(([key,note])=><div key={key}><dt>{noteLabels[key]??key}</dt><dd>{note}</dd></div>)}
          {review.purchased_item&&<div><dt>Satın alınan</dt><dd>{review.purchased_item}</dd></div>}
          {review.text&&!review.criterion_notes&&<div><dt>Metin</dt><dd>{review.text}</dd></div>}
        </dl>
        <div className="admin-held-actions">
          <AdminAction path={`moderation/${review.id}`} body={{decision:'approved'}} label="Yayımla"
            confirm="Bu değerlendirme olduğu gibi yayımlansın mı?" storeRefs={[review.store_id,review.store_slug]}/>
          <AdminAction path={`moderation/${review.id}`} body={{decision:'removed'}} label="Kaldır" tone="danger"
            confirm="Bu değerlendirme siteden uzak tutulsun mu?" storeRefs={[review.store_id,review.store_slug]}/>
        </div>
      </article>)}
      {result.data.rows.length===0&&<p className="admin-empty">Bekleyen değerlendirme yok.</p>}
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{}}/>

    {/* Below the queue, and deliberately not part of it: nothing here was written, so there
        is nothing to decide. The check stopped these passages as their author was leaving
        the step, and they never became reviews -- which is also why the author does not see
        them in Değerlendirmelerim. They are listed so a refusal can be read: audited,
        noticed as a pattern, or answered if the person who wrote it asks why. */}
    {blocked.ok&&blocked.data.rows.length>0&&<section className="admin-blocked">
      <h2>Yazılmadan durdurulanlar</h2>
      <p className="admin-lead">Kişi adımı geçmeden uyarıldı ve metin hiç kaydedilmedi. Burada karar verilecek bir şey yok; kayıt, ret gerekçesinin okunabilmesi için tutuluyor.</p>
      <div className="admin-held">
        {blocked.data.rows.map(row=><article key={row.id} className="admin-held-card">
          <header>
            <strong>{row.store_name}</strong>
            <span>{row.author||'—'} · {row.field==='purchased_item'?'Alınan ürün':'Puan detayı'} · {adminDate(row.created_at)}</span>
          </header>
          <ul className="admin-held-findings">{row.findings.map((finding,index)=><li key={index}><b>{kinds[finding.kind]??finding.kind}</b> “{finding.quote}”</li>)}</ul>
          <dl className="admin-held-parts"><div><dt>Yazdığı</dt><dd>{row.body}</dd></div></dl>
        </article>)}
      </div>
    </section>}
  </>;
}
