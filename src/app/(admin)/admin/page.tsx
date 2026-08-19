import {AdminNav} from './AdminNav';
import {AccessDenied} from './AccessDenied';
import {getOverview,getSearchInsights} from '@/lib/admin-api';

export const dynamic='force-dynamic';

type Row=Record<string,unknown>;
const rows=(value:unknown):Row[]=>Array.isArray(value)?value as Row[]:[];
const text=(value:unknown)=>value===null||value===undefined?'—':String(value);

export default async function Page(){
  const overview=await getOverview();
  if(!overview.ok)return <AccessDenied/>;
  const insights=await getSearchInsights();
  const snapshot=overview.data.snapshot??{};
  const search=insights.ok?insights.data:{};

  return <>
    <AdminNav/>
    <h1>Genel bakış</h1>
    <p className="admin-lead">Son 30 gün. Sayılar doğrudan veritabanından okunur.</p>

    <div className="admin-cards">
      {Object.entries(snapshot).filter(([,v])=>typeof v==='number').map(([key,value])=>
        <dl className="admin-card" key={key}><dt>{key.replace(/_/g,' ')}</dt><dd>{String(value)}</dd></dl>)}
    </div>

    <h2>Sonuç dönmeyen aramalar</h2>
    <p className="admin-lead">
      Bu sayfadaki en işe yarar liste burasıdır: her satır, kataloğun cevaplayamadığı bir istek.
    </p>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Sorgu</th><th>Kez</th></tr></thead>
        <tbody>
          {rows((search as Row).zero_result_queries).map((row,i)=>
            <tr key={i}><td>{text(row.query??row.normalized_query)}</td><td>{text(row.count??row.total)}</td></tr>)}
          {rows((search as Row).zero_result_queries).length===0&&
            <tr><td colSpan={2} className="admin-empty">Bu aralıkta sonuçsuz arama yok.</td></tr>}
        </tbody>
      </table>
    </div>

    <h2>En çok aranan sorgular</h2>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Sorgu</th><th>Kez</th></tr></thead>
        <tbody>
          {rows((search as Row).top_queries).map((row,i)=>
            <tr key={i}><td>{text(row.query??row.normalized_query)}</td><td>{text(row.count??row.total)}</td></tr>)}
          {rows((search as Row).top_queries).length===0&&
            <tr><td colSpan={2} className="admin-empty">Henüz veri yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
