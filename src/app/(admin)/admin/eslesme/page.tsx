import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {getMatchQueue} from '@/lib/admin-api';
import {adminDate} from '@/lib/admin-time';

export const dynamic='force-dynamic';

// The matching queue. Every row here is a judgement the importer refused to make on its
// own: a published shop that resembles one already in the catalogue closely enough to be
// suspicious and not closely enough to merge on. Silently guessing either way is how a
// catalogue grows twins or loses shops, so the guess is not made -- it is parked here.
export default async function Page(){
  const queue=await getMatchQueue();
  if(!queue.ok)return <AccessDenied/>;
  const rows=queue.data;
  return <>
    <AdminNav/>
    <h1>Eşleştirme kuyruğu</h1>
    <p className="admin-lead">
      İçe aktarma sırasında karar verilemeyen satırlar. Soldaki markanın yayımladığı mağaza,
      sağdaki katalogda zaten duran mağaza. &ldquo;Aynı mağaza&rdquo; dersen mevcut kayıt bu
      markaya bağlanır ve bir sonraki içe aktarma onu tazeler; &ldquo;ayrı mağaza&rdquo;
      dersen soru kapanır ve kayıtlar ayrı kalır. Her karar işlem kayıtlarına yazılır.
    </p>
    {rows.length===0
      ? <p className="admin-note">Kuyruk boş.</p>
      : <div className="admin-queue">
          {rows.map(row=><article key={row.id} className="admin-queue-item">
            <header>
              <strong>{row.brand||'—'}</strong>
              <span>{Math.round(row.distance_meters)} m · ad benzerliği {row.similarity.toFixed(2)} · {adminDate(row.created_at)}</span>
            </header>
            <div className="admin-queue-pair">
              <div>
                <h3>Markanın yayımladığı</h3>
                <p><strong>{row.name}</strong></p>
                <p className="admin-note">{row.address||[row.district,row.city].filter(Boolean).join(' ')||'adres yok'}</p>
              </div>
              <div>
                <h3>Katalogda duran</h3>
                <p><strong>{row.match_name||'— (bu mağaza artık yok)'}</strong></p>
                <p className="admin-note">{row.match_address||'adres yok'}{row.match_source_kind?` · ${row.match_source_kind}`:''}</p>
              </div>
            </div>
            <p className="admin-note">{row.reason}</p>
            <div className="admin-form-actions">
              <AdminAction path={`match-queue/${row.id}`} body={{merge:true}} label="Aynı mağaza — birleştir"/>
              <AdminAction path={`match-queue/${row.id}`} body={{merge:false}} label="Ayrı mağaza"/>
            </div>
          </article>)}
        </div>}
  </>;
}
