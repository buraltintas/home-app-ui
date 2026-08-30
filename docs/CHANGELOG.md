# Changelog — web

What has changed and why, newest first. Written for whoever picks this up next.

**No secrets here.** No keys, addresses, codes or deployment values appear in this file.
Where a change was security-relevant it is described by its effect, never by repeating the
value involved.

---

## A placeholder that promised a button it could not deliver

- While Google's script loads there is no button, so a placeholder stood in its place --
  button-shaped, with "Preparing Google" written in it. The button that then arrives is
  Google's own, rendered by their script at their own size and weight, so the two never
  matched and the swap read as the screen twitching.
- The placeholder is a spinner now. It promises nothing but waiting, so there is nothing
  for Google's button to disagree with. The label survives for screen readers.

---

## The location step kept asking for something already given

- "Konumu doğrula" is an instruction, and it stops being true the moment the location is
  verified. The step renames itself to "Konum doğrulandı" and turns green once it is done.
- The "you are too far from this store" warning moved out of the first step and under the
  whole stepper. It is the reason nothing can continue, so it belongs where the eye lands
  after reading what the steps are, not tucked under a button that has just refused.

---

## Six screens, changed where they were asked to be changed

- **Save.** The control moved out of the row's top corner, where it covered the categories,
  to directly under the community figures -- and it says what saving is for. It draws a
  heart now, because the saved-stores page has always drawn one and a product should not
  have two symbols for one action. The score columns moved outside the link to make room
  for it: an anchor cannot hold a button, and none of those figures was ever a step on the
  way to opening the store.
- **Opening hours.** "Açık" and "Kapalı" now say which store and when -- "Mağaza şu an
  açık" -- and the line sits directly above the telephone number, because the two answer
  the same question in sequence: is it open, and can I ring first.
- **Standout stores.** "Bu ay" is gone; the period is named once, beside the section
  heading, as "son 1 ayda". Each store's label leads its row as a heading rather than
  sitting above it as a caption, and the band has its own ground so it stops merging with
  the categories above it.
- **Home page questions.** A tap no longer paints the row grey, which read as a mis-tap
  rather than as an answer opening. And the panel grows and shrinks over a third of a
  second instead of snapping: long enough to follow, short enough not to wait on. Browsers
  without `::details-content` keep today's instant open.
- **Contribution levels.** "Yeni Gezgin" and "Usta Rehber" take their capitals, and the
  list of thresholds is a table with named columns, in all four languages.
- **Your own reviews.** Each carries a delete control where the save control used to be --
  saving a store you have already reviewed is not an action anybody needs there. The date
  carries its year, and on your own reviews it sits under the rating rather than beside
  your own name, which you already know.

---

## The same category had two names, and only one of them was ours

- Reported again after the server started sending category names: the results list still
  said "Nevresim takımı" where the store's own page said "Yatak".
- The server fix was real but only covers stores we hold. A result the catalogue does not
  have yet still falls back to a list of names kept in the web app -- and that list had
  drifted from the database it was copied from years ago. Six of the thirteen names
  disagreed, and three categories added to the database since were missing from it
  altogether, so those stores showed a raw slug.
- The fallback is now copied from the database word for word, in all four languages. Two
  lists of the same thing drift; the only defence is that one of them is a copy.

---

## The play button came back when the video stopped

- The review page was reported fixed and the profile page was not. Waiting for the video
  to start covered one that never starts; it did not cover one that starts and then stops.
  A phone entering low power mode part way through pauses the loop, and a paused video is
  exactly what a browser draws its own play button on.
- Any stop -- pause, stall, error, end -- now hands the screen back to the still image,
  which is the one thing here that cannot fail.
- The video was also sized by a rule meant for a different layout: 320 wide and 16:9,
  inside a square frame. It hung out of the picture it was replacing. It takes the frame's
  size now.

---

## A loading screen you could press play on

- Reported as a different picture flashing up while the review page reloaded. It is the
  search overlay's mascot: a bare video with a poster, which is exactly what Safari
  answers by drawing its own play button when autoplay is refused -- in low power mode, or
  before the page has been interacted with. A loading indicator that offers a play button
  is not a loading indicator, and a reload paints the previous screen's last frame while
  it waits, which is where the flash came from.
- The profile and favourites loaders were fixed for this months ago and the search overlay
  was not, because the rule lived in one component instead of one place. The still-then-
  video behaviour is now a single shared piece both use: the still is drawn, and the video
  takes over only once it is genuinely running. A video that never starts is never shown.

