import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminPager} from '../AdminPager';
import {AdminSearch} from '../AdminSearch';
import {getFeedback} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleString('tr-TR',{dateStyle:'short',timeStyle:'short'});
const KINDS:Record<string,string>={suggestion:'Öneri',problem:'Sorun',praise:'Beğeni',other:'Diğer'};
const STATUS:Record<string,string>={new:'Yeni',read:'Okundu',handled:'Kapandı'};

export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  const {q,page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getFeedback(q,page);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>Görüş ve öneriler</h1>
    <p className="admin-lead">İnsanların ürün hakkında yazdıkları. Hiçbiri yayınlanmaz; yalnızca burada görünür.</p>
    <div className="admin-toolbar"><AdminSearch placeholder="Mesaj veya e-posta"/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Tarih</th><th>Konu</th><th>Mesaj</th><th>Gönderen</th><th>Dil</th><th>Durum</th><th></th></tr></thead>
        <tbody>
          {result.data.rows.map(row=><tr key={row.id}>
            <td>{when(row.created_at)}</td>
            <td>{KINDS[row.kind]??row.kind}</td>
            <td className="admin-feedback-message">{row.message}</td>
            <td>{row.author||row.contact_email||<em>anonim</em>}</td>
            <td>{row.locale.toUpperCase()}</td>
            <td>{STATUS[row.status]??row.status}</td>
            <td>{row.status==='handled'
              ?<AdminAction path={`feedback/${row.id}/status`} method="POST" body={{status:'new'}} label="Geri aç"/>
              :<AdminAction path={`feedback/${row.id}/status`} method="POST" body={{status:'handled'}} label="Kapat"/>}</td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={7} className="admin-empty">Henüz mesaj yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{q}}/>
  </>;
}
