import ExcelJS from 'exceljs';
import {NextRequest} from 'next/server';
import {cell,exportableTables,loadTable} from '@/lib/admin-export';

// The export route sits inside the admin group and reads through the same authorised
// backend calls, so it cannot become a way to reach admin data without being an admin: an
// unauthorised session gets 404 from the API and this returns 404 too.
export async function GET(request:NextRequest,{params}:{params:Promise<{table:string}>}){
  const {table}=await params;
  if(!exportableTables.includes(table))return new Response('Not found',{status:404});

  const q=request.nextUrl.searchParams.get('q')??undefined;
  const data=await loadTable(table,q);
  if(!data)return new Response('Not found',{status:404});

  const workbook=new ExcelJS.Workbook();
  workbook.created=new Date();
  const sheet=workbook.addWorksheet(data.title);
  sheet.columns=data.columns.map(column=>({header:column.label,key:column.key,width:Math.min(46,Math.max(14,column.label.length+8))}));
  for(const row of data.rows){
    sheet.addRow(Object.fromEntries(data.columns.map(column=>[column.key,cell(row[column.key],column.key)])));
  }
  sheet.getRow(1).font={bold:true};
  sheet.views=[{state:'frozen',ySplit:1}];
  sheet.autoFilter={from:{row:1,column:1},to:{row:1,column:data.columns.length}};

  const buffer=await workbook.xlsx.writeBuffer();
  const stamp=new Date().toISOString().slice(0,10);
  return new Response(buffer as ArrayBuffer,{
    headers:{
      'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':`attachment; filename="bosagezme-${table}-${stamp}.xlsx"`,
      // An export of live data must never be cached by anything in front of it.
      'Cache-Control':'no-store',
    },
  });
}
