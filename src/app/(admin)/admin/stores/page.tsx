import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminPager} from '../AdminPager';
import {ExportLinks} from '../ExportLinks';
import {AdminSearch} from '../AdminSearch';
import {getStores} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleDateString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  const {q,page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getStores(q,undefined,page);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>Mağazalar</h1>
    <p className="admin-lead">
      Öne çıkarılan mağazalar arama sonuçlarında kendi şehrinde en üstte görünür ve kullanıcıya
      &ldquo;Öne çıkarılmış&rdquo; etiketiyle gösterilir. Her değişiklik işlem kayıtlarına yazılır.
    </p>
    <div className="admin-toolbar"><AdminSearch placeholder="Mağaza adı veya şehir"/><ExportLinks table="stores" q={q}/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Mağaza</th><th>Şehir</th><th>Yorum</th><th>Puan</th><th>Durum</th><th>Eklendi</th><th></th></tr></thead>
        <tbody>
          {result.data.rows.map(store=><tr key={store.id}>
            <td>{store.name}</td>
            <td>{store.city}</td>
            <td>{store.review_count}</td>
            <td>{store.review_count?store.average_rating.toFixed(1):'—'}</td>
            <td><span className="admin-flag" data-on={store.is_premium}>{store.is_premium?'ÖNE ÇIKARILMIŞ':'NORMAL'}</span></td>
            <td>{when(store.created_at)}</td>
            <td><AdminAction path={`stores/${store.id}/premium`} body={{is_premium:!store.is_premium}}
              label={store.is_premium?'Normale al':'Öne çıkar'}/></td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={7} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{q}}/>
  </>;
}
