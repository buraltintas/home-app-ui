import 'server-only';
import {serverApi} from './server-api';

// Exports read the same admin routes the tables read, so an export can never show data the
// panel would not. They ask for a much larger page than the screen does: the table is
// capped for readability, an export is for analysis.
// Matches the backend ceiling exactly. Asking for more than it allows made it fall back
// to a single screenful, so an export silently produced fifty rows instead of the table.
const EXPORT_LIMIT=5000;

export type Column={key:string;label:string};
export type Table={title:string;columns:Column[];rows:Record<string,unknown>[]};

const columns:Record<string,Column[]>={
  stores:[
    {key:'name',label:'Mağaza'},{key:'city',label:'Şehir'},{key:'slug',label:'Slug'},
    {key:'is_premium',label:'Öne çıkarılmış'},{key:'review_count',label:'Yorum'},
    {key:'average_rating',label:'Puan'},{key:'created_at',label:'Eklendi'},
  ],
  users:[
    {key:'email',label:'E-posta'},{key:'display_name',label:'Ad'},{key:'username',label:'Kullanıcı adı'},
    {key:'status',label:'Durum'},{key:'review_count',label:'Yorum'},{key:'created_at',label:'Kayıt'},
  ],
  reviews:[
    {key:'store_name',label:'Mağaza'},{key:'author',label:'Yazar'},{key:'rating',label:'Puan'},
    {key:'text',label:'Metin'},{key:'created_at',label:'Tarih'},{key:'deleted',label:'Silinmiş'},
  ],
  searches:[
    {key:'query',label:'Sorgu'},{key:'query_language',label:'Dil'},{key:'scope',label:'Kapsam'},
    {key:'result_count',label:'Sonuç'},{key:'click_count',label:'Tıklama'},
    {key:'duration_ms',label:'Süre (ms)'},{key:'fallback_state',label:'Yedek'},{key:'created_at',label:'Tarih'},
  ],
  audit:[
    {key:'created_at',label:'Tarih'},{key:'actor_email',label:'Kim'},{key:'action',label:'İşlem'},
    {key:'target_type',label:'Hedef türü'},{key:'target_id',label:'Hedef'},{key:'metadata',label:'Ayrıntı'},
  ],
};

const titles:Record<string,string>={
  stores:'Mağazalar',users:'Kullanıcılar',reviews:'Değerlendirmeler',
  searches:'Aramalar',audit:'İşlem kayıtları',
};

export const exportableTables=Object.keys(columns);

export async function loadTable(table:string,q?:string):Promise<Table|null>{
  if(!columns[table])return null;
  const search=new URLSearchParams({limit:String(EXPORT_LIMIT)});
  if(q)search.set('q',q);
  try{
    const data=await serverApi<{items:Record<string,unknown>[]}>(`/v1/admin/${table}?${search}`);
    return {title:titles[table],columns:columns[table],rows:data.items??[]};
  }catch{return null;}
}

// Values are formatted once, here, so the spreadsheet and the printable view cannot
// disagree about what a row says.
export function cell(value:unknown,key:string):string{
  if(value===null||value===undefined||value==='')return '';
  if(typeof value==='boolean')return value?'Evet':'Hayır';
  if(key.endsWith('_at'))return new Date(String(value)).toLocaleString('tr-TR');
  if(typeof value==='object')return JSON.stringify(value);
  return String(value);
}
