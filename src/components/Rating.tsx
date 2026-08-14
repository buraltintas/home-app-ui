import {Check,Star} from 'lucide-react';
export function Rating({value}:{value:number}){return <span className="rating"><Star aria-hidden="true"/> {value.toFixed(1)}</span>}
export function Verified({label}:{label:string}){return <span className="verified"><Check aria-hidden="true"/> {label}</span>}