---

## Suggestions appeared and disappeared on their own

- Reported with a screen recording: the strip under the search box, and its heading, kept
  blinking away and coming back with nothing the reader had done.
- The strip is keyed on where the searcher is, and the device keeps sharpening that. Every
  refinement -- five metres of it -- counted as a new neighbourhood, asked the question
  again, and blanked the strip until the answer came back. On a phone holding a fix that
  is exactly a blink, repeating.
- The key is now rounded to about a kilometre, because nobody changes neighbourhood by
  standing still, and while a genuinely new place is being asked about the previous list
  stays on screen instead of collapsing. These are suggestions, not results: a list that is
  a moment out of date is worth far more than a list that blinks.

---

## The second line of the search placeholder was cut in half

- The field grows to fit what is typed, and it measures that from the value. An empty
  field has no value, so a placeholder that wrapped onto a second line was drawn outside
  the box and the hidden overflow took the bottom off its letters.
- It now measures with the placeholder in place when the field is empty, and re-measures
  when the placeholder changes or the window is resized -- both change where the text
  wraps.

---

## Legal pages made of tables read smaller than the rest

- Reported on the privacy policy and the KVKK disclosure notice. Both are largely tables,
  and table text was set a point below the body text around it while the column headings
  were smaller again. Nothing about a table makes it less of the document, so it now reads
  at the same size. The trust page, built the same way, was fixed by the same change.

---

## "You are too far from this store" was a line of small red text

- It is not a validation message about a field somebody typed; it is the reason the step
  cannot continue, and the one thing on the screen they need to read. It is now framed and
  carries a warning mark.
- The distance in it is still read from the server's configured radius rather than written
  into the sentence, so the message cannot drift from the rule it describes.

---

## The Google button snapped into place inside the sign-in dialog

- The placeholder shown while Google's script loads and the button that replaces it were
  siblings in a grid, so they took a row each inside a box only tall enough for one. The
  visible row sat off-centre until the real button arrived and everything snapped. That
  snap, directly above "continue with email", is what was reported as a flicker.
- They are stacked in the same cell now, so one leaves and the other is already where it
  will stay.

---

## The "use my location" button grew to the height of the list beside it

- Reported with a screenshot: the button was several times its proper height and the list
  of matching places hung off the right edge of the panel.
- Two grid faults in the same panel. The column holding the button stretched to the height
  of the taller column beside it, and because it lays its own children out in a grid the
  spare height was handed to the button. And the panel's columns had a 220px minimum
  rather than a zero minimum, so once the content inside them needed more room than was
  left the whole grid overflowed its own card instead of shrinking.
- The column now packs its rows at the top, the columns may shrink to fit, and the panel
  stacks into one column below 860px rather than 600px -- between those two widths the
  two columns were technically side by side and practically unusable.

---

## Pressing back from a store returned to a search from three searches ago

- Reported from the live site: searched "yastık", opened a store, pressed the browser's
  back button, and landed in the results for "perde".
- The address bar was written once, on the way in from the homepage, and never again. Every
  search made on the discovery page since then left `?q=perde` sitting there. Coming back
  remounted the page, found that query, ran it again, and threw away the results the
  visitor had been looking at -- along with the reason they pressed back.
- A search now writes itself into the address bar. The URL never falls behind what is on
  screen: a refresh repeats the search that is showing, the link can be sent to somebody,
  and back from a store returns to the query that was open. Replaced rather than pushed,
  because back should mean "leave the search", not "walk through every wording I tried".
- The kept snapshot wins when it answers the same question the address bar is asking, so
  returning to a search does not fetch results we already hold.

---

## We told somebody their location was switched off while it was switched on

- Reported with a screenshot of macOS System Settings showing Location Services on and the
  browser enabled -- next to our message telling them to go and turn exactly that on.
- The message was wrong by construction. A browser reports three things: refused, no fix
  in time, or no position available. We were treating "no fix in time" as "the device is
  off", which is a diagnosis the browser gives us no grounds to make. It sent somebody to
  a settings screen that was already correct, and left the thing that would have worked --
  pressing the button again, or typing where they are -- unmentioned.
- Timeout now says what it means: the location did not arrive in time, try again or type
  your place. The genuinely unavailable case leads with the same two ways out and names
  the device setting last, as a possibility rather than a verdict. Four locales.
