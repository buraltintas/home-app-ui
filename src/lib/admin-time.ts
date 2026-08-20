import 'server-only';

// Admin pages render on the server, and the server runs in UTC. Formatting a timestamp
// there with toLocaleString produces UTC values wearing a Turkish label -- a message sent
// at 09:13 was shown as 06:13, which is not a rounding error but the wrong answer.
//
// The panel is operated from one place, so it states the zone rather than guessing it. This
// is the same zone the backend uses for reporting day boundaries; the two have to agree or
// a day's figures and the rows behind them will not line up.
export const ADMIN_TIME_ZONE='Europe/Istanbul';

export const adminDateTime=(value:string)=>new Date(value).toLocaleString('tr-TR',{
  timeZone:ADMIN_TIME_ZONE,dateStyle:'short',timeStyle:'short',
});

export const adminDate=(value:string)=>new Date(value).toLocaleDateString('tr-TR',{
  timeZone:ADMIN_TIME_ZONE,
});
