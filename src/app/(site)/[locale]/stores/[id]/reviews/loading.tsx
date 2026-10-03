// R86: this page's own stand-in while it is read. Without it the nearest boundary was the
// store page's, so the tap on "Tüm değerlendirmeleri gör" showed a store page's skeleton --
// a hero and a title -- before the reviews arrived. The shapes are the page's own, in its
// order and at its sizes, so nothing moves when the real page replaces them.
export default function StoreReviewsLoading(){
  return <main className="store-reviews-page" aria-busy="true">
    <div className="store-reviews-loading" aria-hidden="true">
      <span className="is-back"/>
      <span className="is-eyebrow"/>
      <span className="is-title"/>
      <div className="is-tiles"><span/><span/></div>
      <div className="is-tiles"><span/></div>
      <div className="is-cards"><span/><span/></div>
    </div>
  </main>;
}