- Six seconds was also too short. A desktop browser asked for the first time after a wake
  routinely takes longer, and the panel already offers a place to type instead, so the
  cost of waiting is a slower failure rather than a worse one. Ten seconds now.
- An unavailable position is retried once, automatically, after a short pause. The system
  provider fails for a moment -- waking, changing network, a scan that found nothing -- and
  the same request a breath later succeeds. Asking the visitor to discover that by pressing
  the button again is work we can do for them.

---

## What a store page tells a search engine about itself

- Search Console reports 904 pages as "discovered, currently not indexed" against 48
  indexed. That is a crawler deciding a few thousand near-identical pages are not worth
  its time, and what separates one store page from the next is the facts on it.
- The machine-readable copy was missing facts the page already showed a reader: the
  telephone number, the photograph, the store's own website, and the hours it is open. All
  four are now in the Store record.
- Opening hours are written as periods against the day they start on, which is how the
  vocabulary reads a shift that runs past midnight. They appear as searches refresh each
  store's provider data; nothing is fetched to fill them in.
- The community rating stays gated on community reviews, as before. The provider's rating
  is not ours to publish as our own.

---

## The loading mascot swapped itself, and sometimes asked to be pressed

- Reported: a different image appears for a moment while the review page reloads.
- The loader draws a still on the server, because a server has no media query to read, and
  the browser then replaced it with the video once it decided motion was allowed. That
  replacement is the picture changing under the reader for no reason they caused.
- Worse, in the screenshot the video had not started -- an iPhone in low power mode refuses
  to autoplay -- so Safari left its own play button on the poster. A loading indicator
  looked like something you were supposed to press.
- The still is now what is drawn, and the video takes over only once it is actually
  running. Nothing changes unless there is something better to change to, and a video that
  never starts is never shown. Measured both ways: playing, the still hands over; blocked,
  the still stays and no control ever appears.

---

## The sign-in dialog rebuilt its own Google button

- The script's load handler marked the button unready and ready again in the same breath,
  to force it to be built once the script had landed. It also tore the button down and
  built it again every time it fired -- a flicker in the one part of that dialog that draws
  the eye. Clearing the initialised flag is enough on its own.
- Measured the dialog through a load: the heading, the slot and the dialog itself hold
  their positions to the pixel, so what remains is the placeholder handing over to the
  button. Reopening four times in one page still produces the button every time.

---

## Categories named twice, differently

- The results list translated category slugs from a list held here; the store's own page
  showed names translated in the database. They had drifted -- "bedding" read "Nevresim
  takimi" in the results and "Yatak" on the store's page.
- The server now names them, from the same translations the store's page reads. The list
  here stays only as a fallback for a result that is not in the catalogue and so has no
  page to disagree with.

---

## Whether the shop is open, in the list

- A result now says Open or Closed, with today's hours beside it, for stores whose hours
  the provider publishes. It is the question somebody asks about a shop they are deciding
  whether to travel to.
- It costs nothing: the hours ride along on the provider request the search was already
  making and already paying for.
- Today's line is picked in the store's own time -- the provider writes the week starting
  on Monday, a JavaScript weekday starts on Sunday, and at 23:00 in Antalya it is already
  tomorrow in Auckland. Verified on a Saturday: the Saturday line was the one shown.
- A store that publishes no hours gets no line. Silence is not the same as closed and
  guessing would be worse than saying nothing.

---

## Clearing the search box, and the letters that were being shaved

- The placeholder's line-height was 1.35, which leaves nothing under a line, so the tails
  of a wrapped second line were cut off by the hidden overflow that lets the field grow.
  1.5 and a little padding under it.
- A clear button at the end of the field. On a phone there was no way out of a long wrong
  query but backspace: holding a letter opens the accent menu rather than repeating it,
  which is the operating system's decision and not ours to override. The button is the
  remedy that is actually available.
- It shares the field's grid cell rather than being a fourth item in the form's grid --
  the form is three columns wide and two on a phone, so a loose item lands in whichever
  cell comes next. And `.search-form button` was claiming it too, which had made it 120px
  wide and black: the submit is the form's own child, the clear button belongs to the
  field, and the selector now says so.

---

## The home page no longer opens with other people's reviews

- Asked for: take the reviewed stores off the home page, and put expandable headings in
  their place.
- Somebody arriving at the home page has not chosen a store yet, so a stream of reviews of
  stores they have never heard of asks them to care before they have a reason to. What is
  there instead is the search, and under it the questions people ask before trusting a
  place they have not used.
