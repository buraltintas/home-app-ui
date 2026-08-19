import {AccessDenied} from '../AccessDenied';
import {getAudit} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleString('tr-TR');

export default async function Page(){
  const result=await getAudit();
  if(!result.ok)return <AccessDenied/>;
  return <>
    <h1>İşlem kayıtları</h1>
    <p className="admin-lead">
      Yetkili her değişiklik, değişikliğin kendisiyle aynı işlemde buraya yazılır; kayıt ile
      olan biten birbirinden ayrılamaz.
    </p>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Tarih</th><th>Kim</th><th>İşlem</th><th>Hedef</th><th>Ayrıntı</th></tr></thead>
        <tbody>
          {result.data.items.map(row=><tr key={row.id}>
            <td>{when(row.created_at)}</td>
            <td>{row.actor_email}</td>
            <td>{row.action}</td>
            <td>{row.target_type}/{row.target_id.slice(0,8)}</td>
            <td>{Object.keys(row.metadata||{}).length?JSON.stringify(row.metadata):'—'}</td>
          </tr>)}
          {result.data.items.length===0&&<tr><td colSpan={5} className="admin-empty">Henüz işlem yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
