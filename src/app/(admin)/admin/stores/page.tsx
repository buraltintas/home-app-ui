import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {AdminAction} from '../AdminAction';
import {AdminPager} from '../AdminPager';
import {ExportLinks} from '../ExportLinks';
import {AdminSearch} from '../AdminSearch';
import {CategoryEditor} from '../CategoryEditor';
import {getCategories,getStores} from '@/lib/admin-api';
import {adminDate} from '@/lib/admin-time';
import {StoreCoverEditor} from '../StoreCoverEditor';

export const dynamic='force-dynamic';
const when=adminDate;

export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  const {q,page:pageParam}=await searchParams;
  const page=Math.max(0,Number(pageParam)||0);
  const result=await getStores(q,undefined,page);
  if(!result.ok)return <AccessDenied/>;
  const categories=await getCategories();
  const options=categories.ok?categories.data.items:[];
  const label=(slug:string)=>options.find(o=>o.slug===slug)?.name??slug;
  return <>
    <AdminNav/>
    <h1>Mağazalar</h1>
    <p className="admin-lead">
      Öne çıkarılan mağazalar arama sonuçlarında kendi şehrinde en üstte görünür ve kullanıcıya
      &ldquo;Öne çıkarılmış&rdquo; etiketiyle gösterilir. Katalog işareti sıralamayı değiştirmez;
      editoryal mağazaları arama ve detay ekranında ayırt eder. Kategoriler ayrıca düzenlenebilir.
      Her değişiklik işlem kayıtlarına yazılır.
    </p>
    <div className="admin-toolbar"><AdminSearch placeholder="Mağaza adı veya şehir"/><ExportLinks table="stores" q={q}/></div>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Mağaza</th><th>Kapak</th><th>Şehir</th><th>Yorum</th><th>Puan</th><th>Öne çıkarma</th><th>Katalog</th><th>Kategoriler</th><th>Eklendi</th><th></th></tr></thead>
        <tbody>
          {result.data.rows.map(store=><tr key={store.id}>
            <td>{store.name}</td>
            <td><StoreCoverEditor storeId={store.id} initialMediaId={store.cover_media_id}/></td>
            <td>{store.city}</td>
            <td>{store.review_count}</td>
            <td>{store.review_count?store.average_rating.toFixed(1):'—'}</td>
            <td><span className="admin-flag" data-on={store.is_premium}>{store.is_premium?'ÖNE ÇIKARILMIŞ':'NORMAL'}</span></td>
            <td><span className="admin-flag" data-on={store.is_catalog_store}>{store.is_catalog_store?'KATALOG':'STANDART'}</span></td>
            <td><div className="admin-cats">
              {store.categories.length
                ?store.categories.map(slug=><span key={slug}>{label(slug)}</span>)
                :<em>sınıflandırılmamış</em>}
            </div></td>
            <td>{when(store.created_at)}</td>
            <td>
              <AdminAction path={`stores/${store.id}/premium`} body={{is_premium:!store.is_premium}}
                label={store.is_premium?'Normale al':'Öne çıkar'}/>
              {' '}
              <AdminAction path={`stores/${store.id}/catalog`} body={{is_catalog_store:!store.is_catalog_store}}
                label={store.is_catalog_store?'Katalogdan çıkar':'Kataloğa ekle'}/>
              {' '}
              <CategoryEditor storeId={store.id} selected={store.categories} options={options}/>
            </td>
          </tr>)}
          {result.data.rows.length===0&&<tr><td colSpan={10} className="admin-empty">Sonuç yok.</td></tr>}
        </tbody>
      </table>
    </div>
    <AdminPager page={page} hasNext={result.data.hasNext} count={result.data.rows.length} params={{q}}/>
  </>;
}