- The questions are read from the about page rather than restated, so there is one wording
  in four languages and no second copy to fall out of date. Native details/summary: it
  opens without JavaScript, it is keyboard operable and announced on its own, and it has
  no animation to suppress for anybody who asked for less motion. Verified at 375 and
  1280 -- nine questions, 44 px targets, no horizontal overflow.
- The feed component and the server read behind it are gone rather than left unreferenced.
  Nothing else used them, and dead code that still looks alive is worse than none.

---

## A favourite with no review beside it, and a Google column that moved

- Two follow-ups on the result list, one of them a regression I introduced.
- A store with favourites but no review showed neither the badge's counterpart nor the
  favourites. The count was being hidden because the review count gated the whole column,
  but a favourite is a real thing somebody did and it is the only signal such a store has.
  It now appears on its own line under the badge. The badge still answers "has anybody
  reviewed this"; the count answers "has anybody cared".
- Google's column sat beside the community column on some cards and below it on others.
  That was mine: the row was a wrapping flex, and making the community column's text
  longer pushed Google onto a second line for exactly the stores with no review. Measured
  on a phone with the old rule, the three storeless-of-reviews cards all wrapped and the
  reviewed one did not -- which is precisely the "some on the right, some underneath" in
  the report. Two sources, two columns, now a grid that cannot wrap.

---

## Saving a store from the list

- The list is where somebody is still choosing, so the control is an icon at the row's top
  right: 44x44, outside the card's link because an anchor cannot hold a button, and
  secondary rather than primary because saving is not what the row is for.
- Pressed while signed out, it rolls its optimistic state back, opens the contextual
  sign-in, and completes the save afterwards rather than dropping what was asked for.
- Which stores are already saved is not carried by the search response, so it is read once
  from the same endpoint the favourites page uses. A store beyond that page of favourites
  will show as unsaved until the search results carry the flag themselves.

---

## The review page opened a hundred pixels down

- Reported: opening a store's review page from low on the store page left the top of the
  review page off screen, and you had to scroll up by hand to see it.
- A reset already existed and ran on mount, and it worked locally, which is why this looked
  fixed. It was not. The route paints a short loading state first, so a browser arriving
  from far down the store page clamps the old offset to the bottom of that short page
  rather than the top; when the content finally arrives and the page grows tall, nothing
  moves it back. In development the loading state is quick enough to hide the whole thing.
- The reset now also runs once the page has its real height. Measured on a production build
  with the same click from the same scroll position: before, the page settled at 103 px and
  stayed there -- the same number production was showing; after, it settles at 0.

---

## A store's name was set in headline type

- Reported: on the review page the store name is far bigger than it should be, and it
  crowds the label above it and the address below.
- Its selector had been grouped with the marketing headings, so a shop called Yataş was
  drawn at the size of "Gerçek mağazalar. Gitmeden önce." -- 42 px on a phone, with a
  line-height tighter than the type size and no margins at all, which is why its
  neighbours sat flush against it. A store's name is data the page is showing, not a
  headline the page is making, so it no longer takes the hero treatment.
- Measured on a phone: 42 px to 26 px, and the gaps above and below from 0 px to 10 px
  and 14 px.

---

## Pages carrying a note read smaller than pages without one

- Reported: the text on the privacy and KVKK pages is smaller than it should be.
- The pages are identical in structure; what differs is that these two carry note blocks,
  and a note was set three points below the prose around it. A note is body text that
  happens to sit on a tint -- the tint is what marks it, so the shrinking only made it
  harder to read. It now matches the body.

---

## Contribution levels, as a list

- The levels were a single sentence with five thresholds inside it. They are a list, so
  they are now a list, in all four languages. Thresholds checked against the backend that
  awards them rather than copied: 1, 5, 15, 40, 100.
- "Bu seviye para ... değildir" became "puan": nobody suspects a contribution level is
  money, but plenty would reasonably wonder whether it is a score.
- Removed a dead translation key for a distance warning that no code has shown since the
  message began naming the real radius.

---

## "New here" moved on its own

- Reported: some stores in the result list carry "Boşa Gezme!'de yeni" and some do not,
  and neither has a review. The badge was not reading the review count. It was reading
  whether the store existed in our catalogue at all -- our bookkeeping, and none of a
  reader's business.
