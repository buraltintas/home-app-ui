import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';

// Where a Content-Security-Policy violation is written down.
//
// Report-only ran for a day and taught us one thing, and only because somebody happened to
// have a console open: the browser writes a violation to the console of the person it
// happened to, and nowhere else. That is not a measurement. A policy nobody can observe is
// a policy nobody can tighten, so the policy names this address and the browser posts here
// instead -- and enforcing it becomes a decision with evidence behind it rather than a
// hope.
//
// Anybody on the internet can post here, because that is what a report endpoint is. So
// this writes one line, of fields it chose, from a body it caps -- never the raw report,
// which the sender controls and could make arbitrarily large. There is nothing personal in
// a report: the page's own address, the resource that was blocked, and which rule blocked
// it.

const LIMIT=8<<10;

// Browsers send two shapes for the same event: the old `report-uri` body, which is one
// report under "csp-report", and the newer Reporting API body, which is an array of
// envelopes carrying the same fields under "body". Both are read, because which one
// arrives depends on the browser rather than on us.
type Violation={
  'document-uri'?:string;documentURL?:string;
  'violated-directive'?:string;effectiveDirective?:string;
  'blocked-uri'?:string;blockedURL?:string;
  disposition?:string;
};

const line=(v:Violation)=>({
  document:v['document-uri']??v.documentURL??'',
  directive:v['violated-directive']??v.effectiveDirective??'',
  blocked:v['blocked-uri']??v.blockedURL??'',
  disposition:v.disposition??'',
});

export async function POST(request:Request){
  try{
    const body=await request.text();
    // Longer than this is not a report worth reading, and reading it is the cost.
    if(body.length>LIMIT)return new NextResponse(null,{status:204});
    const parsed=JSON.parse(body) as unknown;
    const reports:Violation[]=Array.isArray(parsed)
      ?parsed.map(entry=>(entry as {body?:Violation}).body??{})
      :[((parsed as {'csp-report'?:Violation})['csp-report'])??{}];
    for(const report of reports.slice(0,10)){
      const fields=line(report);
      if(!fields.directive&&!fields.blocked)continue;
      // One line per violation, to stdout, which is where this platform's log is. A
      // recurring directive in this log is the answer to "what would enforcing break".
      console.warn('csp-violation',JSON.stringify(fields));
    }
  }catch{
    // A malformed report is not an error on our side and must not become one: answering
    // anything but 204 here would have browsers retry rubbish at us.
  }
  return new NextResponse(null,{status:204});
}
