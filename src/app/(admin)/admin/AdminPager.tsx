import Link from 'next/link';
import {PAGE_SIZE} from '@/lib/admin-api';

// Filters have to survive paging, or page two silently shows the unfiltered table.
export function AdminPager({page,hasNext,count,params}:{page:number;hasNext:boolean;count:number;params:Record<string,string|undefined>}){
  const href=(target:number)=>{
    const search=new URLSearchParams();
    for(const [key,value] of Object.entries(params))if(value)search.set(key,value);
    if(target>0)search.set('page',String(target));
    const text=search.toString();
    return text?`?${text}`:'?';
  };
  const from=page*PAGE_SIZE+1;
  return <div className="admin-pager">
    <span>{count?`${from}–${from+count-1}`:'0'} arası</span>
    {page>0&&<Link href={href(page-1)}>← Önceki</Link>}
    {hasNext&&<Link href={href(page+1)}>Sonraki →</Link>}
  </div>;
}