- That made it move by itself. A store arriving from the provider had no catalogue record,
  so it showed the badge; searching brought it into the catalogue; the next search showed
  "0 değerlendirme · 0 favori" instead. Nothing about the store had changed, and the report
  named this exactly: the same store searched twice should not look different.
- The badge now depends on the only thing a reader cares about -- whether anybody here has
  reviewed the store. The community column keeps its place either way, so the two sources
  stay side by side and comparable, and "İlk deneyimi sen paylaş" sits under the badge
  where the rating would be. The first review replaces both with the rating and the counts.
- While in that line: "1 favoriler" is not Turkish. A number never takes the plural, and
  the navigation label was being reused as a counting unit -- a different word in all four
  languages.

---

## Google worked the first time and never again

- Reported: sign-in works once or twice, then the button stops arriving and the dialog sits
  on "Google hazırlanıyor…" until it gives up. It looked like the provider throttling us.
  It was not. It was ours.
- `next/script` keeps a cache of the scripts it has already loaded, keyed by the `id` given
  to it. On a second mount it finds the id, bails out of loading, and **does not call
  `onLoad` again** -- which the source documents in as many words. The dialog unmounts when
  it closes, taking with it the only state that recorded whether the script was ready, so
  every open after the first waited for a callback that was never going to fire.
- `onReady` is the callback `next/script` documents for exactly this case and it fires on
  both paths, so it is now listened for as well. The dialog also starts ready when the
  script's object is already on the page, so the answer no longer depends on any one
  framework callback.
- Measured before and after, four opens in a single page without reloading: before, the
  first open produced the button and the second, third and fourth produced a spinner that
  never resolved; after, all four produced the button.

---

## The footer's empty space was a link

- Reported from a phone, with the blue line drawn in the empty space to the right of "Boşa
  Gezme! nedir?": pressing there navigates as though the words had been pressed.
- A footer link is a flex box inside a grid column, so it stretched to the whole column
  while its words took a third of it. Measured on the live site: the box ends at 372px and
  the text at 154px, and everything between them was the link. On a phone the column is the
  width of the screen, so most of a footer row was a target nobody could see.
- The 44px height is the touch target and stays; the width now fits the words. Verified
  against the live markup: past the text the point belongs to the list item, not the link,
  and the height is unchanged.
- An earlier fix corrected the same defect in the legal pages' table of contents. This one
  is the footer -- the same mistake in a second place, which is worth saying plainly
  because the first fix was reported as not working, and it had worked; it was simply not
  where the reader was pointing.

---

## Waiting for Google had no end

- Reported after the previous fix: the placeholder appeared and then stayed, spinning. The
  placeholder was honest about what it was doing and dishonest about how long it would do
  it -- Google's script can fail in ways that never report themselves, and the spinner said
  "still coming" for as long as the dialog stayed open.
- Measured, with the script blocked and with the script left hanging. Blocked produced both
  messages at once, "Google hazırlanıyor…" spinning underneath "Google ile giriş şu anda
  kullanılamıyor", which tells a reader nothing except that we do not know either. Hanging
  produced the spinner and nothing else, for ever.
- Waiting now ends after ten seconds and says plainly that Google is unavailable, with the
  email button already underneath it. Only one of the three states is ever on screen. A
  late arrival still wins: if the script turns up after the deadline the real button
  replaces the message.

---

## A heading that changed by itself

- Reported: the line under the search bar is sometimes "Yakınında şunlar aranmış" and
  sometimes "Bu mevsim akla gelenler" -- which is right?
- Both are. The heading names where the phrases beneath it came from: the reader's own last
  searches, then what the neighbourhood has been searching, then the season. The three
  sources are right; the timing was not. Two of them arrive over the network and the
  seasonal list does not, so the heading was chosen before the other two had answered --
  the season appeared first and was then swapped out under the reader, with nothing they
  did to cause it.
- The strip now waits until both sources have answered, counting a refusal as an answer,
  and shows a placeholder until then. The heading is chosen once and does not move.

---

## Closed stores carry the provider warning wherever they appear

- Search results and store details now read Google's explicit business status and show a
  restrained but prominent warning for a temporary or permanent closure. The warning
  points back to Google Maps before somebody travels instead of presenting an old review
  date as proof that a quiet store has closed.
- The signal travels in the same Google block on both surfaces, so a store cannot be
  flagged in a list and lose the warning when opened.

## Legal pages keep their reading size and honest link targets

