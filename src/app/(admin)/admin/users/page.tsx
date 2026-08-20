import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminPager} from '../AdminPager';
import {ExportLinks} from '../ExportLinks';
import {AdminSearch} from '../AdminSearch';
import {getUsers} from '@/lib/admin-api';
import {adminDate} from '@/lib/admin-time';

export const dynamic='force-dynamic';
const when=adminDate;

export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  const {q,page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getUsers(q,page);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <AdminNav/>
    <h1>Kullanıcılar</h1>
    <p className="admin-lead">
      Askıya alma, hesabı girişe kapatır ama yazdıklarını korur. Silme, kullanıcının kendi
      sildiğiyle birebir aynı işlemi çalıştırır: içerik boşaltılır, profil anonimleşir, e-posta
      adresi hesabın yeniden açılabilmesi için saklanır.
    </p>
    <div className="admin-toolbar"><AdminSearch placeholder="E-posta veya kullanıcı adı"/><ExportLinks table="users" q={q}/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>E-posta</th><th>Kullanıcı</th><th>Durum</th><th>Yorum</th><th>Kayıt</th><th></th></tr></thead>
        <tbody>
          {result.data.rows.map(user=><tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.display_name||user.username||'—'}</td>
            <td><span className="admin-flag" data-on={user.status!=='active'}>{user.status.toUpperCase()}</span></td>
            <td>{user.review_count}</td>
            <td>{when(user.created_at)}</td>
            <td>
              {user.status==='active'
                ?<AdminAction path={`users/${user.id}/status`} body={{status:'suspended'}} label="Askıya al"
                   confirm={`${user.email} askıya alınsın mı? Girişi kapanır, içeriği kalır.`}/>
                :<AdminAction path={`users/${user.id}/status`} body={{status:'active'}} label="Aktifleştir"/>}
              {' '}
              <AdminAction path={`users/${user.id}`} method="DELETE" label="Sil" tone="danger"
                confirm={`${user.email} silinsin mi? İçeriği boşaltılır ve geri alınamaz.`}/>
            </td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={6} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{q}}/>
  </>;
}
