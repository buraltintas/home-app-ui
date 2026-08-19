import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminSearch} from '../AdminSearch';
import {getReviews} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleDateString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q}=await searchParams;
  const result=await getReviews(q);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <h1>Değerlendirmeler</h1>
    <p className="admin-lead">Silinen değerlendirmenin metni boşaltılır ve mağazanın puanı yeniden hesaplanır.</p>
    <AdminSearch placeholder="Mağaza veya yazar"/>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Mağaza</th><th>Yazar</th><th>Puan</th><th>Metin</th><th>Tarih</th><th></th></tr></thead>
        <tbody>
          {result.data.items.map(review=><tr key={review.id}>
            <td>{review.store_name}</td>
            <td>{review.author||'—'}</td>
            <td>{review.rating}</td>
            <td>{review.deleted?<em>silinmiş</em>:review.text.slice(0,120)}</td>
            <td>{when(review.created_at)}</td>
            <td>{review.deleted?null:<AdminAction path={`reviews/${review.id}`} method="DELETE" label="Sil" tone="danger"
              confirm="Bu değerlendirme silinsin mi? Metni kalıcı olarak boşaltılır."/>}</td>
          </tr>)}
          {result.data.items.length===0&&<tr><td colSpan={6} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
