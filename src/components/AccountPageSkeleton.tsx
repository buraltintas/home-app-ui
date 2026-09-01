type Props={className:'favorites-page'|'profile-page';eyebrow:string;title:string};

// Session checks must not flash a signed-out state or unrelated brand artwork. These
// blocks occupy the same reading area as the account content that follows, so the page
// stays visually stable while authentication is resolved.
export function AccountPageSkeleton({className,eyebrow,title}:Props){
  return <main className={`${className} account-page-loading`} aria-busy="true" aria-label={title}>
    {eyebrow&&<p className="eyebrow">{eyebrow}</p>}
    <h1>{title}</h1>
    <div className="account-loading-card" aria-hidden="true">
      <span className="account-loading-avatar"/>
      <span className="account-loading-line is-wide"/>
      <span className="account-loading-line"/>
    </div>
  </main>;
}
