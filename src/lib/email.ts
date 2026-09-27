import {isKnownTld} from './tlds';

// What is wrong with an address, in the terms somebody can act on.
//
// The form asked only whether the text contained an "@" and a dot, which lets
// guven.yilmaz@gmail.don through -- and an address with a wrong ending fails silently: the
// message is filed, the form says thank you, and the reply bounces somewhere nobody is
// watching. On a page whose whole purpose is to be answered, that is the failure worth
// catching, so the ending is checked against the list of endings that exist.
//
// Everything here is about the shape of the address. Whether the mailbox behind it exists is
// not knowable from a browser; only sending to it can tell us that.
export type EmailProblem={kind:'format'}|{kind:'tld';tld:string}|null;

// The characters an address may use before the @, kept deliberately wide: the rules allow
// more than most people expect, and refusing a valid address is worse than accepting an
// unusual one.
const LOCAL=/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
const LABEL=/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;

export function emailProblem(value:string):EmailProblem{
  const address=value.trim();
  const at=address.lastIndexOf('@');
  if(at<1||at===address.length-1)return {kind:'format'};
  const local=address.slice(0,at);
  const domain=address.slice(at+1);
  if(local.length>64||local.startsWith('.')||local.endsWith('.')||local.includes('..')||!LOCAL.test(local))return {kind:'format'};
  // Through the URL parser, so a domain written in its own alphabet is folded to the ASCII
  // form the list is published in rather than being turned away for the alphabet it uses.
  let host='';
  try{host=new URL(`http://${domain}`).hostname;}catch{return {kind:'format'};}
  const labels=host.split('.');
  if(labels.length<2||host.length>253||!labels.every(part=>LABEL.test(part)))return {kind:'format'};
  const tld=labels[labels.length-1];
  // A one-letter ending cannot exist and a numeric one is an address, not a name; both are
  // typos rather than unknown endings, and saying "there is no .d" reads as pedantry.
  if(tld.length<2||/^[0-9]+$/.test(tld))return {kind:'format'};
  // Checked folded, reported as typed: "there is no .xn--ky-fka" is true and unreadable, and
  // the person has to find the ending they wrote in the message that names it.
  if(!isKnownTld(tld)){
    const written=domain.split('.').pop()??tld;
    return {kind:'tld',tld:written.toLowerCase()};
  }
  return null;
}

export function emailLooksRight(value:string){return emailProblem(value)===null;}
