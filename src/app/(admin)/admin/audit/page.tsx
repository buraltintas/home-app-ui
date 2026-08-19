import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminPager} from '../AdminPager';
import {ExportLinks} from '../ExportLinks';
import {getAudit} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}){
  const {page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getAudit(page);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>İşlem kayıtları</h1>
    <p className="admin-lead">
      Yetkili her değişiklik, değişikliğin kendisiyle aynı işlemde buraya yazılır; kayıt ile
      olan biten birbirinden ayrılamaz.
    </p>
    <div className="admin-toolbar"><ExportLinks table="audit"/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Tarih</th><th>Kim</th><th>İşlem</th><th>Hedef</th><th>Ayrıntı</th></tr></thead>
        <tbody>
          {result.data.rows.map(row=><tr key={row.id}>
            <td>{when(row.created_at)}</td>
            <td>{row.actor_email}</td>
            <td>{row.action}</td>
            <td>{row.target_type}/{row.target_id.slice(0,8)}</td>
            <td>{Object.keys(row.metadata||{}).length?JSON.stringify(row.metadata):'—'}</td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={5} className="admin-empty">Henüz işlem yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{}}/>
  </>;
}
