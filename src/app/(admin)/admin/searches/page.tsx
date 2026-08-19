import {AccessDenied} from '../AccessDenied';
import {AdminSearch} from '../AdminSearch';
import {getSearches} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q}=await searchParams;
  const result=await getSearches(q);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <h1>Aramalar</h1>
    <p className="admin-lead">
      Ham arama kaydı. &ldquo;Yedek&rdquo; sütunu boş değilse arama boru hattının bir parçası
      o istekte devre dışı kalmış demektir; <code>ai_</code> ile başlayan değerler sebebini söyler.
    </p>
    <AdminSearch placeholder="Arama metni"/>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Sorgu</th><th>Dil</th><th>Kapsam</th><th>Sonuç</th><th>Tıklama</th><th>Süre</th><th>Yedek</th><th>Tarih</th></tr></thead>
        <tbody>
          {result.data.items.map(row=><tr key={row.id}>
            <td>{row.query}</td>
            <td>{row.query_language||'—'}</td>
            <td>{row.scope||'—'}</td>
            <td>{row.result_count}</td>
            <td>{row.click_count}</td>
            <td>{row.duration_ms!==undefined?`${row.duration_ms} ms`:'—'}</td>
            <td>{row.fallback_state??'—'}</td>
            <td>{when(row.created_at)}</td>
          </tr>)}
          {result.data.items.length===0&&<tr><td colSpan={8} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
