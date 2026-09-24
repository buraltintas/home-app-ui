// Crawlers that take a page and give nothing back.
//
// A name belongs here only when the crawl cannot put a store in front of a person: backlink
// and rank-tracking suites, which sell our own pages back to us as a report, and indexes for
// marketplaces and assistants with no readers in this market. Search engines and the agents
// that quote a source to somebody are how a shop gets found, and they are not on this list.
//
// It has two readers. robots.txt asks them not to come; the proxy holds the ones that come
// anyway to what they were told. One list, because a door that disagrees with the notice on
// it is worse than either alone.
export const UNWELCOME_CRAWLERS=[
  // Backlink and rank-tracking suites. They crawl the whole catalogue to sell it back as a
  // report; the three of them were 6,652 requests in a day.
  'SemrushBot','AhrefsBot','AhrefsSiteAudit','MJ12bot','DotBot','BLEXBot','SEOkicks',
  'SERankingBot','DataForSeoBot','Barkrowler','rogerbot','ZoominfoBot',
  // Indexes for marketplaces and assistants with no readers in this market, and training
  // crawls that quote nobody: 2,737 requests in the same day.
  'Amazonbot','PetalBot','Bytespider','ImagesiftBot','meta-externalagent','Applebot-Extended',
  'CCBot','Diffbot','omgili','Timpibot','Webzio-Extended','FriendlyCrawler',
];

// Whether a user agent names one of them. Matched case-insensitively on the whole string,
// which is how these agents identify themselves -- inside a longer line that also carries a
// version and a URL.
export function isUnwelcomeCrawler(userAgent:string|null|undefined){
  if(!userAgent)return false;
  const value=userAgent.toLowerCase();
  return UNWELCOME_CRAWLERS.some(name=>value.includes(name.toLowerCase()));
}
