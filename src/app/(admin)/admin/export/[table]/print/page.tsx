import {AccessDenied} from '../../../AccessDenied';
import {PrintTrigger} from './PrintTrigger';
import {cell, exportableTables, loadTable} from '@/lib/admin-export';

export const dynamic='force-dynamic';

// PDF is produced by the browser's own print-to-PDF rather than a server-side renderer.
// Every server PDF library needs an embedded font to draw ş, ğ, ı and İ at all, and this
// dataset is almost entirely Turkish store names -- the one thing that must not turn into
// boxes. Printing from the browser uses the fonts already on screen, adds no dependency and
// no font licence, and still ends in a real PDF file.
export default async function Page({params,searchParams}:{
  params:Promise<{table:string}>;searchParams:Promise<{q?:string}>;
}){
  const [{table},{q}]=await Promise.all([params,searchParams]);
  if(!exportableTables.includes(table))return <AccessDenied/>;
  const data=await loadTable(table,q);
  if(!data)return <AccessDenied/>;

  return <div className="print-sheet">
    <PrintTrigger/>
    <header className="print-head">
      <h1>{data.title}</h1>
      <p>Boşa Gezme! · {new Date().toLocaleString('tr-TR')} · {data.rows.length} kayıt{q?` · filtre: “${q}”`:''}</p>
      <p className="print-hint">Yazdırma penceresinde hedefi <strong>PDF olarak kaydet</strong> seçerek dosyayı alabilirsin.</p>
    </header>
    <table className="print-table">
      <thead><tr>{data.columns.map(column=><th key={column.key}>{column.label}</th>)}</tr></thead>
      <tbody>
        {data.rows.map((row,index)=><tr key={index}>
          {data.columns.map(column=><td key={column.key}>{cell(row[column.key],column.key)}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>;
}
