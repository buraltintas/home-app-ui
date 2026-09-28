'use client';

import {useState} from 'react';
import {emailProblem,type EmailProblem} from './email';
import type {TranslationKey} from '@/i18n/dictionaries';

// What is wrong with an address, and when to say it.
//
// The answer is known on every keystroke; the saying of it waits until the field is left
// alone. A message that appears on the third character of an address nobody has finished
// typing is telling somebody they are wrong while they are still in the middle of being
// right, and it is on screen for the whole time they type the rest.
//
// Picking the field back up hides it again, so the correction is made in quiet too.
//
// Leaving the field is not the only way of being finished with it, though. Pressing send
// while still inside it is the other one, and that is the case the form has to say out loud
// -- see `reveal`.
export function useEmailCheck(value:string){
  const [settled,setSettled]=useState(false);
  const fault:EmailProblem=value.trim()===''?null:emailProblem(value);
  return {
    // What is wrong, whether or not it is being shown. The form still uses this to decide
    // whether it may send.
    fault,
    // What to show: only once the field has been left.
    shown:settled?fault:null,
    // Say it now. A form calls this when send is pressed with the cursor still in the
    // field: the address is finished as far as its author is concerned, so the answer is
    // owed even though the field has not been left.
    reveal:()=>setSettled(true),
    // Spread onto the input.
    field:{onFocus:()=>setSettled(false),onBlur:()=>setSettled(true)},
  };
}

// The message for a fault, in the reader's language. One wording, wherever an address is
// asked for -- the sign-in dialog, the feedback form, the store correction sheet.
export function emailFaultMessage(fault:EmailProblem,t:(key:TranslationKey)=>string){
  if(!fault)return '';
  return fault.kind==='tld'?t('emailEndingUnknown').replace('{x}',fault.tld):t('emailFormatInvalid');
}
