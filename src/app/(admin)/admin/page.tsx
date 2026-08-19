import {AdminNav} from './AdminNav';
import {AccessDenied} from './AccessDenied';
import {getOverview,getSearchInsights} from '@/lib/admin-api';

export const dynamic='force-dynamic';

// The cards used to print whatever key the API sent, which is how REGISTEREDUSERSTOTAL
// ended up on screen. Naming them here also fixes their order: the counts somebody opens
// this page for come first, and the lifetime bookkeeping goes last.
const SNAPSHOT_LABELS:[string,string][]=[
  ['registered_users_total','Kayıtlı kullanıcı'],
  ['stores_total','Mağaza'],
  ['google_imported_stores_total',"Google'dan alınan"],
  ['posts_current_total','Yayında olan yorum'],
  ['searches_lifetime','Toplam arama'],
  ['favorites_current_total','Favori'],
  ['comments_current_total','Yorum'],
  ['likes_current_total','Beğeni'],
  ['follows_current_total','Takip'],
  ['media_current_total','Fotoğraf'],
  ['posts_created_lifetime','Toplam yazılan yorum'],
  ['posts_deleted_lifetime','Silinen yorum'],
];

type QueryMetric={normalized_query:string;query_language:string;search_count:number;zero_result_count:number;click_count:number};
type Insights={top_queries?:QueryMetric[];zero_result_queries?:QueryMetric[]};

const number=(value:unknown)=>typeof value==='number'?value.toLocaleString('tr-TR'):'0';

function QueryTable({rows,countLabel,count,empty}:{rows:QueryMetric[];countLabel:string;count:(row:QueryMetric)=>number;empty:string}){
  return <div className="admin-table-wrap">
    <table className="admin-table">
      <thead><tr><th>Arama</th><th>Dil</th><th>{countLabel}</th><th>Tıklama</th></tr></thead>
      <tbody>
        {rows.map((row,index)=>
          <tr key={`${row.normalized_query}:${row.query_language}:${index}`}>
            <td>{row.normalized_query||'—'}</td>
            <td>{(row.query_language||'—').toUpperCase()}</td>
            <td>{number(count(row))}</td>
            <td>{number(row.click_count)}</td>
          </tr>)}
        {rows.length===0&&<tr><td colSpan={4} className="admin-empty">{empty}</td></tr>}
      </tbody>
    </table>
  </div>;
}

export default async function Page(){
  const overview=await getOverview();
  if(!overview.ok)return <AccessDenied/>;
  const insights=await getSearchInsights();
  const snapshot=(overview.data.snapshot??{}) as Record<string,unknown>;
  const search=(insights.ok?insights.data:{}) as Insights;
  const zero=search.zero_result_queries??[];
  const top=search.top_queries??[];

  return <>
    <AdminNav/>
    <h1>Genel bakış</h1>
    <p className="admin-lead">Aramalar son 30 günü kapsar. Toplamlar tüm zamanlardır ve doğrudan veritabanından okunur.</p>

    <div className="admin-cards">
      {SNAPSHOT_LABELS.filter(([key])=>key in snapshot).map(([key,label])=>
        <dl className="admin-card" key={key}><dt>{label}</dt><dd>{number(snapshot[key])}</dd></dl>)}
    </div>

    <h2>Sonuç dönmeyen aramalar</h2>
    <p className="admin-lead">
      Bu sayfadaki en işe yarar liste burasıdır: her satır, kataloğun cevaplayamadığı bir istek.
    </p>
    <QueryTable rows={zero} countLabel="Sonuçsuz" count={row=>row.zero_result_count} empty="Bu aralıkta sonuçsuz arama yok."/>

    <h2>En çok aranan sorgular</h2>
    <QueryTable rows={top} countLabel="Arama" count={row=>row.search_count} empty="Bu aralıkta arama kaydı yok."/>
  </>;
}
