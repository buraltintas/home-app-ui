# Changelog — web

What has changed and why, newest first. Written for whoever picks this up next.

**No secrets here.** No keys, addresses, codes or deployment values appear in this file.
Where a change was security-relevant it is described by its effect, never by repeating the
value involved.

---

## Two rules four lines apart, and the later one was winning

The magnifier beside "Aradığın mağazayı bulamadıysan" was asked to be made bigger, was made
bigger, and did not change. Both are true: the size was raised from 24px to 32px in a rule
that four lines further down the same file was overruled by `.add-store h2 svg{width:18px}`.
The icon had been 18px the whole time, including when it was reported back as 32.

There is one rule for that mark now, and it is 40px. The lesson is not about this icon:
a declaration can be edited, committed and deployed and still never reach the screen, so a
size reported back has to be a size read off the rendered page, not off the diff.

---

## The favourites page, read at the width a phone actually has

Nine notes on one page, and seven of them are one complaint: the type was sized for a screen
wider than the one it was on.

**The title falls where the sentence falls.** It read over three lines, then over two with the
break between "yapmak" and "için" -- which is what `text-wrap:balance` is for, and is not what
the sentence is. The marked phrase now takes its own line, in every language, so the break is
the seam the words already had. The heading also follows the viewport down below the point
where the fixed size stops fitting, and the page uses the 18px gutter the rest of the product
gives a phone rather than the 40px an empty page uses when it holds one short line.

**"Değerlendirmeni" is one word again.** The two counts sit side by side in 375px, which left
each label about 84px -- four short of the longest word in it -- so the label was allowed to
break inside words and did, leaving "Değerlendirm / eni". The mark and the padding gave back
what they did not need, and the permission to break mid-word is gone: nothing here needs it,
in any of the four languages.

**The count you are looking at is now bold, not just framed.** The frame and the mark changed
colour on the active one; the words did not, and the words are the part somebody reads. Both
labels stay two lines in either state, so switching does not move the page.

**Two sizes.** The district under a shop's name was running at the page's body size directly
below a 21px name, so it read as a second title; it is a detail now. And the arrow ending each
row is ink rather than clay -- clay is this product's colour for "act on this", and spending
it on every row spent it on nothing.

---

## The favourites page, when you are not signed in

The page said "Favourites" with an outline heart above it. True, and not the answer to the
question somebody standing there actually has, which is why the page is empty. It is empty
because they are not signed in, and nothing on the screen said so.

It now opens on a drawing of a saved list behind a padlock -- the reason, in the one place a
reader looks first. A reader who *is* signed in and has simply saved nothing keeps the heart:
they are not locked out of anything, and a padlock would blame the wrong thing.

The title reads "Değerlendirme yapmak için kaydettiğin mağazalar", with the phrase the page
is about in clay. That emphasis is carried in the string itself, in brackets, because the
phrase sits in a different place in each language -- Turkish ends on it, English opens on it
-- so a rule like "colour the last three words" would have been right once and wrong three
times. Everything that needs the words without the decoration, including the accessible name
and the heading a screen reader announces, strips the brackets.

And the sign-in button is clay rather than ink. It is the one thing to do on that screen, and
it was wearing the colour everything else on the page wears.

---

## The review flow, from ten revisions on card 21

Ten notes on one screen, and most of them say the same thing: the flow tells you where you
are, but it does not let you act on it.

**The stepper is a map you can walk back along.** A completed step is now a button and going
back to it is one tap; the step you land on darkens the way the current step already did.
Forward stays shut, because the evidence of the visit is what unlocks the rest -- a stepper
that let you skip to the end would be offering something the flow would then refuse. The four
circles also sit on one line again with their names beneath them (`align-content:start`, so a
two-line name no longer pushes its own circle down), the current one is drawn in ink rather
than clay, and the whole strip sticks exactly 8px below the header instead of under it.

**The shop is drawn the way the list draws it.** Its picture, name and address now sit in the
same arrangement and at the same sizes as the row you picked it from -- the same 92px frame,
the same 25px name, the same address line -- and those sizes are one declaration shared
between the two screens rather than a copy that can drift. Until now this screen named the
shop at 42px and showed no picture of it at all, which is the one thing that tells you at a
glance that you are standing in front of the right door.

**A low score has to say why.** One and two out of five now open a short note under the
heading, and the review cannot be submitted until every low score has one. The notes are sent
as the review's text. A single dark figure with nothing behind it is unanswerable by the shop
and unreadable by the next person; the complaint is the part that is worth anything.

**Two smaller repairs.** The verified-visit line was one paragraph doing two jobs -- a
confirmation and a deadline -- and is now a confirmation with a tick and an information frame
holding the window. And the purchase step's continue button is disabled until the question is
actually answered, rather than accepting silence as an answer.

**And the step names stopped landing on top of each other on a phone.** The current step's
label restated the base type size, which beat the smaller size the four names need to fit
across 375px -- so the step you were actually on was the one that ran into its neighbour.
It only ever needed the colour. The names now sit one to a line in all four languages.

**Left open:** whether somebody can review without an account, as a guest. That is a policy
question about what a review is worth when nothing stands behind it, not a piece of code, and
it is on the card for Güven.

---

## Two instructions that cancelled each other out

Search Console reports one page "indexed, though blocked by robots.txt": `/profile`.

Disallow stops a crawler reading a page. It does not stop the address being indexed. Google
found /profile through links, could not fetch it, and so never saw the `noindex` that page has
carried all along -- the one signal that would have taken it out. It sat in the index as a
bare URL with no description. One instruction said "do not look"; the other said "look, then
forget"; the first won and the second was never read.

/profile and /favorites are no longer disallowed, which is what lets their noindex work. It
costs a handful of fetches -- four fixed addresses per language, not a fan-out. /create stays
blocked, and the difference is exactly that fan-out: every store page links to
`/create?store=<id>`, so eleven thousand shops make up to thirty-three thousand crawlable
addresses that exist only to be refused.

**And the sitemap parts are cached at the edge again.** Making them dynamic on 19 September --
which was necessary, because the catalogue cannot be reached from the build container -- also
took away their shared cache, so every read walked eleven thousand shops and a crawler reading
six parts paid that six times. An hour at the edge, a day stale-while-revalidate. The index
already had this; the parts lost it without anyone saying so.

**Measured while looking:** the sitemap index answers in 0.28s and lists six parts; part 0 is
13,348 URLs in 1.6s, part 1 is 8,000. "Discovered – currently not indexed" has gone from about
8,000 to **0**. Indexed pages: 147.

---

## A list that rearranged itself by a few pixels of screen

The pages a shop belongs to -- "Bambi Antalya mağazaları", "Antalya mobilya mağazaları",
"Antalya yatak mağazaları" -- were laid out as a wrapping row. On a 375px phone all three
stacked and looked like a list; on a 390px one, two of them fitted side by side and the third
was stranded out to the right. Whether it looked broken depended on the width of the phone and
the length of the city's name.

They are a short list of places to go, not a row of tags, so they are one per line at every
width. Checked at 390, 470 and 1400.

**Worth keeping:** this was on the board for a day before it was moved into In Progress to stop
it being missed. A defect that only shows on some devices and some shops is exactly the kind
that sits unreported while everyone assumes somebody else saw it.

---

## The word and the mark beside it are one thing

On the favourites page, "Değerlendirmeni bekliyor" was set in ink with a clay clock in front
of it -- which makes the mark read as a decoration stuck on the front of a sentence rather
than as part of it. Both are clay now.

And "Değerlendirdin" is lighter than the shop that is still waiting. A shop already reviewed
is a fact being recorded; a shop waiting is something being asked of the reader, and the
heavier weight belongs to the ask.

---

## Two kinds of done in the review stepper

The step being worked on was a solid clay disc and a finished step is a solid green one, so
the row read as two kinds of finished rather than as "here" and "done". The current step keeps
the empty circle every step starts with; its border and its label carry the clay. One signal
each: clay says where you are, green says what is behind you.

---

## The profile said 34 and listed 20

"Değerlendirmelerim" asked for the first twenty while the line above it said how many there
were. A page that states a number and then shows fewer is arguing with itself, and the list
was the half that was wrong. It asks for all of them now, up to the endpoint's ceiling of 200,
and says so if it ever reaches it rather than showing a prefix without comment.

Two more on the same page:

- **"Profilin" is set the way "Favoriler" is** -- small, clay, in capitals. The favourites page
  puts an eyebrow at its top and keeps its real heading for screen readers; the profile was
  setting the same kind of word as a 48px display line, so two pages doing the same job opened
  differently.
- **A district and a city are not an emphasis.** They were bold in the review list because the
  feed sets them that way, where they are the only line under a large store name.

---

## The scrollbar a phone will not hide

The bar under the reviews had to be always visible, and the browser's own cannot be: on iOS
it is an overlay owned by the operating system, it fades the moment you stop moving, and
`::-webkit-scrollbar` does not reach it. Yesterday's answer was a small drawn marker, which
was rightly rejected -- it said "there is more" without saying how much.

It is a drawn scrollbar now, and a real one: the thumb's width is the share of the row that
fits on screen and its position is where in the row you are. Measured: a rail 1,299px wide in
a 375px window gives a 28.9% thumb, and scrolling to the end moves it to 71.1%.

Alongside it: "Devamını oku" is set in ink and underlined rather than clay, because it opens
something to read; "Aradığın mağazayı bulamadıysan" and the mark beside it are both in the
product's gold, and the mark is drawn rather than picked from the icon set, since the set has
no magnifier with rays and the nearest thing to it is a different idea; the sentence asking
the reader to add the shop stays bold but steps back from ink, because two weights of the same
near-black read as one shout in two sizes; and the add button sits further in from the
picture.

---

## The review policy opens a panel, and the rail shows its own rail

Four corrections to the store page, and two of them undo a decision I made yesterday:

- **The policy opens in a panel.** It was a `details` that unfolded in place, which pushed the
  reviews down the page -- moving the thing the reader was looking at in order to explain the
  thing they were not. It arrives on the same 0.52s and the same curve as the category sheet
  and the location panel; three panels in one product that open at three speeds read as three
  products. The panel holds both sentences, not just the half the note was not showing.
- **The rail draws its own scrollbar, at rest.** A phone hides the scrollbar until something
  moves, so a row that continues past the edge reads as a row that ends there -- which is what
  yesterday's little drawn bar was standing in for. Giving WebKit's own scrollbar a height and
  a track colour stops it disappearing, and it is the honest version: it also says how far
  along the row you are. The drawn bar is gone.
- **A rule under the correction card**, which is where what the page says about the shop itself
  ends.
- **The gap before "Yakındaki benzer mağazalar" closes from 90px to 36px.** The rule above it
  does not move; only the space after it does.

---

## The location button did work. We just stopped listening before the answer came.

Reported five times as "the button does not work", and measured five times as working. Both
were true, and the difference was the browser doing the measuring.

`acquire()` started its ten-second deadline the moment it called `watchPosition`. On iOS
Safari that same call raises the permission dialog -- and a dialog waits for a person. Ten
seconds is less than it takes to read two sentences and decide, so the clock ran out on a
request nobody had answered yet: the reader was told "Konumun zamanında bulunamadı", the
watch was torn down, and the Allow they tapped a moment later arrived at nothing. The button
stayed black because it had never been told where they were.

None of this can happen in a desktop browser with the permission already granted, which is
where every one of my measurements was made. There was no dialog there, so there was nothing
for the clock to outrun.

There are two clocks now. Nothing is timed until the browser answers for the first time,
because until then the only thing being waited on is a decision. Once an answer arrives the
short deadline applies -- that one exists to stop waiting for a *sharper* fix, which is a
different question and a real one.

Reproduced and verified in real Mobile Safari, in the iOS simulator, with the location set
from outside: before, "Konumun alınamadı" appeared behind the permission dialog while it was
still open; after, twenty-eight seconds at the dialog and then the button turns green,
"Mevcut konum kullanılıyor".

**Worth keeping:** a report that survives five fixes is usually not five mistakes. It is a
sign that the thing being measured is not the thing being reported -- here, a browser without
the dialog cannot show the defect the dialog causes. Reproduce it where it happens.

---

## A field that ate the tail of its own last line

"Küçük daireler için kompakt mobilya", typed into the search bar, came back as "mobilua": the
descender of the y was cut off by the bottom of the field.

The bar grows to fit what is in it, and the height it grows to is `scrollHeight`, which is a
whole number -- the fractional part of a line box is lost on every measurement. A two-pixel
buffer covered that at the size the bar is usually read at, and stopped covering it at larger
ones, which is where the report came from. The buffer is a share of the line now rather than
a constant, because the rounding it exists to absorb grows with the line. Measured at three
text sizes: 5px, 6px and 8px of headroom where it used to be a flat 2.

The rest of the same card:

- **The breakdown no longer says "Aranıyor…".** It borrowed the search page's loading word, so
  opening a score table announced a search that was not happening. It says nothing and fills.
- **The breakdown's control is marked at both ends:** what it opens on the left, and that it
  opens at all on the right -- the same chevron the review cards already use for the same
  table, so one control is met in two places rather than two that happen to agree.
- **"Listelemeyi temizle" is centred.** An inline-flex box does not take an auto margin, which
  is why the first attempt at this did nothing.
- **"Aradığın mağazayı bulamadıysan"** carries the mark of looking rather than of alarm, and
  its second sentence -- the one that asks the reader for something -- is the one set in ink.
- **Closing the "add a store" dialog puts the reader back where they opened it.** Focus returns
  to the button that opened it, which is right; but focusing an element scrolls it into view,
  and that button sits at the bottom of a list thirty shops long.

---

## Four chains were wearing somebody else's logo

Reported as "why do these have no logo", and the answer was two different faults. Some shops
carry no brand at all, so there is nothing to look up. And of the marks we did hold, four
were not the chain's mark:

- **Bellona** was a teal hand icon scraped off its own site -- a UI glyph, not a logo. Fixed:
  it is the BELLONA wordmark now.
- **Merinos** was "Erdemoğlu Holding". Its site uses the parent company's logo in its header;
  the file is even called `meri-erd-logo.png`.
- **Mutlu Halı** looked like a different company's mark, "Küçükmutlu" -- and it was not. The
  three shops filed under that brand are named "Küçükmutlu Mutlu Halı - Buca", "Küçükmutlu
  Mutlu Halı Şirinyer" and "Küçükmutlu Mutlu Halı Karşıyaka". The chain *is* Küçükmutlu; the
  mark was right and the brand's own name in the registry is what is wrong. Put back.
- **Vivense** was an empty circle -- a gradient placeholder from the page. Its own monogram
  is used instead.
- **Modalife** publishes its mark as white on transparency, which is invisible on this
  site's ground. It is composited onto the brand's own red (`#ed1c24`, taken from their
  site) -- which is how they show it themselves.

The four wrong ones are removed rather than replaced. Their shops show their initial, which
is what the collector's own documentation says is correct: a wrong-but-plausible mark is
worse than none, because nothing about it says it is wrong.

**All 39 brands in the catalogue now have a mark.** The three that were missing were missing
for a reason worth writing down: the collector reads a page as it is served, and these three
sites do not serve their logo that way. Merinos renders its header with script, so a plain
read found nothing; İşbir Yatak's registered site is the *holding's*, whose header says "İşbir
Holding" while the sub-brand marks sit further down the page; Bambi's header image is named
after its upload date and says "logo" nowhere. Reading the three pages in a real browser found
all three in a minute.

