import type {JsonLd as JsonLdData} from '@/lib/structured-data';

// Rendered by a server component so the markup is in the HTML a crawler receives on the
// first response, rather than appearing only after hydration.
export function JsonLd({data}:{data:JsonLdData|JsonLdData[]}){
  const payload=Array.isArray(data)?data:[data];
  return <>{payload.map((entry,index)=>
    <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(entry).replace(/</g,'\\u003c')}}/>
  )}</>;
}
