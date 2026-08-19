import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminPager} from '../AdminPager';
import {ExportLinks} from '../ExportLinks';
import {AdminSearch} from '../AdminSearch';
import {getReviews} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleDateString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  const {q,page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getReviews(q,page);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>Değerlendirmeler</h1>
    <p className="admin-lead">Silinen değerlendirmenin metni boşaltılır ve mağazanın puanı yeniden hesaplanır.</p>
    <div className="admin-toolbar"><AdminSearch placeholder="Mağaza veya yazar"/><ExportLinks table="reviews" q={q}/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Mağaza</th><th>Yazar</th><th>Puan</th><th>Metin</th><th>Tarih</th><th></th></tr></thead>
        <tbody>
          {result.data.rows.map(review=><tr key={review.id}>
            <td>{review.store_name}</td>
            <td>{review.author||'—'}</td>
            <td>{review.rating}</td>
            <td>{review.deleted?<em>silinmiş</em>:review.text.slice(0,120)}</td>
            <td>{when(review.created_at)}</td>
            <td>{review.deleted?null:<AdminAction path={`reviews/${review.id}`} method="DELETE" label="Sil" tone="danger"
              confirm="Bu değerlendirme silinsin mi? Metni kalıcı olarak boşaltılır."/>}</td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={6} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{q}}/>
  </>;
}
