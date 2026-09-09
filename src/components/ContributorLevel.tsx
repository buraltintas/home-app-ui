'use client';
import {useI18n} from '@/i18n/I18nProvider';

// Level 0 renders nothing at all. Somebody who has not written a review yet has not earned
// a badge, and labelling them "level 0" would turn an empty state into a demotion.
// The badge carries a name, and a name alone does not say where it sits in the ladder.
// "Kaşif" is only meaningful once you know it is the second of five.
const numbered:Record<string,(level:number)=>string>={
  tr:level=>`${level}. Seviye`,
  en:level=>`Level ${level}`,
  de:level=>`Stufe ${level}`,
  ru:level=>`Уровень ${level}`,
};

export function ContributorLevel({level,withNumber=false}:{level:number;withNumber?:boolean}){
  const {t,locale}=useI18n();
  if(!level||level<1)return null;
  const key=`level${Math.min(level,5)}` as 'level1'|'level2'|'level3'|'level4'|'level5';
  const badge=<span className="contributor-level" data-level={level} title={t('levelTitle')}>{t(key)}</span>;
  if(!withNumber)return badge;
  return <span className="contributor-level-group">{badge}<small className="contributor-level-number">{(numbered[locale]??numbered.en)(Math.min(level,5))}</small></span>;
}
