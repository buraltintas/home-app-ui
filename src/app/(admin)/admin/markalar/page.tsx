import {AdminNav} from '../AdminNav';
import {AccessDenied} from '../AccessDenied';
import {getBrands} from '@/lib/admin-api';
import {adminDate} from '@/lib/admin-time';

export const dynamic='force-dynamic';

// The brand registry, with what each brand's last import did.
//
// The counts are the point of the page. A run that inserted nothing and updated everything
// is a brand working correctly; one that inserted about as many shops as the brand already
// had has just been duplicated, and that shows here before anybody searches and finds the
// same shop twice.
export default async function Page(){
  const brands=await getBrands();
  if(!brands.ok)return <AccessDenied/>;
  const rows=brands.data;
  const mapped=rows.filter(b=>b.locator_kind!=='none'&&b.active);
  const stores=rows.reduce((total,b)=>total+b.stores,0);
  return <>
    <AdminNav/>
    <h1>Markalar</h1>
    <p className="admin-lead">
      Katalog, markaların kendi yayımladıkları mağaza listelerinden toplanır. Kayıt defteri
      depoda (<code>internal/catalog/data/brands.yaml</code>) tutulur; yeni marka eklemek kod
      yazmak değil, oraya bir blok yazmaktır. Aşağıdaki sayılar her markanın <strong>son
      uygulanmış</strong> içe aktarmasından gelir: &ldquo;yeni&rdquo; sütunu sıfıra yakın ve
      &ldquo;güncellenen&rdquo; mağaza sayısına yakınsa o marka doğru çalışıyor demektir.
    </p>
    <p className="admin-note">{mapped.length} markanın mağaza listesi okunabiliyor · {stores.toLocaleString('tr-TR')} mağaza</p>
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr>
          <th>Marka</th><th>Tier</th><th>Kaynak</th><th>Mağaza</th><th>Taşıyan</th>
          <th>Son çekim</th><th>Çekilen</th><th>Yeni</th><th>Güncellenen</th><th>İnceleme</th>
        </tr></thead>
        <tbody>
          {rows.map(brand=><tr key={brand.slug} data-off={!brand.active||undefined}>
            <td>
              <strong>{brand.name}</strong>
              {!brand.active&&<span className="admin-flag"> TAŞIMIYORUZ</span>}
              {brand.website&&<><br/><small>{brand.website.replace(/^https?:\/\/(www\.)?/,'')}</small></>}
              {brand.last_error&&<><br/><small className="admin-error-note">{brand.last_error}</small></>}
            </td>
            <td>{brand.tier}</td>
            <td>{brand.locator_kind==='none'?'—':brand.locator_kind==='json'?'JSON':'sayfa'}</td>
            <td>{brand.stores.toLocaleString('tr-TR')}</td>
            <td>{brand.carried||'—'}</td>
            <td>{brand.last_run?adminDate(brand.last_run):'—'}</td>
            <td>{brand.last_run?brand.last_fetched:'—'}</td>
            <td data-warn={brand.last_new>0&&brand.last_new>brand.stores/2||undefined}>{brand.last_run?brand.last_new:'—'}</td>
            <td>{brand.last_run?brand.last_updated:'—'}</td>
            <td>{brand.last_run?(brand.last_review||'—'):'—'}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <p className="admin-note" style={{marginTop:16}}>
      İçe aktarma şu an komut satırından çalışır: <code>go run ./cmd/catalog -source &lt;marka&gt; -apply</code>.
      Panelden tetiklemek sıradaki iş.
    </p>
  </>;
}
