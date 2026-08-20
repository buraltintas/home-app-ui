import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminPager} from '../AdminPager';
import {ExportLinks} from '../ExportLinks';
import {AdminSearch} from '../AdminSearch';
import {getSearches} from '@/lib/admin-api';
import {adminDateTime} from '@/lib/admin-time';

export const dynamic='force-dynamic';
const when=adminDateTime;

export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  const {q,page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getSearches(q,page);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>Aramalar</h1>
    <p className="admin-lead">
      Ham arama kaydı. &ldquo;Yedek&rdquo; sütunu boş değilse arama boru hattının bir parçası
      o istekte devre dışı kalmış demektir; <code>ai_</code> ile başlayan değerler sebebini söyler.
    </p>
    <div className="admin-toolbar"><AdminSearch placeholder="Arama metni"/><ExportLinks table="searches" q={q}/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Sorgu</th><th>Dil</th><th>Kapsam</th><th>Sonuç</th><th>Tıklama</th><th>Süre</th><th>Yedek</th><th>Tarih</th></tr></thead>
        <tbody>
          {result.data.rows.map(row=><tr key={row.id}>
            <td>{row.query}</td>
            <td>{row.query_language||'—'}</td>
            <td>{row.scope||'—'}</td>
            <td>{row.result_count}</td>
            <td>{row.click_count}</td>
            <td>{row.duration_ms!==undefined?`${row.duration_ms} ms`:'—'}</td>
            <td>{row.fallback_state??'—'}</td>
            <td>{when(row.created_at)}</td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={8} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{q}}/>
  </>;
}
