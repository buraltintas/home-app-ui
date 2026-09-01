// Store pages are no longer prefetched from a results list -- thirty renders for a page
// somebody opens one of, or none, is not a trade worth making -- so the wait after a tap
// is now visible. This stands in for the page while it is read: the same shapes in the
// same places, so nothing jumps when the real thing arrives.
export default function StoreLoading(){
  return <main className="store-page store-page-loading" aria-busy="true">
    <div className="store-loading-hero" aria-hidden="true"/>
    <div className="store-loading-body" aria-hidden="true">
      <span className="store-loading-line is-title"/>
      <span className="store-loading-line is-wide"/>
      <span className="store-loading-line"/>
      <span className="store-loading-block"/>
    </div>
  </main>;
}