- Long legal documents now state their body and list size explicitly instead of inheriting
  a smaller surrounding scale on some routes. Privacy, disclosure and the rest of the
  shared legal-document family therefore keep the same readable body rhythm.
- A table-of-contents row no longer stretches across the empty width of its grid. Only the
  visible linked heading is clickable, so pressing blank space beside it does not navigate
  unexpectedly.

## Three returned cards needed the last decision, not a new design

- The visit-distance rejection now explains both blocked outcomes—visit verification and
  review creation—and states the live configured maximum distance. The copy deliberately
  says **at most**, because saying **at least** would tell people to move farther away from
  the store while the verifier requires the opposite.
- Monthly standout stores no longer bury the review count inside the address. The selected
  quiet treatment gives the monthly count its own clay-weighted line below the place, so it
  reads as the reason for the recommendation without covering the photograph or crowding
  the mobile row.
- The location-explanation heading is a question and now carries its missing question mark.

## The Google button that was not a button yet

- Reported: "continue with Google" does nothing on the first attempt, and reloading once
  fixes it. It was not Google and it was not the browser. While Google's script is on its
  way there is no button to press, and what stood in its place was a disabled copy of the
  real one carrying the real label. On a cold cache that copy is on screen for about two
  seconds: people saw "Google ile devam et", pressed it, nothing happened. A reload hits
  the cached script, the real button is there immediately, and it works -- which is the
  whole of "it only fails the first time".
- A disabled control that is indistinguishable from a working one is worse than no control:
  it gives no cursor, no message and no reason. The placeholder now reads as work in
  progress -- muted, a spinner, no border, nothing to aim at -- and says what it is waiting
  for. It vacates the moment the real button exists rather than when the script merely
  reports itself loaded.
- It is also a sibling of Google's container now instead of a child of it. Google replaces
  the contents of that node, and React must not be holding anything inside it.

## A standout store was a name and a number

- The two monthly standouts were the only place a store appeared without its photograph.
  Read as a name and a metric they were a statistic; with the store's own picture they are
  a place somebody could walk into, which is the whole premise of the product.
- The same photograph, chosen the same way as in the result list, with the store's initial
  standing in for one that has none. The heading lost "bu ay" -- the month is already in
  the metric beside it, and saying it twice made the card read like a report.

## Back did not mean "the previous step" on the review page

- Reported from Safari: pressing back on the review page did not return to the previous
  page. The four steps of the review wizard were component state, so the browser had no
  record that a person had moved through them at all. Back was therefore answered by the
  only entry that existed, and the half-written review went with it.
- The step now lives in the address and every forward move pushes a history entry, so the
  back button and the iOS edge swipe walk the wizard backwards one step at a time and only
  leave the flow from the first step. The in-page **Geri** buttons go through history too,
  so both kinds of back agree instead of disagreeing.
- Evidence of the visit is what unlocks the rest of the flow, so a step claimed by the URL
  is honoured only once that evidence exists; a reload or a shared link is repaired back to
  the first step on entry. Step one gained a **Devam** button, because back can now land
  there after the visit has already been verified.
- Not yet confirmed as the whole of the report: the exact case was not reproducible in the
  Safari engine while signed out, from the store page, on desktop and iPhone viewports,
  with and without a locale prefix, and opening the link directly. What is fixed here is
  the defect that is provable.

## A position outlived the device that produced it

- Reported: the phone's location services are off, the browser permission is still granted,
  and the site keeps finding you. It did, and the reason was a single ignored error. The
  background watch that refreshes the position had `()=>undefined` as its failure handler,
  so every failed read was discarded and the saved copy went on answering as though the
  device were still vouching for it.
- A refusal or an unavailable device now clears the saved position and tells the screen,
  which drops what it is showing. **A timeout does not** — a fix indoors can simply take too
  long, and treating slowness as withdrawal would throw away a perfectly good location every
  time somebody walks into a shop.
- Both directions are checked: device off clears it, timeout keeps it.


## The store's own website, and a button that sits in its frame

- Store pages show the shop's website where Google publishes one. Not a social account:
  Google has no such field — checked, asking for one is a 400 — and guessing a handle from
  a shop's name would put somebody else's Instagram on the page. There are seven different
  businesses called "Taç" in this catalogue.
- **`.button` had no vertical centring.** On a `<button>` the browser does it; on an
  `<a class="button">` it does not, so the label sat high in a 48px box. Reported on the new
  "add the first one" link, and it would have happened to every future link styled as a
  button. Fixed on the class rather than the instance.