**Still open, and not fixed here because it is catalogue data rather than code:** a shop named
just "Yataş" is attached to no chain, and the adoption rule cannot attach it -- it asks that
the shop's name *start with* the chain's, and "Yataş" does not start with "Yataş Bedding". The
same dry run refuses 39 more rows whose name matches a chain but whose trade does not overlap
it. And the brand filed as `mutlu-hali` is really Küçükmutlu; the name in the registry is
wrong even though its mark is right.

---

## The results list was broken on every wide screen, and had been for a fortnight

A store's name and address were squeezed into a 20px column, one word per line, with the
chain's mark taking the rest of the row and the arrow dropped onto a line of its own.

`.result-row .search-result` was written when a result carried no picture at all: two
children, two columns, `minmax(0,1fr) 20px` for the shop and the arrow. The chain's mark was
added as a third child later and the template was never changed, so the mark took the 1fr and
the shop took the 20px meant for the arrow. Three tracks now.

**Why it survived two weeks of review:** the phone breakpoint has a template of its own, and
every check -- mine and the ones being reported back -- was made at phone width. A rule that
only one breakpoint gets wrong is invisible to anyone testing at the other.

---

## A half star was two thirds of a star

Reported as a fill-maths error and it was one, but not in the maths. Each star is drawn
twice -- an outline, and a filled copy revealed from the left by a percentage -- and the
percentage is of the *box*, so the drawing and the box have to be the same size. In the
results table they were 13px and 18px: the svg had been shrunk there, the box had not. A
criterion scoring exactly 3.5 revealed 50% of an 18px box, which is 9px of a 13px star --
**69% of it**. Measured, before and after.

One number sizes both now (`--star-size`), so anywhere that wants smaller stars sets it once
and the two cannot drift apart again.

The rest of the same card:

- **The stars come to the criteria**, which stay where they are. Giving the table the whole
  card (previous entry) left the scores against the far edge, with the best part of a hundred
  pixels of nothing after a short criterion. The label column is as wide as the longest label
  needs and the row hugs the left: the scores start at 138px instead of 221px.
- **"Listelemeyi temizle" is as wide as its own words**, with the mark of going back on it. A
  full-width slab read as the page's main action rather than as the way out of a list.
- **The count and the sort are two frames**, not two lines of small print above a long list.
  No chevron on the sort: the order is not something this page lets anyone change, and a
  control that does nothing is worse than no control.
- **"Aradığın mağazayı bulamadıysan" is not a warning.** Its heading was amber, which made it
  the loudest thing on a page of results and read as something having gone wrong.
- **The results say when you are close enough to review**, in the words, colour and mark the
  saved list already uses. It is measured from the device, not from the place being searched,
  because standing near enough is a fact about the person. Not claimed for a shop whose point
  we worked out from its address -- that needed `location_approximate` on search results,
  which the query behind them had always read and never passed on.

---

## The store page says what the reviews are, and who may touch them

The row of reviews had no heading and no frame around what it is. It has both now: "Topluluk
değerlendirmeleri", and under it the policy in plain words -- that a listed store is
forbidden from interfering with what is written about it, and that the reviews are their
authors' own opinions and this site publishes them. Only the first sentence is on screen; it
is the one that answers "can I believe this", and the second opens behind "Devamını oku". A
`details` element, so it works before any script does.

The rest of the same pass:

- **The correction invitation is a card, not a pill.** Five words in a pill, sitting among
  the address links, asked the reader to work out what the form behind them wanted. It now
  says what it is for and where it goes.
- **"Değerlendirme" is "Mağaza puanı".** The heading named the act; the block underneath is
  the number.
- **A rule above "Mağaza hakkında"**, the same one the rating block already carries above it.
  The page was drawing that boundary in one place out of two.
- **Five stars beside the store's score**, from the same component the review cards use, so
  comparing the store with one person's review is comparing two of the same picture.
- **The review rail says it continues.** It scrolls sideways and, on a phone, the scrollbar
  is hidden at rest -- so a row that runs past the edge reads as a row that ends there. A
  small drawing of the rail, shown only when there is something past the edge, and a rule
  under it where the section ends.

One defect found while placing the card: a pseudo-element on a grid is a grid item like any
other, and an unplaced one takes the next free cell. The divider took the cell the text was
supposed to be in, and the chevron printed itself across the words.

---

## The favourites page says which list a shop is in, on the shop

The page holds two counts -- saved, and waiting for your review -- and each opens the list it
counts. Which of the two a given shop belonged to was only answerable by opening the other
tab and looking for it there. Each row now carries a small state before its name: a clock and
"Değerlendirmeni bekliyor", or a check and "Değerlendirdin". The two counts get a mark each
for the same reason: a heart for what has been kept, a clock for what is still owed.

And "1 tanesi senin" was the number one written out. It sat beside a store's review count and
was right exactly as often as somebody had reviewed that shop once and no more, silently
wrong the rest of the time. It takes the real number now, which needed the API to report it
(`viewer_review_count`) -- a boolean cannot be counted.

---

## The review flow: a step that opened at its own bottom

Moving between the four steps is a history entry rather than a navigation, so nothing reset
the scroll. After eight scoring questions the page is near its bottom, and the purchase step
-- three lines long -- opened there: its footer on screen, its question above the top edge.
Each step starts at its own top now.

In the same pass: the connecting line between the four stops is gone (the stops are already
read left to right, and the rule drawn behind them made a sticky bar look like a divider);
"Seçimleri temizle" sits 22px under the last question instead of 52px; the scoring note says
the store rating "bunların ortalamasından oluşur"; and the first step now says one thing
rather than two. Before the check it explains what the check buys you, after it says what
you have and for how long -- the green "Ziyaretin doğrulandı" line under it was the same
sentence again, and the step is already marked done in green at the top of the page.

Not walked end to end: steps 2 to 4 need a signed-in account and a verified visit. The
stepper, the removed rule and the button's new position were measured on the live step one;
the rest is a string change and a scroll on step change.

---

## The contribution level is a ladder, so it is drawn as one

The profile showed a badge and a count. A badge says where somebody is; it does not say
where they are going or how far off it is, and that second part is what makes a level worth
having. It is two rungs now -- current on the left, next on the right -- with the distance
between them drawn between them, and each rung carrying its number, its name and the review
count that reaches it.

Two decisions worth keeping:

- **The shape is a hexagon, not a star.** A star in this product already means a rating, and
  the same shape carrying two meanings makes both of them read as the other.
- **No threshold table in the browser.** The backend reports the level, the next level and
  how many reviews are still owed; the next rung's number is the sum of the last two. A copy
  of the ladder living in the client would drift from the one actually being applied, and the
  drift would be invisible.

Alongside it, on the four profile sub-pages: the page opened with 52px of nothing above the
back arrow, because the top margin is sized for a heading those pages do not have (22px
now); "Değerlendirmelerim" carries the total underneath it; and the store's district and
city are in ink rather than clay -- the colour the listing already uses for the same
information, where clay means "a thing to press". The feed still shows it in clay, which is
a separate surface and a separate decision.

---

## A criterion label printed over its own stars

Reported as stars and criteria running into each other, and the first fix made it worse. The
score breakdown shares a row with the save button, so on a phone the table was living in
185px of a 339px card: 52px for the label and 118px for five stars and a number. "Fiyat/
performans" needs 98px and contains no space, so a browser will not break it -- it simply
overflowed its column and printed itself across the stars. Widening the star column, which
is what the first fix did, took another 16px off the label and made the overlap bigger.

The breakdown is now a sibling of the score rather than a child of it. The summary keeps its
place beside the save button; the table spans the whole card underneath, where the empty
space already was. The label column went from 52px to 205px and every one of the eight fits
on one line.

The label also breaks now instead of overflowing (`overflow-wrap: anywhere`). That is the
part that holds in general: no column width is wide enough for every label in four
languages, and a label that cannot fit should wrap, not print itself over the thing next to
it.

---

## Nothing had deployed for sixteen hours, and the sitemap was the reason

Every push since the evening of 18 September failed to build. Not a warning -- `FAILURE` on
six consecutive Cloud Builds, while the site kept serving the last image that worked. Four
finished pieces of work sat in the repository looking shipped, and the person testing them
was looking at a build from the night before and reporting, correctly, that nothing had
changed.

The cause was the previous entry's own fix. `getStoreIndex` used to answer an unreachable
backend with an empty list; that produced a sitemap with nothing in it and a green deploy,
which is how 9,252 store pages went missing without anyone noticing. Making it report the
failure honestly was right. What it exposed is that the backend is unreachable *from the
build container* -- `ECONNREFUSED 127.0.0.1:8080` -- and `sitemap.ts` was reading the
catalogue at build time. So an honest failure, raised in a place that cannot succeed by
construction, stopped the deploy instead of emptying the sitemap. Both are the same defect
wearing different clothes: the catalogue was being asked for somewhere it does not exist.

Both sitemap routes are `force-dynamic` now. Nothing asks the backend for anything until a
request arrives, and by then it is a network hop away. `generateSitemaps` still has to name
the addresses while the image is built, so it names a ceiling -- thirty files, room for
sixty thousand shops, matching the catalogue reader's own limit -- rather than a count it
cannot take. Addresses past the end of the catalogue answer with an empty sitemap and
nothing links to them, because the index publishes the count measured per request.

Verified by reproducing the exact failure locally (`API_ORIGIN` pointed at a dead port):
the old code fails with the same message on the same route, the new code builds, and with a
reachable backend the index lists six files and the first holds 13,348 URLs.

**Worth keeping:** a build that fails is invisible from the outside. The site stays up on the
previous image, so the only symptom is that shipped work does not appear -- which reads as a
bug in the work. Check the build status before concluding a fix did not take.

---

## The search panel left a strip of the page showing, six times

Reported six times, fixed five times, and every one of those fixes was an attempt to make
the panel's own box exact: measure the dynamic viewport, then the visual viewport, then its
`offsetTop`, then run the measurement before paint. The symptom kept coming back in the same
shape -- the site header visible above the panel for a moment, a slice of the category list
below it -- because the box is not the kind of thing that can be made exact.

A phone has two viewports. `position: fixed` places an element against the layout viewport;
the panel is sized and offset from the visual viewport, which is smaller and can sit lower
inside the other one. While the keyboard animates, the two disagree, and whatever the panel
does not reach is the page underneath. Correcting the panel's `top` by `offsetTop` does not
close that gap -- it *opens* it, by pushing the panel down and leaving the header exposed
above it.

Two changes, neither of which depends on winning a race:

- An opaque sheet across the whole layout viewport, at `z-index: 79`, under the panel and
  over everything else (`html[data-search-panel=open] body::before`). Anything the panel
  does not cover is now plain canvas instead of the page. The measurement can be as wrong as
  the browser makes it and nothing readable shows through.
- The panel opens on `pointerdown` rather than on the `focus` that follows it. A phone
  decides how far to scroll to lift a field above the keyboard using the position the field
  is in when it is touched. On focus that is still a bar in the middle of the page, so the
  browser scrolls to a field that has since moved to the top of a fixed panel -- and drags
  the panel with it. Opening on the press puts the field where it will end up before
  anything is measured.

Not verified on a real iOS device: the browser used for checking has no iOS keyboard, so
`offsetTop` is always zero here. What was verified is that with the panel open nothing of
the page is reachable at any point of the viewport.

---

## The category pictures were never the pictures

Tapping a category opened a sheet showing a small circular line drawing. The drawings had
been cut out of a numbered contact sheet, which was the wrong source: the set that belongs
to this product is thirteen photographs, one per category, and the sheet was showing
something else entirely. Reported as "the pictures in the window are not the right ones".

The thirteen photographs replace the drawings. Two things about how they are stored matter
later:

- Every file is 720x400 WebP with the photograph centred on transparency. The photographs
  are all 400 tall but between 594 and 719 wide, and a shared canvas is what makes all
  thirteen come out at the same height in the sheet without a per-category size in the code.
- The corners arrived rounded and filled with white, which is invisible on a white sheet and
  a set of white triangles on anything else. The rounding is cut into the alpha channel
  instead, so the corner is absent rather than painted over.

The sheet no longer forces the picture into a square. It was `184x184` with `object-fit:
cover`, which took a wide photograph and threw away everything but its middle -- the garden
chair lost its garden. It now runs the full width of the sheet at its own proportions. The
44px circle in the list keeps the crop, because at that size a circle is what keeps the row
tidy; its `sizes` went from `44px` to `88px`, since a circular crop of a 720x400 picture
only shows the middle 400 and was being served a 48px source to do it with.

---

## The sitemap quietly shipped 2,668 pages short

Caught by the first run of the weekly check, within an hour of the entry below: the published
sitemap had fallen from **12,589 pages to 9,921**. Nothing had errored. The chunk that should
have carried the first 2,000 stores carried none of them.

Same root cause as the 404s, in a second place. `getStoreIndex` returned `[]` when a page of
the catalogue could not be read, and the walk that pages through it stops when a short page
comes back -- so one failed request ends the enumeration and the sitemap is built from
whatever arrived before it. Silently, because an empty list is a valid answer.

A sitemap that lists fewer pages than exist is not a smaller sitemap. It tells a search
engine the missing ones are gone, after a day spent making them reachable. It throws now: a
failed chunk answers 500, which Google retries and does not act on.

Both of these were the same mistake -- treating "could not find out" as "there is nothing
there" -- and both were invisible until something checked while nobody was watching.

---

## A page that could not be looked up answered 404, and the 404 was cached

The weekly check caught it in the wild, minutes after a deploy: `/istanbul/mobilya-magazalari`
and `/izmir/hali-magazalari` answering **404** while page 2 of the same lists, and every other
city, answered fine. By the time anyone looked they were 200 again.

The cause is one swallowed error. `getCityCategories` returned `[]` when the lookup failed,
and an empty list is indistinguishable from "this pair does not exist" to the page built on
it: it calls `notFound()`. Next then caches that 404 for an hour and serves it to whoever
asks, including Google, which reads it as the page being gone. A blip of a second becomes an
hour of absence, on pages that took a day to build.

The lookups throw now. A 500 is the truthful answer — "we could not find out, come back" --
and it is not cached. Callers that only decorate a page with these links keep a tolerant
version: a store page without its catalogue links is still the store page.

Worth recording how it was found. This is the defect I noticed while building the pages and
decided not to chase, because I could not make it happen on demand. A scheduled check that
runs whether or not anybody is watching made it happen on its own, twice, in one window.

---

## There was a number printed on every category picture

The drawings came as one contact sheet and were cut out of it. The sheet was numbered, and
the numbers came with them: a navy "7" sitting above the bathtub, a "3" above the carpet.
Shown at 26px in the list nobody could read them, which is why they survived a week.

Cut out again, this time by finding the disc rather than by guessing the grid. A row that is
part of the drawing spans most of the width; a row that is part of a number spans about a
tenth. Taking only the wide rows leaves the disc and drops the number, in all thirteen, with
no per-image measurement to keep in step.

---

## The search page opened with a refusal in front of it

Reported as "the warning appears the moment the search page opens". It did, and it was my
own change from yesterday turning a quiet note into a blocking one.

