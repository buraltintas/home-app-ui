'use client';
import {useI18n} from '@/i18n/I18nProvider';

// Level 0 renders nothing at all. Somebody who has not written a review yet has not earned
// a badge, and labelling them "level 0" would turn an empty state into a demotion.
export function ContributorLevel({level}:{level:number}){
  const {t}=useI18n();
  if(!level||level<1)return null;
  const key=`level${Math.min(level,5)}` as 'level1'|'level2'|'level3'|'level4'|'level5';
  return <span className="contributor-level" data-level={level} title={t('levelTitle')}>{t(key)}</span>;
}
