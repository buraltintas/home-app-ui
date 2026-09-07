type Props={className:'favorites-page'|'profile-page';eyebrow:string;title:string};

// Session checks must not flash a signed-out state or unrelated brand artwork. These
// blocks occupy the same reading area as the account content that follows, so the page
// stays visually stable while authentication is resolved.
export function AccountPageSkeleton({className,eyebrow,title}:Props){
  // Session state resolves quickly, but anything visible here becomes a different page
  // for that instant on reload. Reserve the final page's space without drawing a second
  // title, progress mark, empty state or sign-in prompt; assistive technology still gets
  // an honest loading announcement.
  void eyebrow;
  return <main className={`${className} account-page-loading`} aria-busy="true" aria-label={title}>
    <span className="sr-only">{title}</span>
  </main>;
}