The page tries for a location on load when the browser has already granted one. When that
attempt failed it set the error message, and that was right while the message was a line of
text under the field: a silent failure made the button look dead when it was pressed next.
The message became a dialog yesterday, and a dialog raised by an attempt nobody asked for is
not an explanation -- it is the page opening with a refusal in front of it.

The automatic attempt is silent again. It still records why it failed, so a later deliberate
press resumes from it; only a press raises the dialog.

That also answers the other half of the report -- "it appears both on opening and on
pressing". It was one dialog, twice.

---

## Removing a button squashed the one next to it

"Konumu değiştir" went from a text button to a 44px square. Taking the cross away made the
change-location button the last child of its row, and the rule that made the cross a 44px
icon box was written as `:last-child`.

It now names the cross. The row's grid dropped to three columns on desktop and two on a
phone, which is what it actually holds.

A positional selector describes the layout at the moment it is written, not the thing it is
about, and it keeps that description after the thing moves.

---

## Eight rows of stars with nowhere to start

In the score breakdown on a result, the criterion took all the width it wanted and the stars
began wherever that left off -- so "Ürün bulunabilirliği" ran into them, and no two rows of
stars lined up with each other.

The right-hand column is fixed now. Every row of stars starts on the same line, which is also
what makes eight of them readable as a column rather than as eight separate rows.

---

## "Find the nearest store to me", pressed with no location, did nothing

Found while checking the new category sheet on the live site: with no location set, its
button closed the sheet and nothing happened. No search, no message, no next step.

It cannot answer without knowing where "me" is, which is fair -- but silence is the worst
answer a button can give. It opens the location panel instead, which is the step the reader
was going to have to take anyway.

---

## A category opens before it searches

Tapping a category name ran the search on the spot -- one tap for a decision the reader had
not finished making. Several of these names are a glance apart: "Ev Gereçleri" and "Ev
Aksesuarları" are not the same shelf and do not read as different words at speed.

It opens the category now: the drawing at the size it was drawn for, and the search behind
its own button. The picture is the point, and it had been shown at 26px out of 192 -- most of
a drawing thrown away. Three categories still on line icons get the same circle, drawn rather
than filled, rather than an empty frame that would read as a fault.

Same motion as the location dialog and the nudge, because it is the same gesture: a panel
arriving over the page.

---

## One frame of the page showing through the panel

Reported twice as two things -- "the top of the page flashes before the search panel takes
over" and "part of the category list is visible behind it" -- and it was one thing: a single
frame.

Everything that makes the panel cover the screen (its height, its offset against the visual
viewport, and the lock that holds the page behind it still) was applied in an ordinary
effect, which runs *after* the browser paints. So for exactly one frame the panel existed and
none of that had happened, and what showed through was the top of the search page: the dog,
the language button, a slice of the categories. Too fast to debug and not too fast to see,
which is the worst speed a defect can have.

`useLayoutEffect` runs between the render and the paint, so the first frame anybody sees is
the finished one. It falls back to `useEffect` on the server, where there is no paint and
React warns about it.

---

## The category pictures were touching their own names

The icon slot went from 26px to 44px when the drawn categories arrived; the grid track it
sits in stayed at 26 on desktop and 24 on a phone. A 44px picture in a 24px column spills
into the word beside it, which is what "birbirine dokunuyorlar" was.

One number in one place now, and a gap wide enough to read as one.

---

## The location dialog lost a button and gained the product's own timing

Three changes asked for on the card, and the reasoning behind two of them is worth keeping.

It has one action now, always called "Tekrar dene". What trying again *means* still differs
underneath -- a refusal reloads the page, because on iOS a permission changed in Settings
never reaches a page that is already open; anything else simply asks the device again -- but
the reader should not have to know which case they are in to press the only button. The
second "Kapat" underneath went with it: the cross in the corner was already the way out.

It arrives and leaves at the nudge's speed, on the nudge's curve: .52s, cubic-bezier(.16,1,
.3,1). Its own keyframes, though. The nudge's carry a `translate(-50%)` because it is pinned
to the middle by `left:50%`, and reusing them here would have shoved the dialog half its own
width to the left of a backdrop that already centres it.

And the cross beside "Mevcut konum kullanılıyor" is gone. It cleared the location outright --
rarely wanted, easily hit by accident -- and "Konumu değiştir" already opens the place to
change it.

---

## The page the search queries were already asking for

`/antalya/yatas-bedding-magazalari` -- one chain's branches in one city, listed by district.
621 of them.

The city-and-category pages went out this morning and then Search Console said what people
actually type. Not "Antalya yatak mağazaları". **"yataş antalya", "antalya yataş mağazaları",
"yataş konyaaltı", "en yakın yataş bayi".** Every branded query reaching this site in
twenty-nine days is brand-and-city, and there was no page with that name to answer one.

The address shape is the same as the category pages, and the route resolves both: a trade
first, then a chain. There is no collision today -- forty-five brand slugs, fifteen category
slugs, no overlap -- and if one ever appears the trade wins, because it is the more general
answer and the chain can still be reached by its own name.

Three branches is the floor rather than ten, and the difference is the point. "Antalya carpet
shops" with three shops is a thin list of a large subject; "Yataş in Antalya" with three
branches is a complete answer to which one is nearest -- and one the chain's own store finder
gives badly, listing a country and leaving the reader to work out the district.

Ordered by district then name, not by rating: somebody who named a chain has chosen it and is
deciding which branch. A ranking would answer a question they did not ask.

Store pages link up to the chain's page first and the trade's pages after it, for the same
reason: it is the page somebody looking for this shop most likely wanted.

---

## Google read one shop as two

Every store page declared the shop twice. The `aggregateRating` on the Store carried an
`itemReviewed` naming the same shop again -- a bare `{"@type":"Store","name":"Yataş"}` with
no address, no telephone, no url and no image, because it was never a shop, only a label.

Google's Rich Results Test is what said so, run against a live store page rather than
guessed at: **two local businesses detected**, one complete and one with four missing
recommended fields. A rating that is a property of the thing it rates does not need to name
that thing again, and Google's own examples do not.

The same test cleared the worry that sent me looking. Search Console reports "review
snippets: 0", which read like broken markup; the test reports **one valid review snippet**,
along with valid breadcrumbs and organisation data. Enhancements are only counted for indexed
pages, and none of these are indexed yet. The markup was fine.

What is not fine is upstream of any markup: of 34 reviews, 7 carry any text at all and the
average length of those is **two characters**. The `review` array is empty on most pages for
that reason, not for a technical one.

---

## robots.txt covered one address in four

Turkish is served unprefixed, so `Disallow: /create` protected `/create` and left
`/en/create`, `/de/create` and `/ru/create` open. The same for `/profile` and `/favorites`.

That is not cosmetic. Every store page links to `/create?store=<id>` to start a review, so
with eleven thousand stores it is up to thirty-three thousand crawlable addresses that exist
only to be refused -- each carrying noindex, each costing a fetch that the eight thousand
store pages sitting in "discovered, not indexed" are not getting.

Found by reading Search Console rather than the code: the index report's "excluded by
noindex" bucket was twenty-two pages and every one of them was `/en/create?store=…`,
`/de/create?store=…`, `/ru/favorites`.

A wildcard rather than three more lines naming each language, so a fourth language does not
have to remember to come back here.

The rest of that report checked out, which is worth writing down too: "blocked by robots.txt"
is personal pages plus the dead Google photo endpoint, "404" is five stale font hashes from
old builds, "redirect" is the /tr → / consolidation, and "alternate with canonical" is the
language versions. Nothing broken. The only number that means anything is the eight thousand.

---

## A list that said "1,373 shops" and linked sixty of them

The city pages shipped without pagination, and the gap was the exact problem they were built
to close, reintroduced at the bottom of the list: Istanbul furniture named 1,373 shops and
linked the first sixty. The other 1,313 store pages had nothing pointing at them again.

Pages two and up now live at `/{city}/{category}-magazalari/2`. Of the 427 lists, 349 still
fit on one page and 78 gain a second; the longest is twenty-three.

The number is a path segment rather than `?sayfa=2`, and that is the whole reason the choice
took any thought: reading a query parameter makes a route dynamic in this framework, so every
one of these pages would be rebuilt on every request -- including every crawler's -- instead
of rendered once and cached for an hour. The address reads the same either way; the cost does
not.

Each page is self-canonical and carries its number in its title, because twenty-three pages
claiming the same name is twenty-two of them being discarded. A "/1" is a 404 rather than a
second address for page one, and a page past the end is a 404 rather than an empty list --
an address that answers with nothing is worse than one that says it does not exist, because
a crawler keeps the first and comes back.

The sitemap lists every page, not only the first.

---

## A search result that said nothing, on the most-seen page we have

The store page description read `Pasha Perde Tasarım Stüdyosu, Muratpaşa, Antalya — Topluluk
deneyimleri`: the title again, then the name of a section heading.

That page is the most-seen thing on the site -- 101 impressions, 2 clicks. Two per cent,
against a site average of 10.4. Google was showing it and nobody was pressing it.

It now says what we know, in the order it matters: what the shop sells, where it is, what the
community found, and -- where the community has found nothing yet -- that plainly, rather
than dressing up the silence. A store's own description still wins when it has one; that is
the shop speaking for itself.

The count is reviews and is called reviews. The endpoint returns `review_count`, not how many
people wrote them, and those two stop being the same number the moment somebody visits twice.
Calling four reviews "four people" in a search result would be the overstatement the home page
was corrected for two entries ago, printed somewhere it cannot be taken back.

---

## Two rules for picking a shop's category, both wrong, so it picks none

The link from a store page up to its city-and-category pages was written twice and both
versions were a guess wearing a rule's clothes.

First match gave İşbir Yatak "Antalya ev aksesuarları mağazaları" -- 436 shops, saying
nothing about this one. Smallest match was meant to fix that and made it worse: measured on
the live site, İşbir Yatak went to **ev gereçleri** and English Home to **banyo**. Smallest is
a fact about that city's stock, not about the shop standing in it.

There is no field in the catalogue that says which category a shop is mainly in. Choosing one
means inventing the answer, so it stops choosing: a shop links to every page it belongs to,
up to three, largest first. That is what the data actually says, it gives the reader the
choice we were making for them, and it triples these links rather than betting them all on
one guess.

The entry below it, and the one below that, are the two guesses. They are left in the log
because the reasoning in them looks sound and was not.

---

## A bed shop belongs under beds, not under home accessories

The link from a store page up to its city-and-category page took whichever matching page
came first, which meant İşbir Yatak in Antalya pointed at "Antalya ev aksesuarları
mağazaları" -- a page of 436 shops that says almost nothing about this one.

Where several pages can claim a shop, the smallest one wins now. The narrower page is both
the truer description and the one a reader was more likely looking for, and it spreads these
links across many pages rather than piling them on the few largest.

---

## "İzmir'da" was wrong on every page that was not Antalya

The city pages shipped with "'da" written after every city name. That is right for Antalya
and wrong for İzmir, Kayseri, Denizli, Eskişehir, Edirne, Gaziantep, Uşak and most of the
other eighty.

The fix is not a list of cities. This product covers every city in Türkiye and a list would be
wrong the first time a name nobody thought of turned up. Turkish already has the rule and it
is three lines: the suffix takes its vowel from the last vowel of the word, hardens its
consonant after a voiceless one, and a proper noun is separated from it by an apostrophe.

Checked against eighteen cities picked for being awkward -- İzmir'de, İstanbul'da,
Gaziantep'te, Sinop'ta, Uşak'ta, Tekirdağ'da, Elazığ'da, Bilecik'te, Şanlıurfa'da, Bartın'da,
Balıkesir'de -- all correct.

---

## A page for "carpet shops in Izmir", which the site did not have

`/{city}/{category}-magazalari` -- `/izmir/hali-magazalari`, `/istanbul/mobilya-magazalari`.
427 of them, one for every city-and-category pair the catalogue can fill with at least ten
shops. Istanbul furniture alone holds 1,373.

Until now the only way to that question was to know to type it into the search. There was no
page with that name, nothing linked to one, and a crawler had nothing to follow at all: store
pages were reachable from the sitemap and from nowhere else, and a sitemap gets a page crawled
without passing it any standing.

**The cross-links are the point, more than the pages.** Each page links to the same city's
other categories and to the same category in other cities -- around twenty links -- and down
to its own ten-plus shops. Store pages now link back up: under the address there is a real
link to the page the shop belongs to, where before the breadcrumb pointed the city at
/discover, which is a search box rather than a place and told a reader nothing.

**One address per page, in Turkish, in every language.** A shop in Izmir is in the same place
whichever language you read about it in, and four translated addresses for one page would be
four pages competing to be the one that ranks. The suffix stays `-magazalari` in English too.

**The floor is ten shops and it is enforced by the data, not by a list.** The backend decides
which pairs exist; the page, the link and the sitemap all read the same answer, so none of
them can advertise a page the others do not believe in. An address that is not in that set is
a 404 however well formed it looks.

Reviewed shops lead each list. Distance cannot order a page built before anybody opens it,
and alphabetical order would nail the same shop to the top of every city forever.

**Worth saying plainly:** this is still plumbing. These pages carry real shops and real
counts, but the only sentence on any of them that exists nowhere else is a review, and
reviews exist on eleven shops. The pages make the catalogue reachable; they do not make it
worth reading. That part is not a technical problem.

---

## Fifty-two of the fifty-six suggestions were being clipped, not scrolled

Measured in the open panel on a 375px screen: the suggestions list was **3,573px tall inside
an 812px panel**, and it was not scrollable. The row it sits in was the right height (676px).
The list ignored it.

The panel aligns its rows to the start, and an item that starts is an item that sizes to its
own content rather than to its row, so `overflow-y:auto` had nothing to overflow. Everything
past the fold was clipped by the panel's own `overflow:hidden` -- reachable by nothing, not
even a scroll. `align-self:stretch` is the whole fix.

This had been invisible while the panel showed four suggestions and a "show more" control.
Showing all fifty-six is what made it a defect, which is why it arrives as "the suggestions
are not there" rather than as "the list does not scroll": with the keyboard open the panel is
shorter still, so less of the clipped list shows, and closing the keyboard reveals more of it.
That is exactly the shape of the report.

---

## The search panel was fixed to a viewport nobody was looking at

Reported five times and fixed four: on iPhone the search bar at the top of the full-screen
panel sits above the visible area once the keyboard opens, and has to be dragged down.

Every previous attempt measured the *height* of the visual viewport, which was right and was
not the problem. A fixed element is placed against the **layout** viewport, and iOS does not
shrink that when the keyboard opens -- it scrolls the visual viewport down inside it. So
`top:0` kept pointing at a line that was now above everything anybody could see, and the
field went with it. `visualViewport.offsetTop` is exactly how far the two have come apart,
nothing else on the page reports it, and the code never read it. The panel is positioned from
it now. iOS also scrolls the page itself to lift a focused field above the keyboard, after the
page has been held still, so the page is put back each time the keyboard arrives or leaves.

Said plainly: this cannot be reproduced here. The browser used for checking has no iOS
keyboard, so `offsetTop` is always zero. What can be said is that the mechanism the symptom
describes was missing from the code and now is not.

---

## A location failure is a dialog, and a refusal offers the reload it actually needs

