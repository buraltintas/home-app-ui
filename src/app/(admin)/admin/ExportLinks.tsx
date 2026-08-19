// Exports carry the active filter, so what downloads is what the table is showing.
export function ExportLinks({table,q}:{table:string;q?:string}){
  const suffix=q?`?q=${encodeURIComponent(q)}`:'';
  return <div className="admin-export">
    <a href={`/admin/export/${table}${suffix}`}>Excel</a>
    <a href={`/admin/export/${table}/print${suffix}`} target="_blank" rel="noreferrer">PDF</a>
  </div>;
}
