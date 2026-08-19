import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminSearch} from '../AdminSearch';
import {getStores} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleDateString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q}=await searchParams;
  const result=await getStores(q);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <h1>Mağazalar</h1>
    <p className="admin-lead">
      Öne çıkarılan mağazalar arama sonuçlarında kendi şehrinde en üstte görünür ve kullanıcıya
      &ldquo;Öne çıkarılmış&rdquo; etiketiyle gösterilir. Her değişiklik işlem kayıtlarına yazılır.
    </p>
    <AdminSearch placeholder="Mağaza adı veya şehir"/>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Mağaza</th><th>Şehir</th><th>Yorum</th><th>Puan</th><th>Durum</th><th>Eklendi</th><th></th></tr></thead>
        <tbody>
          {result.data.items.map(store=><tr key={store.id}>
            <td>{store.name}</td>
            <td>{store.city}</td>
            <td>{store.review_count}</td>
            <td>{store.review_count?store.average_rating.toFixed(1):'—'}</td>
            <td><span className="admin-flag" data-on={store.is_premium}>{store.is_premium?'ÖNE ÇIKARILMIŞ':'NORMAL'}</span></td>
            <td>{when(store.created_at)}</td>
            <td><AdminAction path={`stores/${store.id}/premium`} body={{is_premium:!store.is_premium}}
              label={store.is_premium?'Normale al':'Öne çıkar'}/></td>
          </tr>)}
          {result.data.items.length===0&&<tr><td colSpan={7} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