The warning under the location field said the right thing where nobody read it -- below the
fold of a panel somebody was already typing in, looking like a caption rather than the answer
to what they had just pressed. It is a dialog now, and it carries its own actions, because it
covers the control that failed.

Which action leads depends on what failed, and this is the part that matters. A refusal will
be refused again: the request never reaches the device. And on iOS a permission changed in
Settings does not reach a page that is already open -- WebKit binds the decision at load.
That is the "the button does nothing, I have to refresh the page myself" that had been
reported four times against a button that was working correctly. A refusal now leads with the
reload, so the app says the thing the person was having to work out for themselves.

Measured while looking into it: with a device that answers, the button does what it was asked
to do -- same control, same place, text to "Mevcut konum kullanılıyor", background to the
success green, white text. The earlier reports were of the case where the answer never comes.

The blocked message lost its paragraph about iPhone menus; it now says that location is
blocked and to allow it and try again. The drawing of the address bar stays for that case.

---

## Smaller things on the search page

Category rows no longer carry their search counts -- a number nobody could act on, beside the
one thing they could. The category pictures are shown at 44px instead of 26px, the size of the
line icons they replaced, and the three categories still on line icons keep the same column.

A search result list gained a way out of itself: **Listelemeyi temizle**, directly under the
field it undoes. Until now the only route back to the categories was the browser's own back
button, which on a phone leaves the site as often as not. It clears the answer rather than
navigating, so the question stays in the bar and changing one word is still one tap.

---

## Six of eight shop names were cut off on a phone

Measured on the live page at 375px: in the new recently-reviewed list, the score column --
five stars and a count -- took 135px of a 339px row, which is as much as the name beside it.
Six of eight names ended in an ellipsis. The name is the whole point of the row.

The score drops under the name on narrow screens and the name takes the full width, wrapping
to a second line where it needs one. Six cut before, none after, and the page still does not
scroll sideways. The neighbours list on a store page already stacked its score, so there it
was only the wrap that was missing: two of six cut before, none now.

---

## Eleven thousand pages nothing linked to

Counted on the live site: the home page carried **no** link to any store page, a store page
carried **no** link to another store page, and /discover -- rendered in the browser -- carried
none either. The only route to any of the 11,252 store pages was the sitemap, which gets a page
crawled without passing it any standing. Every store page was an island.

Three separate causes, fixed separately.

**The sitemap stopped at 2,000 stores.** `getStoreIndex` asked for 2,000 and stopped, a number
chosen when the catalogue held 838 shops. It became a ceiling nobody could see: 9,252 store
pages existed and were offered to no crawler at all. It now pages through the whole catalogue.

That made one document of about thirty megabytes, so the sitemap is split: 2,000 pages per
file -- the size the old one had already been serving -- with an index at `/sitemap-index.xml`
naming the parts. Next reserves the name `/sitemap.xml` and generates nothing there when a
sitemap is split, so that address redirects to the index rather than becoming a 404; it is
what Search Console holds and what robots.txt has advertised since launch.

**The sitemap was also rebuilt on every single request.** It declared `revalidate` and never
got it, because it read the visitor's cookies to decide a language it then never used, and
reading cookies marks a route dynamic. Five megabytes of XML, per hit. Public reads now go
through `publicApi`, which asks the backend as nobody in particular and lets the answer be
cached. The store index, the store's neighbours and the home page's signals all use it.

**The home page's links existed but were never in the document.** The block that shows
standout stores was a client component fetching in an effect: the links were written and
nothing without JavaScript ever saw them. It renders on the server now, which is also why the
skeleton flicker under the heading is gone.

**And store pages now link to their neighbours.** A new block under the reviews lists the six
nearest shops sharing a category. It is for a reader as much as a crawler -- deciding a shop
is not the one used to leave you with the back button and nothing else.

Two smaller things in the same pass. `/discover` was advertised at priority 0.9, just under the
home page, while being the emptiest document on the site to anything that does not run
JavaScript; it stays listed at 0.5, which is what a crawler can actually read on it. And
`llms.txt` now exists: what the product is, where store data comes from, and what is
deliberately not here. It also fixes a small lie -- `/llms.txt` was answering 200 with the home
page, because the proxy skips paths containing a dot and `[locale]` then matched the filename.

**Worth knowing:** this makes 11,252 pages reachable and connected. It does not make them
rank. A store page carries about 1,700 characters and nearly all of it is template; the only
thing on this site that exists nowhere else is a review, and reviews exist on eleven shops.

---

## The home page stopped calling one person a crowd

The home page's standout block said "most reviewed this month" over a shop with fourteen
reviews, all of them by the same person. The backend now requires three different reviewers
before anything is called a standout, which empties that block entirely today -- every
reviewed store in the catalogue has exactly one reviewer.

So the block gained a list that makes no such claim: **recently reviewed stores**, up to
eight, newest first, with no threshold. It says who wrote rather than how many reviews there
are -- "1 kişi", not "14 değerlendirme" -- because those stopped being the same number the
moment somebody visited twice.

This is a visible change to the home page, and it is the honest version of one: the page used
to point at a single shop and imply a crowd; it now points at eight and implies nothing.

---

## The categories have pictures of their own

Thirteen of the sixteen categories now carry the illustration drawn for them -- a bed, a sofa,
a stack of towels -- instead of a line icon standing in for the idea. They sit in the same
circle the icons sat in, filling it, because each was drawn with its own pale ground.

The three without a picture (decoration, tableware, storage) keep their line icon. Inventing
one for them would mean a different hand in the same set, and a set that is half one thing and
half another reads worse than a set that is openly two media.

---

## The search panel is the whole screen, and stays open when the keyboard goes

Three faults with one cause: a phone browser's viewport is not the one `inset: 0` measures
against. Safari's toolbars grow and shrink, so the panel was sized to a viewport nobody was
looking at and the search page showed underneath it; when the keyboard opened, the visible
area shrank again and took the field at the top of the panel off the screen, which is what a
fresh Safari tab did. The panel is sized by the dynamic viewport now, and where that is not
understood the script writes the visual viewport's own height into a custom property and
keeps it up to date as the keyboard comes and goes. The document behind it is held still
while it is open, so nothing can show through. The panel does not scroll; the list inside it
does.

**The tick above the keyboard kept closing it.** iOS dismisses the keyboard from that button
without sending a key at all, so the panel only saw focus leave -- and read that as "the
reader has gone". On a phone the panel is the whole screen: there is nowhere outside it to
have tapped, so losing focus now means the keyboard went away and nothing else. The ways out
are the arrow, the search button and Escape.

**And every suggestion is on the screen.** Four with a chevron under them made the reader
press to see the rest of a list that fits anyway; a panel whose whole job is to answer "what
shall I type" should not hold half its answers back. The two headings in it now sit the same
distance under the rule above them.

---

## The store page: a badge that was indented, a count that moved back, a link that was a form

The level under a reviewer's name carries a seven-pixel left margin, which is right where it
follows a name on one line and wrong under it: the badge sat stepped in from the person it
belongs to. It starts on the name's own edge in that card now.

The review count is beside the score again rather than under it. It was moved under on this
page a few days ago; asked for the other way round, it goes back -- "4,6 out of four reviews"
is one reading, and the way down to those reviews follows it.

"Mağaza bilgilerinde düzenleme öner" was an underlined line of text, which on this page means
"something to read" -- and it is not: it opens a form. It is drawn as a control now, a
bordered pill with the mark of editing on it, and the shop's own website above it keeps the
underline, so the two stop looking like the same kind of thing.

And that form opened where the store page had been left -- its own title above the fold. It
starts at the top.

---

## A sheet that left at the right speed and still looked snatched away

The levels sheet already spent the same half-second leaving as arriving, and it still read as
vanishing. The duration was equal; the *shape* was not. Both the sheet and its backdrop were
leaving on the arrival's curve -- fast first, slow last -- which on the way out throws the
sheet off the screen inside a sixth of a second and then spends the rest of the half-second
finishing a movement nobody can see. It leaves on that curve mirrored now: gently at first,
quickest at the end, and the ground under it holds its colour until the sheet is most of the
way gone rather than clearing first and leaving the sheet sliding over the live page.

## The back control was sitting on four headings

It is fixed to the top-left corner of the window, which is right on a store page -- the photo
is behind it -- and wrong on the four profile subpages, because each of them begins with its
title exactly there. Edit, reviews, messages, account: the arrow landed on the heading of all
four. It joins the flow on those pages, above the title, the way the legal and feedback pages
already did it.

The eight scores inside a review card are anchored to the right edge of their own column
rather than the left. The column is a fixed width, so a row whose stars and number came out
wider than it -- a larger system text size will do that -- used to spill past the card's
padding and sit against the frame. Anchored this way it can only spill inwards.

## The picture that was asked for

"Katkı seviyeni yükselt" carried a phone drawn in CSS -- a drawing of the idea. It carries the
photograph that was attached to the card: a phone in somebody's hand with the site being
passed on in a message, which is what the button under it does.

---

## The review is four stops now, and you can see where you are in it

The steps were a column the page scrolled past, which stops answering "where am I" exactly
when that is asked. They are a row across the top of the page and they stay there: four
stops, each wearing the mark its step already had. A numbered circle would have named every
step twice -- once by its position in the row, once by what it is -- and the position is
already said by where it sits.

**A third stop: what the visit was for.** "Did you buy anything?", and if so, what. Unanswered
is a real third state and not a silent no -- the step can be walked past and the review is
still a review. The item is the shopper's own words, because what somebody calls what they
bought is the vocabulary the next search for it will use; it is stored against the review
(`posts.purchased`, `posts.purchased_item`), and the column refuses a product name filed
against "no", as does the service.

**"Seçimleri temizle" under the eighth question,** where somebody who wants to start the
scores again is looking, and quiet, because starting over is the rarer of the two things to do
there.

**And the publish button stops saying "Aranıyor…".** It was borrowing the search page's
loading word, so the last thing a reviewer saw before their review was published was the
product telling them it was searching for something. It keeps its own name and is simply
disabled while the review is being written.

---

## The dock leaves the way it arrived

Saving a shop deleted the dock from the page in the same frame as the press. A thing that
slides in over half a second and then disappears between two frames does not read as "done",
it reads as the screen glitching. It now plays its arrival backwards -- same distance, same
half-second, same curve -- and is removed when that has finished. A reader who has asked for
less motion still gets none: the departure rule had to be named inside the reduced-motion
block too, because on its own it outranked the rule that switches the animation off.

## The saved list: whose review, which count, and no heading to read twice

The heading went off the screen and stayed in the document. The two counts underneath say
what the page is holding, so the sentence above them was saying it a second time -- but a
page with no heading at all is a page a screen reader cannot announce, which is a worse loss
than a repeated line.

A shop you have already written about now says so: "1 tanesi senin" beside the count. The
count itself is set the way the store page sets the same sentence, so one fact is written one
way in both places, and the tile the list is answering carries a mark pointing at the list --
a tile that is merely tinted reads as "this one is nicer", not as "this one is in force".

## The results list, second pass

"Detay" is "Puan detayını gör", which is what this control is called everywhere else in the
product. The breakdown is ruled between its rows and laid out in two columns, so every row of
stars starts in the same place: down a list of eight, stars that each begin wherever their
label happens to end cannot be compared at a glance, and comparing them is the only thing the
table is for. The notice at the end of the list is drawn as a notice -- its own ground, its
own colour, a mark before the words -- rather than as one more card in the list.

## Ten chains the catalogue was holding without knowing they were chains

"Why do some chain stores have no picture?" -- İşbir Yatak was the example, and the answer was
that it was not a chain as far as we were concerned: it was thirteen independent shops that
happened to share a name. The shops themselves said otherwise, in the one field nobody fills
in by accident: they all publish the same website.

So ten of them are in the registry now -- Yatsan, İşbir Yatak, İdaş, Lova Yatak, Bambi,
Modalife, Konfor Yatak, Halsa Yatak, Mutlu Halı, Cam Halı -- and `cmd/adopt-branches` linked
**165 shops** to them on that same field. Seven have a usable mark and now show it. Three do
not, and are left showing their initial: İşbir Yatak and Bambi publish no mark on their sites,
and Modalife's is white on transparent, which on a white frame is a blank square. A missing
mark is better than an invisible one.

---

## The results list says what it is showing, and what it is made of

Ten changes to the list a search answers with, and three of them are worth explaining.

**A store's mark, or its initial, in the same frame.** The list has carried no picture at all
since the provider was removed. A chain's mark is what a shop of a known brand looks like to
somebody scanning, and a shop that is nobody's branch shows its first letter in the same
frame, so the list keeps one shape all the way down.

**"Detay" opens the eight scores the average is made of** -- the same eight questions the
review form asks, in the same order, named by the same dictionary keys the store page uses.
They are read when the reader asks for them and not before: a results page carries up to
thirty stores, and fetching eight numbers for each to answer a question nobody asked is how a
list gets slow.

**The end of the list is a question.** A shop nobody can find here is a gap in the catalogue,
and the person at the empty end of a list is the one who knows about it. They are asked for
the thing that identifies a shop without ambiguity and that they already have: its place on
the map. Names and addresses arrive spelled four different ways; a Maps link is a place. It
goes in as an ordinary suggestion through the feedback the product already has, not into a
second inbox nobody remembers to read.

The rest: five stars filled by the score rather than one star and a number; "yorum" is
"değerlendirme"; "Mesafen" before the distance, marked with a pin, the way the saved list
says it; the "Boşa Gezme!" label above the score removed; the rule across the row under the
distance removed; "Boşa Gezme!'de yeni" said in the muted voice rather than the accent, which
is reserved for what a reader should read first; and the bare result count replaced by two
labelled facts -- how many stores are listed, and that they are ordered by distance from the
reader.

## English Home's mark has been a broken-image icon everywhere

The file has `y="0px"viewBox=` in its opening tag -- an attribute run straight into the next
one with no space. A browser parsing a page forgives that; a browser loading the same file as
an image does not, so the mark failed to decode on every English Home shop in the catalogue,
in the list, on the shop's page and in saved stores. Fixed in the file, and `cmd/brand-logos`
now refuses to write an SVG that will not parse: a brand with no usable mark shows its
initial, which the tool has always said is the right answer.

---

## The save dock fitted by one pixel, which is not fitting

The dock's two halves -- the reason on the left, the action on the right -- were measured to
sit side by side at 390 px with **one pixel** to spare. A pixel is not a margin: a phone
rendering text a shade wider (a larger system text size, a different font fallback) pushes the
action past the frame, which is exactly what was photographed. Worse, the way it failed was
ugly rather than tight: the button could shrink below its own label, so the words were painted
outside the coloured box and the action looked like it had come loose from the dock.

It wraps now. While both halves fit they sit as they always did; when they cannot, the action
takes a line of its own and the dock grows taller. Measured across 320-390 px at text scales
up to 1.4: nothing crosses the frame, and the action keeps its whole name at every one of
them. The dock also clips its own contents, so no future change can spill out of it either.

## Every star was indented by four pixels

`.rating-stars > span` set a four-pixel left margin meant for the score that follows the
stars. Every star is a span too, so the rule hit all of them: the first star sat four pixels
inside its row -- which is why the row of stars never lined up with the count underneath it --
and each gap between stars was four wider than the four the row already sets. Now the margin
applies to the score alone, the stars line up with the count under them, and the spacing
between stars is the one number the row declares.

