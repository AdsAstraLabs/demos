# Review checklist (Luke's pass after Claude returns the site)

Open the Claude report first. If it has no "NEEDS HUMAN JUDGMENT" list or no screenshot list, send it back. Then do this pass. About 15 minutes.

## 1. Report check (1 min)
- [ ] Report has the summary, checks run, screenshots, open issues, judgment list, and "Not pushed. Waiting for bingo."
- [ ] Nothing says "passed" for a check it could not run.

## 2. Side by side with the live site (3 min)
- [ ] Open the demo and the live site in two tabs. The demo is clearly better.
- [ ] Phone number, services, areas, years and certifications match the live site.
- [ ] Rating and count are from Google. Reviews are word for word.
- [ ] No "based in". It says "We serve ...". Area wording matches the live site.
- [ ] No prices, no made-up claims, no em dashes.
- [ ] Open `facts-audit.md`: read "Flags for Luke" and decide each one.

## 3. Look and feel (3 min)
- [ ] It belongs to this client. It does not look like Tree King, Hedge King, Bison, CBL or Tree Tech.
- [ ] Brand colours and corners are right. No circles. No cream.
- [ ] Sections feel different from each other. The transitions below the hero are interesting and clean.
- [ ] It has soul and colour. Copy is short and plain.
- [ ] Stars are gold with a gleam, and the rating is real.
- [ ] Logo is the client's own, only cleaned and upscaled.
- [ ] Line-art trucks look like the real trucks, with organic outlines.

## 4. Hero (2 min)
- [ ] Video plays, no pause button, poster shows before it loads.
- [ ] Logo, cards and text do not cover the subject. Scrub the video to the late scenes.
- [ ] Text is easy to read over the video at every moment.
- [ ] Scroll cue is visible, has room, and scrolls smoothly to the next section.
- [ ] Headline does not touch the buttons on a phone.

## 5. Phone and short windows (3 min)
- [ ] 390 wide on a real phone or the screenshots: nothing overlaps, no sideways scroll, body text is easy to read.
- [ ] 360 and 320 wide: still fine (320 can be a little tight, not broken).
- [ ] Short windows 1440x640, 1280x600, 390x640, 390x700: not crowded, scroll cue shrinks or drops, headline fully visible.
- [ ] A heading is never covered by an image or a card (the Tree Tech bug).
- [ ] Mobile menu: logo visible when it opens. Call button works and does not hide a CTA.

## 6. Motion (1 min)
- [ ] Reveals are staggered and gentle. Hero eases in.
- [ ] Hover effects show on desktop only.
- [ ] Stats count up and end on the right numbers. No layout jump.

## 7. Contrast (1 min)
- [ ] Open `contrast-audit.md`: table is there, every row passes, changes are listed, "not covered" is honest.
- [ ] Orange or light green text on small phone screens is dark enough.

## 8. Safety (1 min)
- [ ] View source: `noindex,nofollow` meta, LAUNCH BLOCK comment, no analytics, forms say `onsubmit="return false"`.
- [ ] `robots.txt` says `Disallow: /`.
- [ ] No outreach was sent. Nothing was pushed.

## 9. Decide
- [ ] Targeted feedback to Claude (list only what to change, nothing else).
- [ ] Or say **"bingo"**. Then Claude does the normal push of this demo's folder only, waits about 10 minutes, and byte-checks the live copy against the local build and confirms the other demos are still up.