- Google sign-in is set to use FedCM. Nothing in this code changed and it stopped working,
  which points at the browser: Chrome's removal of third-party cookies breaks the old popup
  credential flow, and FedCM is Google's replacement. Stated plainly because it could not be
  verified from here — the button renders inside Google's own iframe and its popup does not
  open in an embedded browser.


## Consent is checked where the location is used, not where it changes

- Third attempt at the same report, and the first two were the same mistake in different
  shapes: the check lived in a watcher on one screen. A permission revoked while that screen
  was closed produced no event to hear, so a saved copy was still served — reported as
  "close it, open it, close it again, and it still finds me".
- The gate now sits in `requestPosition`, which everything that needs a position goes
  through, so it covers every screen including ones written later. The saved discovery
  location is re-checked on mount as well, because a permission taken away while the app was
  closed leaves no event behind either.
- A `prompt` state clears the saved copy but does **not** refuse the request. Resetting a
  site's permission leaves it there, and the browser is saying it will ask again — refusing
  would answer a question the person was never given the chance to answer. Only `denied`
  produces the blocked guidance.


## A store with no photograph now asks for one

- Roughly one store in twelve has none, and not because the fetch failed. Checked against
  Google directly, through both Place Details and Text Search: for these places the Places
  API returns zero photos. Google Maps shows pictures from sources it does not license out
  through the API, so there is nothing on our side left to try.
- What was there was a full-width grey block with the store's initial and the words "no
  photo" — stating the problem and doing nothing about it, at the top of the page. It now
  says no photograph exists yet and offers the one thing that fixes it: a link straight into
  writing a review of that store, which is where a photograph comes from.
- Forty pages that were dead space are now forty invitations, and the mechanism is the one
  already built — a community photograph outranks the provider's.


## Two fixes that had not actually been verified

- **The Google Maps link did not work.** It used `place/?q=place_id:…`, which is the tidy
  form and answers "no results found" often enough to be useless. It is Google's documented
  `search/?api=1&query=<lat,lng>&query_place_id=<id>` now, with the coordinates carrying the
  link when the id cannot. Shipped the first time on a reading of the markup rather than a
  click; this one was opened and checked.
- **Removing the location permission still did not forget the location.** The previous fix
  watched for the permission becoming `denied`. Resetting a site's permission in Chrome puts
  it back to `ask` — `prompt`, not `denied` — so the ordinary way of withdrawing access went
  unnoticed. Anything other than `granted` now counts as withdrawn. Verified in both states.


## Taking the location permission away now means something

- Reported from the live site: revoke the permission, and the site still knows where you
  are. It was true. Nothing read the device again — the browser refuses — but two copies
  were kept in the visitor's own storage: the last fix, for six hours, and the chosen
  discovery location, indefinitely. We were answering from those.
- From the outside that is indistinguishable from continuing to track somebody who asked us
  to stop, and the only honest reading of a withdrawn permission is that we stop using what
  it gave us. Both device-derived copies are dropped the moment the permission goes,
  watched live through the Permissions API and checked again on load — a person may have
  revoked it in another tab, or yesterday.
- A place somebody typed themselves is left alone. That was never the device's to give, so
  revoking the device permission says nothing about it.


## A way through to Google, on purpose

- Store pages and result rows carry a **See on Google Maps** link beside the Google block.
  Deliberately a link of its own rather than making the rating clickable: a clickable rating
  gets pressed by accident, so somebody reading a number ends up on another site without
  meaning to. This gets pressed on purpose.
- No directions link on the result row. A list is where somebody is still choosing;
  directions belong on the page for the store they chose. The Google link is different — it
  answers "is this place real, is it open", which is a question people ask while deciding.


## The location error moved to where people look

- It used to sit at the bottom of the panel, under the button that had just appeared to do
  nothing. People pressed "use my location", saw no change, and never read the sentence
  explaining why. It leads the panel now, full width, and carries a **Try again** button —
  previously somebody who fixed their browser setting came back to the page with no way
  forward except guessing.
- When the browser has *blocked* location — the one case where "press Allow" is wrong
  advice, because it will never ask again — the box also shows where the address bar keeps
  its lock. Drawn rather than screenshotted: a screenshot of Chrome stops being true the
  next time Chrome moves something. Shown only in that case; offered when the browser
  simply has not asked yet, it sends somebody hunting for a lock that will do nothing.