## The saved list opens from the number that counts it

The two figures at the top of the saved stores -- how many are saved, how many are still
waiting for a review -- were facts to read. They are the way into the list now: press either
and the list below shows the shops behind that number. The page still opens on all of them,
which is the list it has always opened with, and the count that is in force wears the accent
so it is clear which of the two you are looking at. Reviewing everything you saved is an
answer too, so that case says so rather than showing an empty page.

The gap between the distance sentence and the action underneath it now matches the gap above
it: one rhythm down the block instead of two spacings that are nearly equal, which reads as a
mistake rather than as a pair.

---

## Test feedback now survives the last review and dock pass

The review wizard now opens its final check at the top, keeps the location glyph visible
inside its completed state, explains the eight-score requirement in a framed note, gives
the locked confirmation action a genuinely disabled appearance, and shows the calculated
average before the individual criterion scores.

Favourite rows now stack review counts beneath their score, align the distance label and
value, keep status glyphs in the status colour, and use even vertical rhythm around the
review action. Search, favourite and profile hints use larger illustrations without
changing the home hint; the search hint has the requested two-line copy. The mobile save
dock also uses a compact action that cannot escape its frame.

## The remaining review, profile, search and iPhone-location regressions were fixed

Store review cards now keep equal viewport gutters at both ends of their horizontal rail,
reserve enough room for five criterion stars, and deliberately break the long value label
after its slash. Profile navigation has quiet category marks, while its sharing invitation
is one framed object with the requested product-specific action and a compact phone preview.

Natural-language search suggestions now choose a category illustration from multilingual
trade vocabulary instead of repeating a generic shop mark. The recent and suggested groups
use matching divider rhythm. Search categories no longer inherit the old recent-search
`space-between` rule that pushed every label to the far edge on phones.

The first successful device-location read used to close its own sheet because the sheet had
been visible only through the absence of a location. The explicit action now keeps that sheet
open and turns the same control into its green confirmation before the visitor closes it.
Returning from iOS Settings also resumes a pending request through page visibility/focus,
covering Safari versions that do not publish permission-change events.

## The Turkish location fallback pointed in the wrong direction

The timeout message told people to enter their location “below” even though the manual
location field is above the message. It now points upward and names the location clearly.

Review-criterion numbers also return to ordinary dark ink, keeping the clay accent for
selected scores and actions rather than spending it on list numbering.

## Profile subpages stopped repeating the page they already left

Edit, reviews, messages and account routes now open with their own heading and back action
instead of repeating the parent “Profile” title above them. A user's review list no longer
loads store photography into each row, the profile save action uses the product accent,
and the contributor-level prompt has a lighter, more inviting icon treatment.

## Contextual docks now make their one useful word visible

Search, favorites, review-complete and profile docks now emphasize the meaningful word in
their message with the same restrained two-pass shine as “Bize sor!”. Their illustrations
are larger, the search instruction is grammatically complete, and confirmation copy no
longer ends in stray punctuation that competes with the compact dock treatment.

## Review identity and controls now read as one deliberate flow

Store-page review cards now put the contributor badge and its numbered level below the
author name instead of squeezing all three facts onto one line. In the review wizard, the
two-line criteria explanation is vertically balanced with its information icon, the store
context label has more presence, and the active step and primary action use the product's
accent treatment rather than a pair of heavy black fills.

## The phone search panel was not a reliable full-screen surface

The search header's entrance animation could become the containing block for its fixed
query panel in mobile Safari, trapping the supposed overlay inside the header. Mobile
search now removes that decorative animation so the panel is viewport-sized everywhere.
The keyboard's Done key dismisses only the keyboard rather than unexpectedly submitting
the query, and suggested searches no longer carry redundant trailing arrows.

## A desktop hover state was sticking under a phone tap

The yellowish rectangle around a bottom-navigation destination was not a focus ring or the
browser's tap highlight. It was our own hover background: Safari can keep `:hover` active
after a touch even when the device has no hovering pointer. The navigation hover treatment
now exists only on devices that actually support hover, so tapping on a phone leaves the
target on the same transparent navigation ground.

## The store save dock entered too early and squeezed its own action

The dock appeared during first paint rather than after the reader had reached the store,
and its flexible button could shrink narrower than its label, leaving the first and last
letters outside the clay fill on a narrow phone. It now waits one second, enters with the
same half-second motion as the home prompt, remains fixed while the page scrolls, and gives
the action its full text width. A very narrow screen stacks it rather than clipping it.
The invitation is hidden for saved stores and returns after unsaving.

## A saved store looked unsaved after a reload

The cached store page cannot carry an account-specific favorite flag, so its actions queried
the first 100 saved stores. Worse, they read each item as `item.store.id`, while the API
returns a flat store item with `item.id`, so even a saved store in that first page was missed.
An older save was also absent from the bounded page. Both paths made the save action and dock
claim the store was not saved. The actions
now read one store's favorite status through the authenticated BFF route. A response arriving
after the viewer clicks cannot override that newer local choice. The route reads our database,
never Google Places.

## Saved-store labels stopped fighting their own spacing

The distance pin inherited a different visual color from its label, and the numeric distance
sat slightly below the label despite belonging to the same fact. Both now use one line-height
and the icon takes the label color. On narrow screens, the saved-store summary deliberately
breaks its Turkish label across two lines rather than squeezing it into a wide single line.
The review count remains immediately below the score, on this page only.

## The notch on the right-hand point of every whole star

A star is drawn twice -- an empty one, and a filled one revealed from the left by the fraction
it is worth -- and the reveal was measured to the edge of the star's outline. The icon is
stroked, though: two units of stroke centred on a path in a twenty-four unit box, so a full
unit of ink is painted *outside* the outline on each side. Revealing to the outline therefore
left the outer half of the right-hand point grey, on every whole star, on every page -- wider
where the star is drawn larger, which is why it looked like a different defect in each place.
The reveal now runs to the ink rather than the path, and a whole star reveals the whole box:
nothing else is painted in that corner, and stopping a hair short is how a rounding error
becomes a visible sliver at 18 px.

## The distance, the mark beside it, and the answer when it is "no"

Six revisions to the saved-stores row, all of them about the same line.

**The number had drifted into the middle of the row.** The label and the number were two
columns of a grid that the explanation underneath also sat in, spanning both. A long
explanation -- the green "you are close enough" line -- widened those columns, and the number
went with them. It is a wrapping flex row now: label and number are one thing, and what
explains them takes a line of its own, whatever its length.

**Each line says what kind of line it is.** A pin on the distance, a tick on "close enough", a
warning triangle on "we cannot work this out". In a list of saved shops the mark is what the
eye reaches before any of the words.

**And "no" is now written down.** Out of range used to show nothing at all, which looks exactly
like not having worked it out, so the reader could not tell whether walking closer would change
anything. It says so, in the muted voice the other caveats use -- being far away is a fact, not
a fault. A shop whose point we placed ourselves still says only that: we cannot claim it is out
of range when we do not know where its door is.

**And the count moved under the score on the store page.** It sat beside a 38 px number, which
read as two figures competing on one line rather than one statement and the evidence for it.

---

## The open map gets its credit

The independent shops in the catalogue -- the ones that are nobody's branch -- were read from
OpenStreetMap, and OSM data comes under ODbL: attribution is a condition of showing it, not a
courtesy. So a store whose record came from the map now says so, on the store page, beside the
address the data describes, with the licence linked. The credit is driven by the row's own
source (`store_external_sources.provider='osm'`), so a shop later confirmed by its chain stops
carrying a credit it no longer needs, and nothing has to be maintained by hand.

The three documents that describe where store data comes from say it too, in all four
languages: chains publish their own store lists, and the shops that belong to no chain come
from the open map. Naming the source is part of the obligation; it is also simply true, and
the previous sentence had stopped being.

---

## Merging two rows that are one shop, from the store list

The matching queue settles rows arriving from a brand's list. Two rows already in the
catalogue that turn out to be one shop had nowhere to be settled at all.

Every row in the admin store list has a merge control now. It does not let anybody type an
id: it fetches what stands within 400 m and shows each neighbour with its distance, how alike
the names are and where it came from, with the merge button beside the one being merged away.
A shop 400 m off with a similar name is exactly the case this exists for, and also exactly
the case where reading the two side by side is what stops the wrong one being pressed. The
row it is opened from is the one that survives, and the confirmation says so in those words.

---

## The review flow keeps the page that says the visit was verified

Verifying in the background is right -- Discover has already been given permission, so asking
for another tap is asking twice. Walking straight on to the scores was not: the page that
says "your visit is verified, and it is good for thirty days" was drawn and left behind in
the same instant, so nobody ever read the one thing that step exists to tell them. The check
still runs on its own; the step now waits for "Devam et".

**And the review is published from a third page, not the second.** Eight scores given one
after another are easy to get wrong by a star and impossible to check while giving them. The
second page's button is "Değerlendirmeyi onayla" and it opens a summary of all eight with
their names; only that page publishes, and the "saved" dock appears only after it.

Smaller, from the same card: the two lines about how scoring works are marked and framed as a
note rather than reading like the next instruction; the eight criteria are numbered 1-8; each
label starts where its first star starts (a star's touch target is 44 px and the glyph inside
it 22, so the label is nudged the same 11 px, lining the two up on the eye rather than on the
box); and the shop being reviewed is the size of a page title.

---

## The save dock is the width of the dock it was asked to match

It was made edge-to-edge to line up with the navigation bar beneath it. What the card asked
for, twice, was the width of the dock on the home page, which is a different thing: a
floating card 316 px wide with 30 px of ground either side. Both are now that, measured at
375 px -- left 30, width 316, the same two numbers.

---

## The full-screen search panel was never fixed to the screen

Reported twice, patched once around the edge, and this is the cause. The search header holds
the last frame of its entrance animation -- `animation-fill-mode: both` -- which keeps the
element "animated": its transform stays a matrix and its clip-path an inset long after the
entrance is over. Either of those makes an element the containing block for anything `fixed`
inside it. The panel is fixed, so it was being fixed to that header: it began at the header's
top edge, ended at its bottom, and the page it opened from showed underneath.

`backwards` instead of `both` plays the entrance and then lets the header go back to being an
ordinary box. The `:has()` rule that used to switch the animation off while the panel was
open stays as belt and braces, but it is no longer what holds this up -- which matters,
because a browser without `:has()` got no fix at all.

## The bottom navigation, third time, with the actual measurement

The profile mark had no solid layer. The other three tabs are drawn here with two layers, an
outline and a fill that turns clay when you are on that page; the profile borrowed a
one-layer icon from the library, so standing on the profile page it was a thin clay outline
beside three solid clay shapes. Same colour, a quarter of the ink, which is what "different
colour" looks like. It is drawn here now with the same two layers as its neighbours.

## The search panel's two lists look like two lists

A clock against something you searched before, a shop against something to search for -- they
sat one above the other and read as one list. The shop marks cycle through four of the
product's own colours (honey is not among them: DESIGN.md keeps it for areas, not lines). The
two labels above them are quiet now rather than headings competing with what they label, and
the rows are left-aligned: with `space-between` doing the spacing, a short suggestion floated
in the middle of its own row while a long one started at the left.

## Each dock carries its own drawing

The shop seen through a magnifier where you search, the dog climbing its levels on the
profile, the dog holding a review card where reviews are waiting. A borrowed star stood in
for the last two and said the same thing twice. One band of light crosses each drawing as the
dock arrives and then stops.

## Smaller things

The levels sheet closes at the speed it opens -- leaving faster than arriving read as being
snatched away. The invite block is "Topluluğu güçlendir" and has one way to pass the link on
rather than two: the share sheet already offers mail among everything else the phone can do.
"Mesafeniz" is "Mesafen" throughout, and an empty review list says "Henüz değerlendirme yok".
On the saved list the review count sits under the score in the muted weight the home page
uses, and the review button appears only where a review would actually be accepted -- near
the shop, and not for a shop we placed ourselves.

---

## A fifth of a star was a fifth of the box, and showed nothing

A shop averaging 3.2 drew three full stars and a fourth that looked empty. The fill was
right -- 20% -- but 20% of what: a star's silhouette starts two units into a twenty-four unit
box and ends two before the other side, so a fifth of the *box* is 3.6 px of the corner where
there is no star. Measured across the ink instead, a fifth of a star is a fifth of the shape
somebody can see. Every star in the product is drawn by the same component, so this holds on
the store page, in the review cards and in the saved list at once.

## The review cards, and what the store page stopped saying

Seven changes from the store card. The frame around a review now ends under "Puan detayını
gör" and moves down when the detail opens, instead of standing at a fixed height with empty
card under the last line. A reviewer's name and the level they earned stay on one line: the
name is cut with an ellipsis rather than pushing the badge off the card, and in these narrow
cards the badge drops its "3. Seviye" caption, which was eating the name and repeating what
the badge already says. The eight criteria are two columns rather than two things pushed
apart, so every row's stars begin on the same line -- "Fiyat/performans" used to push its
stars further right than "Kasa hızı" did. The next review peeks 96 px instead of 60.

**Two things were removed from the page, and this is what that costs.** The "Topluluk
deneyimleri" heading is gone, and so is the sentence about verified visits that moved under
it yesterday. The page loses a section heading from its outline and a sentence of unique
text; the jump from the score still lands, on the section itself. The reviews are still
there, still in the markup, and still indexed -- what is gone is the words above them. Say
the word and the heading comes back.

The store's own website sits under the address now, where the rest of "where this shop is"
lives.

---

## The store score shows the arithmetic it is made of

A rating is the average of eight scores, so a reader can check it -- and one did: ten stars
across eight questions is 1.25, and the page said 1.3. The score carries two decimals where
there are two now, and one where there is one, so 4.5 is still 4.5 rather than 4.50.

(The 1.0 that was reported earlier was the older defect, from when a review's rating was
stored as a whole number. That storage is fractional since this morning, and the live page
had already moved to 1.3 before this change.)

**Three more from the same card.** The sentence about verified visits moved from beside the
score, which it does not explain, to over the reviews, which it does. The store's own site is
a link under the correction link rather than a framed panel -- the frame made one line of
text look like a section -- and it is called "Web sitesi". And the review rail's cards are
narrower than its container on purpose: the edge of the next review has to show, or nothing
says there is one. Measured at 375 px: rail 339, card 279, so 60 px of the next card is
visible.

---

## The email you sign in with is a fact, not a field

It was an editable input, which invited somebody to type a new address into it and expect
Save to carry the change -- and Save does not, because changing it takes a code. It is greyed
and read-only now, with a separate "change your email address" step underneath that asks for
the new address, sends the code there, and takes the code back.

## The levels sheet is shorter, and arrives the way the docks do

Two sentences and a five-row table were taking most of a phone screen, so the reader had to
scroll a sheet with nothing below the fold worth scrolling to. Only the vertical measurements
moved -- heading, paddings, table text -- and the width is untouched.

It also appeared and vanished in the same frame, which said nothing about where it came from
or that it had gone. It now slides from the bottom edge at the docks' own speed and curve,
in 0.52s and out 0.42s, and waits for the exit before it unmounts, because an element removed
from the page cannot animate its way off it.

---

## The docks say one thing each, and the mascot lost its square

Five changes to the floating docks.

