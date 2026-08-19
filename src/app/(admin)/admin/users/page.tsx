import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminSearch} from '../AdminSearch';
import {getUsers} from '@/lib/admin-api';

export const dynamic='force-dynamic';
const when=(v:string)=>new Date(v).toLocaleDateString('tr-TR');

export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q}=await searchParams;
  const result=await getUsers(q);
  if(!result.ok)return <AccessDenied/>;
  return <>
    <h1>Kullanıcılar</h1>
    <p className="admin-lead">
      Askıya alma, hesabı girişe kapatır ama yazdıklarını korur. Silme, kullanıcının kendi
      sildiğiyle birebir aynı işlemi çalıştırır: içerik boşaltılır, profil anonimleşir, e-posta
      adresi hesabın yeniden açılabilmesi için saklanır.
    </p>
    <AdminSearch placeholder="E-posta veya kullanıcı adı"/>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>E-posta</th><th>Kullanıcı</th><th>Durum</th><th>Yorum</th><th>Kayıt</th><th></th></tr></thead>
        <tbody>
          {result.data.items.map(user=><tr key={user.id}>
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
          {result.data.items.length===0&&<tr><td colSpan={6} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
