import {getServerI18n} from '@/i18n/server';
import {HomeSearchBar} from './HomeSearchBar';

// The top of the home page: what this is, and the one thing to do with it. Rendered on the
// server -- there is nothing here that depends on who is looking, so there is no reason for
// it to arrive empty and fill in afterwards.
export async function HomeIntro(){
  const {t}=await getServerI18n();
  return <header className="feed-intro">
    <div className="intro-copy"><h1>{t.feedTitle}</h1><p>{t.feedIntro}</p><HomeSearchBar/></div>
  </header>;
}