**The faint square around the mascot was the mascot.** Its file is a square with its own
cream ground, opaque to the corners, drawn at 42 px inside a 48 px circle -- so its four
corners sat outside the circle and read as a shadow. It fills the circle and is clipped by it.

**The home dock has a lead and a call.** Everything before "Bize sor!" is the situation;
"Bize sor!" is what to do about it, so it is its own piece rather than the far side of a line
break: quiet muted lead, clay call at a heavier weight, with a band of light that crosses it
twice and stops. The card asked for a different typeface; this product has one family and
four weights (DESIGN.md), so the separation is made with weight, size and colour instead --
noted on the card.

**The search page has its own dock.** It was showing the home page's words; it now says what
you can type into the field above it.

**Favourites carries the review mark, not a heart.** A favourite is kept in order to be
reviewed, and the heart said "saved" -- the thing already done rather than the thing being
asked for.

**The profile dock says level, not badge**, which is what the rest of that page calls it.

---

## The profile shows your email, and can change it

Somebody could not see the address their account signs in with, let alone change it. It sits
under the display name now, in its own block with a rule above it, because it is not the same
kind of edit and must not be carried along by the same Save.

Changing it takes two steps: a code goes to the new address, and the change lands when that
code is typed back. The card asked for it to save on submit. It does not, and the reason is
worth stating: signing in here means asking for a code and reading it, so this address is how
somebody gets back into the account. Saved on the session alone, a borrowed phone would own
the account for good, and a typo would lock somebody out of their own reviews with nobody to
appeal to. The two steps are the same proof signing in already asks for.

## The bottom navigation's four marks are the same size

Signed in, the profile mark was a 20 px ring beside three 24 px drawings -- the same ink, a
quarter less of it, which reads as the lighter, greyer one of the four. Measured rather than
eyeballed: house 18x19, magnifier 18x18, heart 20x17, and the avatar alone in a 20 px box. It
is 24 px now like its neighbours.

---

## An approximate location says it is approximate

Five hundred shops stand where we put them rather than where their chain says they are: the
chain publishes no usable coordinate, so the row sits at the centre of the smallest place its
address names -- right to a few hundred metres, not to the doorway. The map pin and the
distance looked exactly as certain as everybody else's.

The store page says it under the address now, and a distance to such a shop is written with a
tilde and a line saying why. "Close enough to review" no longer appears on one: that is a
claim about where the reader is standing, and it cannot be made from a point we invented.

---

## The locale left the request, and the store page is cached

The proxy added an `x-locale` header to every request so a server component could read the
language without threading it down. That saved a parameter and cost the whole application
its cacheability: rewriting a request's headers in middleware makes every page dynamic, so
nothing could be cached and declaring a page static answered 500 on every view. An empty page
at the same address failed identically, which is how it was found.

Every route that renders text has its own `[locale]` segment, so each page reads the language
from the address it was asked for. `getServerI18n` takes it as a required argument rather than
an optional one on purpose: a page that forgets is a compile error, not a page that quietly
reads the request again. Nineteen pages and two components changed; the proxy still announces
the language on the way out, where it costs nothing.

The store page is built once and served for an hour now, instead of being assembled from two
backend round trips on every view. `x-nextjs-cache: HIT` on the second request, all four
languages rendering their own, in a local production build -- which is the check this needed
the first time and did not get, because `next dev` renders every page dynamically and cannot
show this class of fault at all.

One page could not follow: a not-found boundary is handed no params. It reads the locale from
the provider in the layout instead, which was given it by the address.

---

## The store page: caching turned on, then straight back off

**Turned off again, within the hour, because it broke the page.** Declared static, every
view in production answered 500: "page changed from static to dynamic at runtime, reason:
headers". `next dev` renders every page dynamically and cannot show this class of fault at
all, which is why it shipped; a local production build shows it in one request, and that is
the check this needed.

**What is in the way is the proxy, not this page.** It rewrites every request with an added
`x-locale` header so a server component can read the locale without threading it down, and
mutating request headers in middleware is exactly what makes a page dynamic. An empty page
at the same address fails identically -- which is how this was narrowed down, and it means no
page in this application can be cached while the locale travels as a request header.

**So the next step is named.** The address already carries the locale, in each route's own
`[locale]` segment; 62 calls to `getServerI18n` across 23 files would read it from params
instead, the proxy would stop rewriting request headers, and this page's one line comes
back.

What remains from the attempt is worth keeping and is still in place: the store is read
anonymously, the locale comes from the address rather than from a request header, and the
reader's own state -- saved shop, liked reviews -- is read in the browser after the page
arrives. Turning caching back on is one line once the last reader of the request is named.

The original entry follows.

## The store page is cached now, and the reader's own state arrives after it

A store page was assembled on every view: two backend round trips, one for the page and one
for its metadata, with nothing reused between visitors. It is built once and served for an
hour now.

Two things stood in the way and both are gone. The locale was read from a request header,
which makes a page dynamic; it comes from the address, which is where it already was. And
the store was read with the reader's own cookies, which is both what made the page dynamic
and what would have been wrong to cache -- it is read anonymously now, by a reader that
touches neither cookies nor headers.

What genuinely differs per reader is read in the browser once the page is there: whether
this reader saved the shop (already), and which of its reviews they liked (new -- one
request for all the reviews on the page, not one per card). Both only ever turn something
on, and a failure, including the ordinary one of not being signed in, leaves the page
exactly as it rendered. Pressing like wins over the answer that arrives from the server, so
a card cannot flip back under the reader's finger.

Nothing is prebuilt: eight and a half thousand shops in four languages is a build nobody
wants to wait for. The first visitor to a shop pays for rendering it; everybody after them,
for the next hour, does not.

---

## The store list shows where a row came from, and can be narrowed to the leftovers

A thousand rows in the catalogue came from the provider the product no longer uses: their
name and address are still there, and nothing stands behind them. The admin store list now
carries each row's origin -- the chain's own published list, typed in here, from a visitor,
or an unverified leftover -- with the brand under it, and a row of links narrows the table to
any one of them. Filtering is in the address rather than in a control, so the list of
leftovers can be bookmarked and handed on; it is worked through over weeks, not retyped.

Searching from inside a filtered view used to throw the filter away. It keeps everything
else in the address now and only replaces the search itself.

---

## The full-screen search panel: one way out, one bar, one action

Six revisions from the search card, all in the panel a phone opens when the field is
tapped.

**The bar stayed above the top edge.** The page the panel opens from is still behind it and
still scrollable, and on a phone the browser scrolls that page to bring a focused field into
view. The panel is fixed to the layout viewport, so it travelled with the page and the bar
ended up off the top of the screen -- you had to drag it back down to see what you were
typing in. The page behind is now held still while the panel is open, so there is nothing to
travel.

**One way out, and it is inside the field.** The corner close button is gone. The way back
is the arrow inside the field, where the magnifier sits on the page this panel opens from:
one control in one place doing the opposite job, rather than two ways out of a screen that
needs one.

**The bar is the width of the bar it replaced.** The panel's first row held three columns
for two controls that are no longer there; the field now spans the row, so it is exactly as
wide as the bar on the search page and the panel reads as that bar grown, not as a different
one.

**Recent searches moved off the page and into the panel.** They are the answer to "what
shall I type", which is a question somebody only has once they have opened the panel to
type. Three of them, above the suggestions -- a shortcut, not a record -- each still
forgettable one at a time, with clear-all on the heading's line. This takes a block of
changing text off the search page itself; the page keeps its categories, which are the
links that were carrying anything.

**The action is clay, not ink.** On paper-coloured ground a near-black slab reads as a
heading rather than as a button, and it is the only thing on that screen that does
something. Clay is what this product already uses for the thing to press -- the nearby
button, the distance, the category label -- so the panel borrows it rather than inventing a
colour, and white on it clears AA at just over 5:1.

---

## A saved shop reads its own state, and why the store page is still not cached

Whether this visitor saved this shop was rendered into the markup and trusted. That is fine
for a page built per request and wrong the moment it is cached, so it is read on the client
now; a failure, including the ordinary one of not being signed in, leaves the rendered state
alone.

**The store page still is not cached, and this is what is in the way.** The review rail
carries the same kind of viewer state -- whether you liked a review, whether you saved the
shop it is about -- rendered from the server and trusted by the card. Cache the page and
every signed-in visitor is shown their own like as un-liked. Moving that to the client is a
request per card unless a batched read exists for it, which is a real piece of work rather
than a flag on this page, and half of it shipped is a page that lies to the people most
likely to notice.

So the caching is blocked on that, deliberately, and the blocker is written down here rather
than left as an item somebody re-discovers.


## The matching queue has a screen

Every row in it is a judgement the importer refused to make alone: a published shop that
resembles one already in the catalogue closely enough to be suspicious and not closely
enough to merge on. That refusal was the right call -- guessing either way is how a
catalogue grows twins or loses shops -- but a queue nobody can open is just a slower way of
losing the row.

The two shops are shown side by side, with the distance and the resemblance that made it a
question, because the decision is a comparison. "The same shop" ties the existing row to
this brand, so the next import of that brand keeps it current; "a different shop" closes the
question and leaves both. Either way the audit log says who decided.


## Adding a shop by hand, with the neighbours shown first

The catalogue is ours now, so somebody has to be able to add a shop the importers do not
reach. The stores page has a form for it, and the form's own step is the duplicate check:
before it will add anything, it shows every shop already within four hundred metres, with
how far away and how alike the names are.

That check is shown rather than enforced, and the distinction matters. The importer decides
alone, with nobody watching, so it needs thresholds and a review queue for what falls between
them. An operator adding one shop can see what no similarity score got right -- that the row
seven metres away is this same shop under the name it had before -- and can equally see that
the row seven metres away is a different chain on the next unit of the same mall floor.
Refusing would be wrong about half the time. The only thing the form insists on is that the
question was asked at all: the add button stays unavailable until the neighbours have been
looked at.

A shop added this way is recorded as entered by an operator and verified now, which is the
strongest provenance this catalogue has; a brand import will not overwrite it.


## One store total in the panel, not two

The overview carried a second store card splitting the catalogue by where its rows came
from. That mattered while we were leaving a provider and stopped mattering the moment we had
left: every row in the table is ours now, and two counts side by side only invite the
question of which one is the real number.


## The panel's Google counter outlived Google

"Google'dan alınan: 1.076" sat on the admin overview beside "Mağaza: 1.076", which read as
though every store in the catalogue still came from Google. Nothing did: the provider rows
that figure counted were deleted, but it is an incrementally maintained counter and nothing
recounted it, so it kept showing the last number it ever had.

The useful figure now is how much of the catalogue a brand's own published list stands
behind, so the column holds that instead and is labelled "Markadan doğrulanan". The daily
metrics table keeps its old column under its old name -- what it recorded on the days it
recorded it was true -- and simply stops being written.

**English Home has a mark.** Its wordmark is drawn inline in its own page rather than served
as a file, which is why the collector reported none; `public/brands/english-home.svg` is
that wordmark. Its stores show it instead of an initial.


## The full-screen search panel was fixed to the wrong thing

- The panel that opens when the search field is tapped was never covering the page: the
  hero's entry animation holds its last frame, and an element holding a transform becomes
  the frame of reference for anything fixed inside it. So the panel stopped at the hero's
  lower edge and the results underneath showed through. It covers the screen now.
- In that panel the way back, the question and the way out share one row, the field is a
  single line with a frame of its own, the close is the same circle the store page uses for
  its own way back, and the suggestions heading is readable as a heading. The close and the
  search button belong to the panel and no longer appear on the search page behind it.
- "Show more" under the suggestions had nothing to show when the neighbourhood had only
  five or six phrases, and the panel could close under the finger before the tap landed.
  The seasonal pool now stands behind the neighbourhood's own phrases, and the panel asks
  where focus actually went rather than trusting what the blur event names.
- "Clear all" sat at the right edge of the recent searches but inside a box the width of the
  whole row, so its words stayed on the left and it never lined up with the row's own
  delete. The box is the width of what it says.
- The waiting screen is smaller, and the mascot fits it. The box is measured from the film
  rather than guessed -- the drawing occupies 1031 of its 1376 columns, starting 164 in --
  so the white margin is cropped exactly instead of the mascot's right-hand side.
- The navigation icons no longer flash a focus ring when tapped. The ring stays wherever
  there is a keyboard to navigate with.
- The store's save dock is the width of the navigation dock it stands above, is not shown
  on a store already saved, and leaves one second after saving rather than two.
- The store's score panel says how many reviews it is the average of; the way down to them
  is drawn as a way down rather than as a second button. A review on that page shows its
  score as the same five stars the panel uses, drops liking and sharing, keeps its author's
  initial a circle, and opens its eight scores from a line with a mark that turns.
- The review form's eight questions are laid out as the store's own score table, and its
  two opening sentences get a line each. The stepper's labels sit level with their bubbles;
  they were centred against a second row that no longer exists.
- Each saved store now shows how far away it is, and says so plainly when that is near
  enough to review it. Read from the device, and only where the browser has already granted
  it -- nothing is prompted, and a browser that has not is simply not asked.
- Turning the browser's location permission back on now finishes the press that was refused
  before it, instead of requiring a reload.
- The profile's "raise your contributor level" control is the store page's control, not a
  second one that resembles it.

## The language switch left the answer in the old language

- Search results, the out-of-scope sentence and the category names are written by the
  server in the language the search was made in. Switching language kept the old answer on
  screen, which is why "this sentence is not translated" was reported three times against a
  sentence that had all four translations from the start. Two causes, one behind the other:
  the stored answer was stamped with the language on screen rather than the language it was
  written in, so a Turkish answer was relabelled as English the moment the switcher was
  used; and nothing re-asked the question when the page survived the switch instead of
  being rebuilt. The question typed by the visitor and their chosen place are kept; only
  the answer is asked again.
- A `/tr` address handed an English-speaking browser an English page. The prefix is dropped
  to keep one address per page, and the address left behind is negotiated from the browser's
  own preference -- so the one thing the prefix asked for was the first thing lost. The
  choice now travels with the redirect, and the redirect is temporary rather than permanent
  so that a browser answering it from its own cache cannot drop that choice again.
- The invitation shared from the profile carried the site address twice: once inside the
  sentence and once in the field the share sheet prints beneath it. The sentence no longer
  carries it. Email, which has no such field, still appends it once.

## Store rating panel, review detail and contributor level

- Star ratings are drawn to the fraction. A 3.5 was rounded up to four stars, which
  overstated the store by half a point on almost every average; the fourth star is now half
  filled, and any part between works the same way.
- The panel is headed "Değerlendirme", says plainly that the store rating is the average of
  the eight scores and that only location-verified visitors can review, leads its row with
  the score itself, and offers a control that takes the reader to the reviews below.
- Each review can open the eight scores behind it. Reviews written before the criteria
  existed have nothing to open and show nothing.
- A contributor badge now carries its level number as well as its name, and a review's score
  is shown in the same colour as the store's own.

## The waiting screen showed the mascot at two different sizes

- The still is a portrait picture of the mascot; the video is a landscape frame with white
  bars either side of the same mascot. Fitting both into one square gave the still the full
  height and the video barely half of it, so the mascot appeared large and then shrank. The
  box is now the shape of the mascot inside the video and both are drawn to its height, with
  the video's white bars clipped against a white card. The whole card is smaller.