- `npm run build` was failing on the type-check step with a heap exhaustion, before any of
  this and unrelated to it — the project has outgrown Node's default heap. Both `build` and
  `typecheck` now ask for more, so the check the contributing rules require can actually be
  run.


## Documentation rule

- `AGENTS.md` now states what this file is for and when it must be written: every change a
  person would want explained later, newest first, in the same commit as the change. Not a
  list of files touched — what changed and why it was worth changing, because "fixed the
  search" tells the next person nothing. The same rule is in the API and mobile
  repositories, each pointing at the documents that are load-bearing there.


## Admin panel, paid placement, contributor levels

- **Admin panel** at `/admin`, in its own route group with its own root layout — no site
  header, footer or locale provider, because administration is a different job from
  browsing and sharing the chrome makes it easy to forget which you are looking at. Tabs:
  overview, searches, stores, users, reviews, audit log.
- Kept out of search in three places, since one is easy to undo by accident: page metadata
  (`noindex`), a `robots.txt` disallow, and an exclusion in the proxy matcher so it is
  never locale-rewritten.
- Access is decided by the backend, not by hiding UI. A visitor without permission gets the
  same message whether they are signed out or simply not an administrator, because the API
  answers 404 rather than 403 and repeating that distinction here would give it away.
- **Paid placement** — promoted stores lead results in the searcher's own city and carry a
  visible "Öne çıkarılmış" label. The label is not decoration: `/about` and `/terms` state
  that paid placement is marked wherever it applies, and shipping the ranking without the
  badge would make a published document false.
- **Contributor levels** — five tiers by published review count, shown next to the author
  in the feed and on profiles. Level 0 renders nothing rather than announcing a demotion.

## Legal and trust pages

- Twelve documents in Turkish, English, German and Russian, plus a legal hub and a grouped
  footer. Content is held as data so all four languages fill the same sections in the same
  order; a translation that quietly gains or loses a clause is a different contract.
- `src/lib/legal-facts.ts` is the single source for company and contact details, with
  unknown values as `null` and no placeholder strings anywhere.
- The sign-in dialog separates contract acceptance from the privacy notice rather than
  merging them into "by continuing you agree to everything", and bundles no marketing
  consent.
- Three places where the honest text differs from a template: the location page does not
  claim precise coordinates go unstored, because a location you save is stored precisely;
  the deletion page states that the email address outlives deletion and why; the moderation
  text describes an inbox a person reads, because that is all that exists.

## SEO and locale routing

- Every page now states its own canonical. The root layout previously set `canonical:'/'`
  and, because metadata cascades, every store, review and profile page inherited it and
  declared itself a duplicate of the homepage.
- Locale moved from a cookie into the URL. Turkish stays unprefixed and canonical;
  `/en`, `/de`, `/ru` are real addresses. Googlebot sends no cookies, so previously every
  crawl saw Turkish and three finished translations were unreachable to search engines.
- Sitemap enumerates stores with real `lastmod` in every language; sign-in-only routes are
  excluded and carry `noindex`. It went from five URLs to several hundred.
- Structured data: `Organization`/`WebSite` on the homepage, `Store` with breadcrumbs on
  store pages, `Review` on reviews, `WebPage` on legal documents. `AggregateRating` is built
  only from community reviews — republishing another site's ratings as your own is what the
  guidelines forbid, and a store with no reviews emits no rating rather than a zero.
- Share previews: a purpose-built 1200×630 image at `/og`, and descriptions that end at a
  sentence instead of a raw character slice.
- The homepage feed is read on the server, so the first response carries real reviews.

## Interface fixes

- Profile and favourites showed the signed-out screen before the session resolved, so a
  signed-in visitor was briefly told they had no favourites. Both now show a loading state.
- The header treated any failed session read as being signed out, so one failure during a
  token refresh blanked the avatar until a full page reload. Only a definitive 401 counts
  now, and the session is re-read on navigation.
- The footer floated mid-page on short pages; the page column now fills the viewport.
- The review page's manual location panel had no CSS at all and rendered as unstyled text.

## Search

- Results are ordered near to far, so searching without a location now asks for one instead
  of running a query that cannot tell a nearby store from a distant one.

---

## Known follow-ups

- Store slugs created before Turkish letters were folded are still mangled; they resolve
  correctly but do not read well. A backfill would change those URLs.
- ISR is not enabled on store pages: they carry per-viewer state (favourites, likes), so
  caching them would show one visitor another's state.