## The review form's last visual change is reverted

- Framing the eight questions like the store's score panel was rejected on review. The plain
  ruled list is back, along with the two-column form layout it had before.

## The store's save dock is back

- It was hidden for any store the visitor had already saved, so on every later visit it was
  simply gone. "Hide it two seconds after saving" is about that action, not about the store's
  state; the dock is part of the page and carries the saved colour when the store is saved.

## Google sign-in has a way out of giving up

- The Google script loads when the sign-in dialog opens, and on a slow first connection the
  ten-second wait ran out and the dialog said Google was unavailable with no way back. That
  is the reported "it failed the first time and worked on a fresh page". There is now a
  retry, and by then the script is usually cached.

## Russian broke the location row

- "Изменить местоположение" is far wider than the Turkish label and took its width from the
  one column meant to flex, so the place name was squeezed to nothing and overlapped. On a
  phone the row is now two: the place and the cross, then the control beneath. That holds in
  any language, including ones the product has not been translated into yet.

## Navigation shapes, and why the accent could not be applied by a stylesheet

- The current destination now fills its own shape with the accent, with the doorway of the
  house left open. The icon library draws the house as two paths with the door first, so
  filling both paints the house over the door and no ordering in CSS can undo that. The
  three shapes are drawn here now: a solid layer holding both outlines with `evenodd`, so
  the door is a hole in the fill rather than a shape buried under it.
- The coloured panel behind the current destination is gone -- a filled shape is the whole
  signal -- and the profile mark is an outline when it is not the current destination.

## The receipt after a review was dismissed by the page's own scroll

- "Your review was saved" is shown on a page that scrolls itself to the top on arrival, and
  that programmatic scroll fired the same listener a reader's scroll would. The receipt was
  therefore dismissed in the instant it appeared, however long its timer said it should
  stay. Its life is now the timer alone; only the invitations still yield to a scroll.
- Its flag is also spent when the receipt has been shown rather than when the effect first
  reads it, so the effect can no longer consume it on one pass and find nothing on the next.
- The notification is narrower on a phone as well -- the phone rule was still full width, so
  narrowing the desktop rule changed nothing where anybody actually sees it -- and it rises
  and leaves more slowly.

## The confirmed-location colour was written where it could not win

- The button turns green when the device location is confirmed. The rule said so, and lost:
  `.button.primary` carries the same weight and lives in the stylesheet loaded second, so
  the button stayed black while its label said the location was confirmed. Written beside
  the rule it has to beat, it works -- and with it, "the button does nothing" goes too,
  because the colour was the only thing that ever said it had.

## The mascot no longer changes size while you wait

- The still and the video are two different pictures: one framed portrait, one landscape.
  Drawn one after the other they are never the same size, which is what "it starts large and
  shrinks" was, three reports running. The swap is gone from the ordinary case: the video is
  what is shown, drawing its own first frame while it buffers. The still appears only when
  the video will not run at all, and only after a grace period.

## Search panel, recent searches, store rating and profile

- The full-screen search panel closes from a mark on the same line as the language control,
  its magnifier is now the way back out, and its suggestions carry a heading of their own.
  Its rows start at their own top, so the suggestions no longer float in the middle of the
  space below the button.
- Recent searches: the heading holds one line, the clear control and the per-row delete share
  one right edge in a lighter weight, and an expanded list can be collapsed again.
- The store rating panel separates the sentence the whole rating rests on -- only visitors
  who verify their location can review -- from the sentence explaining the arithmetic. The
  reviews below centre their two actions, and the score breakdown clears the rule beneath it.
- The profile heading is the product's word for the page rather than the brand plus the word.
  The level label sits under the middle of the badge it labels, the level name is not printed
  twice, and the levels explanation opens where somebody is looking at their own level --
  read from the About document rather than written out a second time.
- Favourites show the same filled stars as the store's own breakdown.
- Document pages and the feedback page open at the top, using the same correction the store
  page already had: a page carried the scroll offset of the page you came from, so the back
  arrow at the top was above the fold on arrival.
- A search answer is remembered with the language it was written in. Restored under another
  language it put a Turkish answer on an English page; the question is kept and the answer
  re-asked.

## A chosen location no longer disappears, and the pages that depend on it work again

- The device-permission watcher cleared the visitor's location whenever the geolocation
  permission was anything other than "granted" -- and it is "prompt" for everyone who has
  never granted it. So a place somebody typed in themselves was discarded on every load,
  together with the saved preference and the server-side copy. Withdrawing the device
  permission now withdraws only what the device gave us; a typed place is the visitor's own
  answer and survives.
- With no location there is no search box, which is what "the suggested searches do not
  appear" was. Nothing about the suggestions themselves was wrong.
- Recent searches no longer wait on an unrelated neighbourhood request before they render.
  They had been gated behind it, so a slow or refused call hid history that had arrived.
- Search history is now readable and clearable without an account. Browsing is anonymous by
  design and a visitor's searches are recorded against their session, but reading them
  required a signed-in account, so every anonymous visitor was told they had never searched.

## The loading state on the favourites and profile pages drew its own title

- Both pages render a deliberately blank block while the session resolves, with the page
  title carried for screen readers only. The class that hides it, `.sr-only`, was never
  defined in any stylesheet -- so the title was drawn as ordinary text on an otherwise empty
  page, with the footer directly beneath it. That is the flash that was reported twice. The
  utility now exists, and the block holds the height the page is about to have.

## Search bar, location button and bottom notification

- The search row is centred on its field, so the magnifier and the Ara button sit level with
  the words instead of being pinned to the top of a box that grows with them.
- "Use current location" and its confirmation are now one control in one bubble: it turns
  green in place rather than being replaced by a separate line, and it stays pressable.
- The bottom notification is narrower, rises from below the edge of the screen and leaves
  the same way, and the review receipt takes itself off after three seconds. An invitation
  still waits for the reader to scroll; a receipt has said all it has to say.
- The current destination in the bottom navigation now carries the accent colour.
- The full-screen search panel closes from the top right corner, and its "more suggestions"
  control is a full-size target.

## Documents index and feedback pages gained the shared back arrow

- Both now carry the same back control as every other document page: real history where
  there is any, and the documents index otherwise.

## Favourites summary counts what it says it counts

- "Awaiting review" now names itself that, and its number is genuinely the saved stores this
  visitor has not reviewed. The favourites query never returned the reviewed flag, so the
  field defaulted to false and the count was simply the total.

---

## Search feedback, favourites, and footer documents now match the current journey

- Search feedback keeps the mascot at one stable, prominent size, removes the four
  competing progress captions, and describes the actual visible outcome: stores are being
  ordered.
- Favourites now state both the total saved-store count and how many saved stores the
  viewer has not reviewed yet, using data already returned with each store.
- Every footer document now exposes the shared back control and falls back to the legal
  index when the page was opened without usable browser history.

## Search results remain scannable without paid list photos

- Re-grouped each photo-free search result into one list row with a dedicated store-identity
  area and a separated community/action area.
- Kept the desktop treatment as a restrained list with an internal hairline instead of
  replacing results with a stack of decorative cards.
- Compacted mobile result actions, limited long category summaries to two lines, and made
  store transitions easier to identify without adding another paid Places field.

## Search cards now match the low-cost Places response

- Search results show Boşa Gezme! community evidence together with the inexpensive Google
  identity, business-status, and Maps-link fields. Photographs, Google rating counts,
  opening hours, and phone numbers no longer reserve space or imply that list requests
  fetched store-detail data.
- The web search DTO now mirrors the backend's lazy-detail contract. Rich Google fields are
  loaded on the store page and cached by the backend after the first detail visit.

## Store reviews stay inside the page and read as community content

- Store-detail reviews no longer reuse the feed card as a bordered card inside another
  bordered card. Author, score, verified-visit state, date, and actions now form one flat,
  consistently sized review surface.
- The horizontal review rail is constrained to its real content column, exposes the next
  card without widening the desktop page, and snaps one readable card at a time on phones.
- On store pages the back control now belongs to the top of the page instead of following
  the reader over reviews, while the mobile save dock wraps its supporting copy without
  colliding with the primary action.

## Store scores and search recovery now explain the next useful action

- Store detail leads the review action with the Boşa Gezme! score and all eight community
  criterion averages. Missing criterion evidence is shown as missing rather than as a
  fabricated zero, and community reviews form a keyboard-scrollable horizontal rail.
- A rejected out-of-domain search is now a compact framed message with the canonical home
  and living categories directly beneath it. Query suggestions are no longer repeated
  after the product has said that it cannot serve the request.
- The four mobile navigation destinations now share one icon colour and active treatment;
  Search and Profile no longer look like a different class of action.
- Profiles now read their next contribution threshold from the API, show the exact reviews
  remaining, carry the requested next-reward marker, and offer native link sharing plus an
  email invitation. Sign out lives with the other account actions instead of in the public
  identity summary.

## Discovery shortcuts and mobile favourites stay within their intended bounds

- Location failures now appear as a compact dismissible notification panel instead of an
  inline paragraph that can be missed in the page flow. It stays at the lower edge on a
  phone and in the lower corner on a wider screen, with keyboard focus and an accessible
  close label.
- Sofra and Dekorasyon remain searchable and manageable taxonomy categories, but no
  longer appear in the Ev ve Yaşam discovery shortcut list. Mutfak and every store
  assignment are unchanged.
- Long store names can now shrink and wrap inside mobile favourite cards instead of
  forcing the entire page wider than the viewport and clipping the photograph and copy.
  Every fixed-size photograph is anchored to the same top edge when a wrapped name makes
  one card taller than another, so touch and hover frames no longer shift its position.

## Search, profiles and contribution actions now keep their context

- Two reviewable logo directions now live under `design/logo-concepts`: the requested
  editorial wordmark with a pin-shaped final exclamation, and a compact BG monogram for
  small product surfaces. They are proposal assets only; the approved production mascot
  and application icons remain unchanged until a direction is selected.
- Discovery keeps categories visible while location changes, turns recent searches into an
  explicit “My recent searches” disclosure whose row rules sit between the entries, and
  shows its suggested searches from the query field itself. Once
  device location succeeds the control remains as a green confirmation instead of asking
  for the same permission again; a later location failure is no longer mislabelled as a
  stale-permission reload problem.
- Profile sections now have stable, linkable routes. The profile root is a concise index,
  search history was removed from it, and authenticated pages use a neutral progress mark
  while session state is being checked instead of flashing a false signed-out profile.
- Review criteria are five inline stars without duplicate numbers. Selecting a score fills
  every preceding star, while the native radio controls retain full keyboard and screen
  reader semantics.
- The store page has a persistent save dock and a floating back control. The save state is
  shared with its existing store action because both controls are rendered by the same
  component rather than maintained independently.
- Home and discovery show the requested delayed brand note; favourites show its review
  reminder, and a completed review schedules the badge note on the destination store. Each
  appears after three seconds and disappears on the first scroll.
- Favourites no longer apply the row-link layout to the separate review action, and the
  search result save frame is tighter without shrinking its label.

---

## Five returned cards, and three of them were the same kind of mistake

- **"Değerlendirme yap" is described once now.** It was written in three places -- the store
  page's panel, the store page's action row, the favourites row -- and three descriptions of
  one control drift apart. They had: the favourites copy inherited a smaller type size from
  its row, which is why it kept coming back as "not the same button". Everything that makes
  it look like itself lives in one rule; each home adds only where it sits.
- **The search row is centred again, over the text column and only the text column.** The
  offset was right; the width was not. There is another 28px gap and a 20px chevron to the
  right of the text, so a box that ran to the row's edge put the content 24px off. The
  chevron is pinned to 20px so the arithmetic cannot drift with an icon default.
- **The "shadow" on the profile review frame is a 6px top border.** It belongs to the feed
  card, where the frame is a full-width panel under a photograph; in a list row it is a
  heavy dark rule with nothing to weigh. Reported twice as a shadow, because that is what it
  looks like. The row takes the ordinary 1px edge, and the frame is wider now.
- **Deleting a review said nothing when it failed.** The catch reset the button and stopped,
  which from the outside is indistinguishable from a button that does nothing -- and that is
  how it was reported. A failure is now visible.
- **The location panel no longer closes the instant the device answers**, so the
  confirmation that replaces the button is on screen long enough to be seen.
- **A refusal while the browser says the permission is granted** is now named for what it
  is: the page was loaded under the old decision and only a reload revisits it. Telling
  somebody to allow location there is wrong advice -- it is already allowed.
- The location list no longer replaces itself with "searching" on every keystroke; the
  previous answers stay while the next ones are fetched. The status line is inset to the
  same edge as the results, and a long place name wraps in its own slot instead of pushing
  "Değiştir" and the cross onto another line.

---

## One axis for a search result, instead of a centre that kept being wrong

- The save action and the two scores were centred, and twice that centring was reported as
  uneven. Measured this time rather than reasoned about: those blocks sit outside the card's
  grid, so "centred" meant centred in a box that began at the text column and ran on to the
  row's right edge -- past the text, over the 28px gap and the chevron beyond it. The content
  landed 24px right of the text column's own centre.
- Aligning to the text column removes the question rather than retuning the answer: the
  title, the address, the scores, the save action and the Google link now all begin at the
  same place, and there is nothing left to be off-centre against. Verified: all five start
  at the same pixel.
- Social links are five to a row in a fixed grid rather than a flex row that wrapped wherever
  it ran out, so the two rows line up under each other in the order asked for.
- Copy: the home search placeholder and the discovery intro, in four locales.

---

## Tapping the location field zoomed the whole search page

- Safari on iOS zooms the page when the field it is focusing computes below 16px, and there
  is no way to decline that other than not being below 16px. The location field was 13px --
  it inherited the size of its own label -- so tapping it threw the search page into a zoom
  the visitor then had to pinch back out of.
- A floor under every field on mobile rather than a size for that one field: the next form
  somebody adds is covered without anybody remembering this. Fields that deliberately run
  larger keep their size.
- Copy on the home page: the feed title, and the discovery section's heading and intro, in
  four locales.

---

## The search page: nine revisions, and one real bug among them

- **Granting the location permission mid-session now works without a reload.** The page was
  listening for consent being taken away and for nothing else, so somebody who went into
  browser settings, turned location back on and pressed "use my location" got nothing: the
  page still held the refusal it was given on load. The grant is acted on where it happens.
- **The panel no longer replaces the suggestions underneath it.** Opening "change location"
  threw away the recent searches and the categories the visitor was about to pick from, and
  put them back only once the location was settled. It opens above them now.
- **Once the device has answered, the button that asked it stops being a button** and
  becomes the same confirmation the review flow shows, so "the location is settled" looks
  the same in both places.
- "Değiştir" was underlined text between a place name and a cross, which reads as a third
  piece of the sentence. It is a control now, with an edge and a target of its own.
- The location field carries the same single cross the two search boxes carry, so clearing a
  typed district is one gesture rather than three different ones.
- **The page ground is the canvas again.** Honey is an area colour and it was covering the
  whole top of the screen -- title, panel, suggestions and categories all sat on it, which is
  what read as "the page is yellow". It keeps its job as an accent.
- **A category is a word, not a card.** Each row was a bordered box holding a bordered icon
  tile holding an icon -- three surfaces to say "Halı" -- and eight of them in a grid read as
  a control panel. The rows carry no surface of their own now: a fine rule between them, the
  name in the type that matters, the count as quiet meta. They finally match the list of
  recent searches beside them instead of arguing with it.
- Copy: the page title, the location prompt, and the profile sign-in line, in four locales.

### What this costs in search

- The "BOŞA GEZME, BİZE SOR." line above the title is gone from `/discover`. It was unique
  text on an indexed page, though the same words remain in the footer of every page, so what
  is lost is one prominent placement rather than the phrase itself.
- The "Yakınındaki yerleri keşfet" heading is gone from the location panel. It only appeared
  once a location was already chosen, so it was never in the first render a crawler sees.

---

## The review screen is two steps and eight scores

- Verify the visit, then score eight things: product availability, value, layout, staff
  attention, staff knowledge, checkout speed, returns, cleanliness. All eight are required.
- The photograph step and the "tell us about it" step are gone, and so is the separate
  overall rating -- the store's rating is now the average of the eight, worked out on the
  server. Two places computing the same average is two places that can disagree.
- Reviewing a store now sits with the store's other actions -- save, directions, call, share
  -- rather than only in the panel underneath them. It is the fifth thing you can do about a
  store; the panel below keeps the contribution progress.
- **Nothing was deleted.** Every published review keeps its text and its photographs in the
  database; the web stops showing them. One line brings them back.

### What this costs in search, said plainly

- `/reviews/<id>` pages were carrying one thing no other page had: the words somebody wrote
  about that shop. They no longer show it, so those pages are now near-identical to each
  other -- store name, a score, a date. Expect them to be treated as thin and to compete
  with one another rather than each standing on its own.
- The page description is rebuilt from what is still true and still varies -- the store, the
  place, the score, the author -- but that is thinner than a sentence a person wrote.
- `reviewBody` is omitted from the structured data rather than sent empty, because an empty
  one reads as a malformed review rather than a review without words.
- **What would restore it:** publishing the eight scores on the review page. They are unique
  per review, they are text, and they are the thing the review now actually is. That is a
  separate piece of work and it is not in this change.

---

## Your own reviews are a list, so an entry became a row

- The profile's past reviews stacked a full-width photo on top of a full-width frame. The
  photo's lower edge sat directly on the frame's upper edge, which is the "shadow along the
  top of the box" that was reported -- there is no shadow in the stylesheet, only two edges
  meeting. Side by side there is no such edge.
- The store's picture is a thumbnail at the size the favourites page uses, the score and the
  date sit in a frame beside it, and share and delete are icons: a row of actions spelled
  out in words reads as a sentence rather than a row.
- The review's own text is gone from these entries. You wrote it; the list is for finding it
  again, not for reading it back to you.

---

## Returned review round: the store page's card, the row's save action, two tables

- **The store page's review card is its own card now.** On a store's own page the store is
  the page, so the card no longer repeats it or sends the reader away from it: no store
  name, no store photo, no save control, no link to the review's comments, no written text.
  What is left is the judgement -- who wrote it, what they scored, and when, with the date
  moved under the rating where it is read. One `surface` prop replaced the two booleans that
  were accumulating for the same purpose.
- **The save row under a search result was 24px left of the column it belongs to.** The
  offset was written as 234px; the photo column plus the gap is 230 + 28. The Google link
  beside it already used the real number. Space on the left and space on the right are the
  same now because they are measured from the same thing.
- **The favourites action wore the shared class but not the store page's colours**, which
  live under `.review-invitation`. It takes the fill and the lettering from the same tokens
  the store page does, and stays on one line.
- **The home page and the about page showed the same five contributor levels in two sizes.**
  They share one set of table rules now instead of two that drift.
- **The location alert lost its retry button.** The control that failed sits one line above
  it; a second button was a second way to press the same thing. The text is back on the
  left, where the rest of the panel reads from.
- LinkedIn moved to the right of Snapchat in the footer.

---

## The legal pages did not fit a phone, and it was one table doing it

- Measured at 375px: the document was 496px wide on the privacy policy and 688px on the
  cookie policy. Not a stray long word -- every paragraph, every heading and the page title
  were all sitting off the right edge together, because the page itself was wider than the
  screen.
- `body>main` is a flex item, and a flex item defaults to `min-width:auto` -- it refuses to
  be narrower than its widest child. One table with `min-width:460px` therefore set the
  width of the whole page, and the cookie table, whose own content will not compress below
  652px, set it wider still. The scroll container around the tables could never engage,
  because nothing ever asked the table to be narrower than the page.
- `min-width:0;width:100%` on `body>main` pins every page to the viewport and lets the
  tables scroll inside their own container, which is what they were wrapped for. This is a
  layout rule, not a legal-page rule: any page that ever holds something wide was exposed
  the same way.
- Separately, the legal type scale was set for a 900px column and was still 20px on a
  phone, about five words to a line. One step down across the family below 600px.

---

## The legal index set its headings a third smaller than the documents it links to

- Measured on the live pages rather than in the stylesheet this time: every one of the
  twelve documents renders its section headings at 32px, and the index that links to them
  rendered its entries at 23px. Two pages one click apart, in the same footer, in two
  different sizes. That is the difference that kept being reported after each rescale.
- The index uses the documents' heading treatment now.

---

## The review action sat outside the row it belonged to

- The border that separates one saved store from the next was on the link, not on the row,
  so the action added beside the link fell below that line and read as belonging to neither
  store. The border belongs to the row now, and the action sits in the text column directly
  under the rating -- inside the row, where it was asked to be.
- It is the store page's control unchanged: same frame, colour, type and height. Only its
  width differs, because a row is not a page.

---

## Two small revisions: the banner's other languages, and where a location error sits

- The banner's second step is plural in all four languages now, not only Turkish.
- The location error moved from the top of the panel to directly under the box it is about.
  At the top it read as a warning about the whole screen; under the box it is plainly an
  answer to what was just typed or pressed. Its retry button is centred in the frame: it is
  the one thing to press there, and a control starting at the left edge read as a footnote
  to the sentence above it.

---

## A results page was reading thirty store pages nobody had asked for

- Every store link in a list was prefetched, so opening a results page quietly rendered up
  to thirty store pages on the server and read each of them from the backend -- for a page
  from which somebody opens one store, or none. That burst is what emptied the rate limit
  and made those same stores answer "not found".
- Lists do not prefetch now. The wait after a tap is therefore visible, so the store route
  has a loading state: the same shapes in the same places, so the real page fills them in
  rather than jumping into view.

---

## The search results survived on a desktop and vanished on a phone

- Reported as coming back from a store page on a phone and finding the search as though it
  had never happened, while the same journey on a desktop kept it.
- The results were held in session storage, which a phone under memory pressure throws away
  along with the discarded background tab. A desktop tab is rarely discarded, which is why
  only one of the two was affected.
- They are held in local storage now, which survives that, and stamped with the time they
  were written so a search from yesterday is not what somebody is returned to. An hour.

---

## The last "yorum" on the review flow

- The button that publishes a review said "Yorumu paylaş". Everything else on this journey
  has said "değerlendirme" for weeks; this was the last place the old word survived.

---

## Two of the fourteen footer pages were never part of the legal system

- The report kept coming back after each rescale, and the reason is that the rescales only
  reached twelve of the fourteen pages the footer links to. The legal index and the
  feedback form are built outside the shared legal renderer, so every time the documents
  were raised these two quietly stayed where they were: descriptions at the site default
  against 20px documents, a narrower measure, a smaller heading, smaller field labels.
- They are on the same scale and the same measure now. The complaint was never that a page
  was too small on its own -- it was that pages sitting next to each other in the same
  footer did not match, which is exactly what this was.

---

## Five small revisions across the site

- **Favourites.** The signed-out screen said saved stores "will appear here", which
  describes a page rather than telling somebody what to do; it now says to sign in. The
  signed-in empty state is one short sentence instead of an instruction about a heart icon
  nobody has seen yet. And each saved store carries the review action, the same control and
  the same wording the store page uses -- outside the row's link, because an anchor cannot
  hold another anchor and starting a review is not a step on the way to opening a page.
- **"Yorum" became "değerlendirme"** in the one place it had been missed: the line shown
  where a store has no community rating yet.
- **The store page's two section headings** -- what the shop is, and what people found
  there -- were set at the same 11px as every incidental label on the site. They name the
  two halves of the page, so they are two steps larger, and only those two.
- **The catalogue-store mark** is a band now rather than a caption: it spans its column and
  is closed top and bottom by a rule. At 11px, hugging its own text, it read as one more
  small label, and the whole point of it is that the store is there on purpose.
- **Pinterest and Snapchat** joined the footer. The Pinterest link supplied was a personal
  invite carrying an invite code and the sender's id -- following it would have invited
  every visitor on somebody's behalf -- so the public profile it resolves to is what is
  linked.

---

## Seven returned product revisions were implemented from their latest feedback

- Home's city signal now uses the requested “most searches made” wording, and its search
  field has the same wrapping, Enter-key and clear behaviour as Discover.
- Store-correction messages name the store in the reader's language and no longer expose
  an internal store identifier. Their correction title and pending-reply state now have a
  distinct visual hierarchy in both the operator queue and the private profile.
- A person's review history removes repeated identity, comment and top-corner controls;
  the delete action sits beside Share, and the rating/date panel matches the review image
  width. The redundant Profile eyebrow was removed.
- Store pages show only media contributed with a review inside that review. A store-cover
  fallback is still used in the feed, but is no longer repeated on every review of the
  store whose page is already open.

## Test feedback now changes the real interaction, not only its copy

- Clearing Discover's search field and pressing Search now cancels any in-flight request,
  removes the query and saved result snapshot, and returns the page to its initial state.
- Search-result ratings and the save-for-review action now use the full content column as
  their centring axis and sit closer to the store summary instead of drifting left in an
  intrinsic-width box.
- Privacy and legal reading pages use a materially larger body, subheading and table scale
  with a wider measure, addressing the rejected small-text revision as a shared legal-page
  rule rather than another page-specific exception.
- Favourites and Profile use content-shaped neutral session skeletons. They no longer flash
  unrelated mascot artwork while authentication is being checked.
- Store and review routes suppress delayed browser scroll restoration for the first settled
  frames, preventing cached navigation from reopening below the top of the page.
- Home's contribution-level answer now renders the canonical table already present in the
  About content. The five distinct level illustrations remain a separate asset task rather
  than being imitated with one repeated image.

## Home now explains the visit loop before asking for trust

- The discovery banner is shorter on desktop and mobile, and its photograph is anchored
  at the top so the requested crop comes from the bottom. The two revised product lines
  now describe advanced search optimisation and outcome-focused criteria without the
  filler wording, with equivalent changes in every shipped locale.
- The decorative discovery mascot was removed from the home masthead at every breakpoint;
  its asset remains available for a future state where it can carry meaning rather than
  compete with search and store photography.
- Home questions and profile panels now reveal their full height smoothly from top to
  bottom and collapse back upward through a browser-independent grid transition. Their
  controls expose expanded state to assistive technology and retain a reduced-motion path.
- The home masthead no longer consumes the first viewport like a campaign hero. Its
  display size now follows the product type scale and the opening spacing is tighter, so
  search remains the first action while the headline still leads.
- A wide editorial banner beneath the search field turns the product loop into three
  concrete steps: discover, visit and review. Its copy is localized in all four shipped
  languages, remains HTML over a decorative image, and reflows into a readable mobile
  sequence rather than shrinking a desktop composition.
- The “What is Boşa Gezme!?” row now opens like the other home-page questions and reads
  the canonical summary from the About document, removing another duplicate content source.
- Monthly standout stores moved from Discover to Home, where they now sit beside live
  rolling-30-day city and category rankings. Empty signals disappear instead of being
  filled with editorial guesses, and the search screen is focused on the active search.

---

## Catalogue stores now look the same everywhere

- Administrators can mark or unmark a catalogue store independently from paid promotion
  and manual categories, with both states visible in the store table.
- Search results give catalogue stores a restrained warm band and a translated editorial
  label above their categories. Store detail repeats the same label immediately below the
  hero image, so the marker does not disappear between list and detail.

---

## “We read every message” now has a visible answer

- A signed-in person's product feedback now stays available under **My messages** in the
  private profile, showing both pending messages and the team's reply. Anonymous feedback
  is deliberately not claimed later by matching an email address.
- The operator feedback queue can answer account-owned feedback without leaving the admin
  surface. Sending the answer closes that queue item; the original message remains intact.

---

## Search work survived leaving Discover, and six small requests stopped drifting apart

- The Discover link deliberately erased the current query and results, so returning from
  Home, Favourites or Profile looked like a lost search. Navigation no longer destroys the
  tab's existing search snapshot; starting another search remains an explicit action in
  the search field.
- A result's save action is now a labelled, full-width decision beneath the centred
  Boşa Gezme!/Google scores. It says that the store is being saved for a later review,
  stays on one line, and no longer relies on a heart whose meaning had to be guessed.
- The Favourites page now describes stores saved for reviewing, gives the page label and
  heading their intended hierarchy, and aligns rating stars with their text.
- Home-page answers open and close at a calmer pace. Footer social destinations are now
  recognisable platform marks with accessible names instead of a row of competing words.

---

## "This store is no longer in our list" was said about stores that were

- Reported as urgent: store pages failed on first open and worked after a refresh, on many
  stores, with the message that the store had been removed.
- Every failure to read a store was being turned into a 404. A timeout, a 500, a request
  that never got out -- all of them came back as "this store is no longer in our list",
  which is a claim about the store rather than about us, and it was false. And it stuck:
  the router caches a not-found answer, so the page kept refusing until the visitor
  reloaded, which is exactly the shape of the report.
- Only a 404 from the backend now means the store is gone. Anything else is a failure to
  read and says so, with the one thing that helps -- asking again. The same correction is
  applied to reviews and profiles, which told the same lie.
- The store link in a result list is not the cause and the search gate is not the cause;
  what the gate changed is which searches call the provider, not how a store page is read.
  What made this visible is a separate question, and the honest answer is that it is not
  yet known -- but the page no longer converts a passing failure into a permanent verdict.

---

## Four pages opened part way down

- The scroll-to-top fix went onto the review page and nowhere else, and the same thing was
  reported on favourites, the profile and a store page. The cause is shared: a page that
  paints a loading state first is short while it paints, so the scroll offset carried over
  from the previous page survives and is restored against the taller content that follows.
- It is one shared hook now rather than a patch on one page: force the top once, in a
  layout effect, as soon as the content settles. The store page renders on the server and
  needed the same nudge on mount.

---

## The play button kept coming back

- Third round on the same symptom, so this stops relying on being told. The events cover
  the ordinary stops, but a phone that pauses a muted background loop on entering low
  power mode does not always announce it -- which is why it returned.
- The element is now asked outright, four times a second, whether it is still running. The
  still image returns the moment it is not, whether or not anything was announced.

---

## Sub-headings in the legal pages were smaller than the text under them

- Reported again after the tables were put right. Only the privacy policy uses sub-headings
  -- eight of them -- and they were set a point below the body they introduce, which is the
  one thing a heading may never be.

---

## The correction form's fourth choice fell to its own line

- Four choices are one question, and a fourth chip wrapping made "Diğer" read as a separate
  thing rather than the last of four. They share the row evenly now.
- The thank-you message says what the card asked for.

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
