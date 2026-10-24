# Client intake sheet: Southwood Tree Service

Filled 2026-10-24 (America/Toronto) from public, no-login sources only: the live site (read in a real browser), the public Google Maps listing (no sign-in) and the public social links. Nothing below is invented. Every UNKNOWN is marked "UNKNOWN". Things that look wrong or conflict are listed under KNOWN ISSUES. Do not fill an UNKNOWN with a guess; leave it out of the build and list it in the facts-audit.

```
CLIENT INTAKE

THE BUSINESS
Business name: Southwood Tree Service
Slug: southwood
Owner name / how they like to be named: UNKNOWN who the owner is. The About page says "Owner Operated" but names nobody. The Contact page names two people: Dan Molyneux and Cody Penner. Reviews and the Google owner replies say "Dan and Cody" / "Cody and Dan". Use "Dan and Cody" as the two contacts; do not call either one "the owner" or "founder".
Live site URL: https://southwoodtreeservice.wixsite.com/southwood   (a free Wix address, not a custom domain; the Google listing's website link, dsouthwoodtrees.wixsite.com/southwood, 301-redirects to this one)
Other live pages to rebuild (list): The live site is multi-page and the home page IS the services page. Pages: / (Services, tab title "Services | southwood"), /about, /gallery, /videos, /faq, /contact. Run tools/live_styles.py on each of these, not only the home page.

CONTACT (copy exactly from the live site)
Main phone: Header line, exactly: "TREE-MERGENCY? Contact Us: (204)295-5886 OR (204)510-5438". Footer and Contact page: Dan (204) 295-5886, Cody (204) 510-5438. The header "tel:" links all dial Dan's number, 204-295-5886.
Second line / 24-7 emergency line: No separate emergency line is shown. The site says Tree Emergencies are handled "24/7" on the same two numbers. Google also lists (204) 295-5886 only.
Email shown on the site: Dan: d.southwoodtrees@gmail.com. Cody: c.southwoodtrees@gmail.com. The "Free Quote" button links to mailto:d.southwoodtrees@gmail.com.
Address shown on the site (or "none shown"): none shown (site and Google listing both show no street address). Do not invent a street, postal code or neighbourhood.
Hours (or "not shown"): not shown on the live site. The live site only says Tree Emergencies "24/7". Google's public listing shows "Open 24 hours". If you use hours, attribute them to the Google listing and flag it; do not write "open 24 hours" as the site's claim.

GOOGLE AND SOCIAL
Google Business Profile URL (and CID if known): https://www.google.com/maps/place/Southwood+Tree+Service/@49.8537806,-97.1528398,11z/data=!4m8!3m7!1s0x52ea73646f116073:0x4825c73d383db389!8m2!3d49.8537806!4d-97.1528398!9m1!1b1!16s%2Fg%2F11h13016tf
   CID (decimal): 5198780410619605897 (from hex 0x4825c73d383db389). Knowledge-graph id: /g/11h13016tf. Category shown: "Tree service".
Rating / number of reviews / date read: 5.0 stars, 16 reviews, read Sat 2026-10-24 about 1:13 PM Toronto time (EDT) from the public Maps page. It showed 15 reviews on 2026-10-23, so the count moves; re-read it at build time if you can and use the number you actually see.
Facebook: https://www.facebook.com/SouthwoodTreeService/   (linked from the live site; public page title is "Southwood Tree Service | Winnipeg MB". Posts and photos are behind a login wall and were NOT read.)
Instagram: https://www.instagram.com/southwoodtreeservice/   (linked from the live site; behind a login wall; content NOT read)
TikTok / other: none found. None linked on the live site.
YouTube channel: none found. The live site footer has a YouTube-style icon with no link, and no channel turned up in search. Do not link or name a YouTube channel.

WHAT THEY DO AND WHERE
Services, in the live site's words and order (home page; heading "SERVICES", intro: "Southwood Tree Service provides a wide range of private and commercial tree related services."):
 1. TREE REMOVAL: "We have the expertise and equipment to address both small and large sized tree removal projects."
 2. PRUNING: "Need help with trimming/pruning your existing trees, pruning away from your house, deadwooding? Let us help."
 3. TREE CLIMBING: "Do you have a tree on your property you need removed or pruned where equipment can't access it? We are Professional Climbing Arborists!"
 4. STUMP GRINDING: "Safely and efficiently remove unsightly tree stumps from your yard or property with Southwood Tree Service."
 5. CABLING & BRACING: "Have a tree that needs saving? Reinforcement can safely improve or restore a tree’s structural integrity."
 6. PLANTING: "Planting trees and shrubs can make a world of difference in your yard, we are here to help!"
 7. TREE STRUCTURE ANALYSIS: "We can perform tree structural analysis to determine current and potential risks to you and your property."
 8. TREE EMERGENCIES: "If you or your property is threatened, damaged or obstructed by fallen trees or branches, we are here to help 24/7."
 9. Animal Rescue (a separate block under the services): "We offer cat/animal rescue from trees. They don't always come down on their own! If an animal has been in a tree for longer then 24 hours, give us a call."
 Also on the site: "private and commercial" work. No other services (no firewood, hedge, or storm-cleanup pages).
Areas served, in the live site's exact wording: "Winnipeg and surrounding areas" (About page) and "Winnipeg or Surrounding Areas" (footer call-to-action). No town list, no radius. Do not name towns or neighbourhoods.
Insurance / certifications on the live site (ISA number, WSIB, liability amount): FAQ, verbatim: "Yes, We are Fully Licensed and Insured with $2,000,000 Liability Insurance. We can provide you with a certificate of our insurance at your request." The site says "Certified Arborist" / "Professional Arborists" (footer: "In need of a Certified Arborist in Winnipeg or Surrounding Areas?") but shows NO ISA number, NO certifying body, NO licence number and NO WSIB. Do not print an ISA number or "ISA Certified". Do not name any licence body.
Years in business or founded (only if the site says so): not stated. About page: "...for many years." Footer says "© 2018" (that is a Wix template year, not a founding year). One Google review (Jeff Wood) says he hired them "in 2019", so they were operating by 2019, but do not turn that into a founding date or "since 2019". UNKNOWN founding year.
Numbers the site states that can be stats (jobs, years, reviews): "$2,000,000 liability insurance" (FAQ). 24/7 for tree emergencies. From Google: 5.0 rating and the review count read above. No job counts, no year count. Do not make any.
What they say makes them different (their words):
   - Tagline: "Your Trees, Our Passion"
   - Badge row: "Professional Arborists", "Satisfaction Guaranteed", "Affordable Prices" (see KNOWN ISSUES on "Affordable": use the words, never a dollar amount)
   - "Owner Operated"
   - "Excellence and Professionalism: Our trained Arborists are committed to providing professional, safe and cost effective services. We keep our staff up-to-date on all safe work practices, follow Industry standards, and take the required time to train in the proper use of all tools and equipment."
   - About quote: "At Southwood Tree Service, our customers come first. Not only do we pride ourselves in meeting our clients' expectations, we understand the value of repeat business and in maintaining an excellent reputation in our community. To us, business is more than just a bottom line."
   - "Get a Free Estimate!" (footer) and, on Contact: "we're always happy to provide a free consultation"
   - Payments accepted (FAQ): Cash, E-Transfer, Cheque, Visa, Mastercard
   - FAQ on cost, verbatim, contains no prices: "Each tree is unique and requires a unique approach. Location, surroundings, targets, tree condition and technical procedures needed to get the job done are all factors we take into consideration when quoting your tree."
   - FAQ has 7 questions: What Is A Certified Arborist? / Why Use A Certified Arborist For Tree Care? / Why Shouldn't I Just Hire The Guy Down The Street To Take My ... / Do You Have Insurance? / What Type Of Payments Do You Accept? / How Much Does It Cost? / Why Should I Prune My Trees And Shrubs Instead Of Letting Th... Answers expand on click. Read them from the live /faq page; the live text has typos ("inporperally") so fix typos only in your rewrite and mention it in the facts-audit.

BRAND (from the live site; measured with Playwright computed styles at 1440 px on 2026-10-24)
Colours (hex): primary #fe8500 (orange: hero band, buttons, nav highlight, section headings "SERVICES", badge row text, footer band) / secondary #000000 (black header strip and the black logo artwork) / accent: none separate. Footer lower band is the same orange at 70% opacity (about #feaa4c on white); treat it as a tint of the primary, not a new colour. / text #303030 (also #000000 for some service text, #3c1d17 on the Animal Rescue text, #20303c minor) / background #efefef page, #ffffff panels.
   NOT brand, do not use: #a0138e (Wix's purple "create your website" banner), #0000ee (default link blue), #edf7f7 (pale Wix section fill behind the hero).
Corner radii (buttons / cards / images): 0px on everything that is theirs (square buttons, square images and cards). The only rounded element on the page (17px) is the Wix ad banner button, so it is NOT brand. Use square corners. (Their circular arched logo-text is artwork, not a UI radius.)
Fonts (live site, Wix-licensed webfonts, so NOT self-hostable): Adobe Caslon semibold serif for the hero business name (97px at desktop); Museo 700 for nav, headings, buttons and the tagline; Noticia Text 400/700 for service titles (25px) and body (15px); Open Sans for "TREE-MERGENCY?" and some small text; Museo Slab 100 and a Wix system font (wixFreemiumFontW01-65Medi) only in minor spots. For the demo pick free, self-hostable lookalikes (a Caslon-style serif, a rounded geometric slab for Museo, Noticia Text itself is on Google Fonts / OFL) and say in the facts-audit which you used.
Logo files (path or link; transparent PNG or SVG?): https://static.wixstatic.com/media/3c83c1_2dd6b54fec4a4f22ba800396d073c6ad~mv2.png   Transparent PNG, 2400x1668, ALL-BLACK artwork (no colour): an oak tree with a rope climber hanging from a limb, the tagline "Your Trees Our Passion" arched over the top, a flat ground ellipse, the wordmark "Southwood" over "Tree Service" between two rules. It needs a light backing (it vanishes on the orange band or black strip; on a dark/orange area use a white version made by recolouring the PNG with a CSS filter or a pixel-recoloured copy, saying so in the facts-audit). No SVG exists.
Colours that must NOT be used / things they dislike: UNKNOWN. Master-prompt bans apply (no cream, no circles, no em dashes).

MEDIA
Photos supplied (paths): No files are supplied inside this repo or this build. Everything is public on the live site at static.wixstatic.com. Run: python3 _build-kit/tools/fetch_media.py _build-kit/intake-southwood.md /tmp/southwood-media --videos https://southwoodtreeservice.wixsite.com/southwood/videos (it reads the table below and downloads the originals OUTSIDE the repo; photos land in /tmp/southwood-media/img, videos in /tmp/southwood-media/video) then look at every photo before using it.
   logo.png  https://static.wixstatic.com/media/3c83c1_2dd6b54fec4a4f22ba800396d073c6ad~mv2.png
   Gallery, 24 job photos in the live gallery order (the filename is just our local name; file, source URL, pixels, what is in it):
   job-01 https://static.wixstatic.com/media/3c83c1_2e9c2bbbe2234fba876563c530d7e21b~mv2.jpg 1080x1345 climber in orange hi-vis topping a tall bare spar beside a house roof, deep blue sky
   job-02 https://static.wixstatic.com/media/3c83c1_627c4f07c2f14c7d9ffd49589773a7b0~mv2.jpeg 1800x2400 climber at the top of a stripped trunk holding a Canadian flag, black and white
   job-03 https://static.wixstatic.com/media/3c83c1_1fa5892f6bc043f28d58f19325ffd788~mv2.jpg 2400x1800 climber in harness and helmet roped onto a trunk top, pale sky, close crop
   job-04 https://static.wixstatic.com/media/3c83c1_6f9fe43786774fc2be92dfed698fd517~mv2.jpg 1080x1350 two tall spruce with a climber high in one, fence and rooftops below
   job-05 https://static.wixstatic.com/media/3c83c1_d0224dea3506455f81eb3c8189fe39a6~mv2.jpg 2400x1800 looking up into a big elm canopy at a climber in hi-vis, blue sky
   job-06 https://static.wixstatic.com/media/3c83c1_5d9a5f999b2d4dd2bf7830e7f383d805~mv2.jpg 1800x2400 climber high in a backyard tree behind a grey house with patio chairs
   job-07 https://static.wixstatic.com/media/3c83c1_d931f72533174e87acf8cd34ce7574d7~mv2.jpg 1800x2400 climber in a blue helmet on spikes cutting a trunk top with a chainsaw
   job-08 https://static.wixstatic.com/media/3c83c1_9418c57685424a8c93159f52df0959c2~mv2.jpg 1800x2400 climber in a tree behind a garage and wooden deck, branches piled below
   job-09 https://static.wixstatic.com/media/3c83c1_e7aa918afb9d4851bf38445742b25f58~mv2.jpg 1800x2400 tall stripped trunk next to a bungalow porch mid-removal
   job-10 https://static.wixstatic.com/media/3c83c1_f5f0594bf7c8468d80a5aa7bf38fe40d~mv2_d_3024_4032_s_4_2.jpg 1800x2400 climber in orange lying out on a big limb inside a dense green canopy
   job-11 https://static.wixstatic.com/media/3c83c1_1dddb3917d5840e496d8d96ab32f32f7~mv2_d_2448_3264_s_4_2.jpg 1800x2400 tall spruce being topped, power lines and evergreens
   job-12 https://static.wixstatic.com/media/3c83c1_03fa806a9a90420c89afa13e578fba39~mv2.jpg 1800x2400 climber in a tree seen through an open wooden gate along a narrow side yard
   job-13 https://static.wixstatic.com/media/3c83c1_6d86cbac70ab40fdbdaa3f17e43a3e55~mv2.jpg 1800x2400 tall mature trees over a backyard fence, climber small in the crown
   job-14 https://static.wixstatic.com/media/3c83c1_b4b2a13ad042424cb187bb6e1ba557f0~mv2.jpg 1800x2400 backyard with black chain-link gate and tall trees, climber up in the leaves
   job-15 https://static.wixstatic.com/media/3c83c1_c2b4162583db472db90a081f6f73e4d4~mv2.jpg 1800x2400 climber's point of view down a rope over a backyard garden
   job-16 https://static.wixstatic.com/media/3c83c1_1112bc0b1e914b2f98df82d8922185c3~mv2.jpg 1800x2400 narrow side yard, crew member on the ground and a climber high in a tree
   job-17 https://static.wixstatic.com/media/3c83c1_36252c660331424b9af80e68db1f09af~mv2.jpg 1800x2400 backyard lawn with a stripped spar left standing before the final cut
   job-18 https://static.wixstatic.com/media/3c83c1_00587f38a8da4ce9a1aa20f9f750671a~mv2.jpg 1800x2400 climber in a tall tree squeezed between two older houses
   job-19 https://static.wixstatic.com/media/3c83c1_c53d3c4f44c74aa6aedd243c900180be~mv2.jpg 1800x2400 looking straight up a tall tree at a climber in orange among bright green leaves
   job-20 https://static.wixstatic.com/media/3c83c1_11ef158f66b043cf83a7c59c926ba0f1~mv2.jpg 1800x2400 climber in hi-vis working a limb right beside a house wall and AC unit
   job-21 https://static.wixstatic.com/media/3c83c1_217050962d6a4cdaa8c7d4ae4d733958~mv2.jpg 1080x1345 garage with arched doors and a tall spruce being reduced, blue sky
   job-22 https://static.wixstatic.com/media/3c83c1_63a378e18f4046ee9b4962501cedf882~mv2_d_4032_3021_s_4_2.jpg 2400x1798 big bare tree over a backyard patio table with a climber in the crown, winter
   job-23 https://static.wixstatic.com/media/3c83c1_521d7f140eb348c491db972cbdef26a3~mv2.jpg 1280x1057 climber in orange high in a bare tree against deep blue sky
   job-24 https://static.wixstatic.com/media/3c83c1_a386866881bb40dbbdc54239c93a40f5~mv2.jpg 1080x809 winter job: climber in a bare tree above a snowy yard and fence (small, use small)
   (The pixel sizes are what we downloaded; confirm after download. These descriptions are a quick look, not captions from the site; do not quote them as facts about a specific job, address or year. The photos show climbers only: none shows a truck, chipper or stump grinder, and no before/after pairs.)
Video supplied (paths): 8 videos are on the live /videos page (Wix-hosted). Titles are the site's own. Wix video id, length, size:
   Backyard Ash Tree Removal (rigged down every piece with ropes)  3c83c1_63d45f84021f4f5e987a453b0db6b870  44 s  1280x720
   Backyard Boxelder Tree Removal (drive to job then removal)  3c83c1_fbd88a804d8d4014a99c822bb9064305  123 s  1920x1080
   Backyard Ash Removal In A Tight Spot  3c83c1_7728a2817d4543a58e124b4e15b443db  92 s  1920x1080
   Staying Hydrated On The Job! (30ft up)  3c83c1_90ffe750e1ce44cabce870926e1d8e37  11 s  1920x1080
   Zip Lining Ash Limbs  3c83c1_a946b9b1fdd24f95bdb3dd9966e2d879  56 s  1920x1080
   Zipling Limbs (zipling the limbs away from the clients fence into the front yard)  3c83c1_a3dfdb48f5654a37be6e175335ce72f6  60 s  1280x720
   Backyard Ash Tree Ground Drop  3c83c1_edf39517387148ddad4f7c2355990759  15 s  1280x720
   How much wood would a woodchuck chuck if a woodchuck could chuck wood?  3c83c1_d0ed2dc3969e4f39afab83deea0e4c56  35 s  1280x720
   Downloaded videos are named by their Wix video id (e.g. 3c83c1_7728a2817d4543a58e124b4e15b443db.mp4), so match them to titles with this list. The Wix direct .mp4 URLs return 403. tools/fetch_media.py gets them the way a browser does (it opens /videos, catches the playback .m3u8 the player requests, and saves it with ffmpeg). If the download fails, do NOT fake a hero video: build the hero from photos and say so in the report. Self-host any video you use (no Wix embeds), trim and compress it, and always add a poster.
   Hero suggestion (a suggestion, not a fact): a short silent loop cut from the 1080p boxelder or tight-spot removal videos, or a photo hero from job-01 / job-03 / job-19. Look at the frames yourself.
Look on their YouTube / Facebook / Instagram for more? no. YouTube: none found. Facebook and Instagram are login-walled for us, so do not scrape them. Use only the media above.
Photos or people we must NOT show: UNKNOWN. Everyone shown is a climber on a job, face mostly covered by a helmet. Show only the photos above. Do not add stock photos or AI-generated images. Do not name the climber in any caption (the site does not caption who is pictured).
Vehicles or equipment to draw as line art (which, and which photo to trace): none supplied. The photos contain no truck or chipper. The only equipment view is the chipper in the "woodchuck" video (35 s); if you want a line-art vehicle, trace only a chipper frame from that video. If that is not clean enough, SKIP line art entirely and use a different signature idea. Do not draw a generic truck.

REVIEWS (verbatim, typos included)  Source: public Google Maps listing, no sign-in, read 2026-10-24. 5.0 stars, 16 reviews in total. Only these 5 review texts loaded without signing in; the other 11 are UNKNOWN, do not make them up. Dates are Google's relative dates as read on 2026-10-24. All five are 5 stars. Names are shown as Google shows them; show first name + last initial.
1. "Hired Cody and Dan for removal of two large spruce trees, including stump grinding in 2019.  Just hired them again for tree removal and pruning of our cedars.  Excellent job!  Honest, quick response, reasonable rates, great clean up, professional, and great work!  Would highly recommend these two for future jobs!  Thank you both!"   Jeff W.   Google   (3 years ago)
2. "We have used Dan and Cody quite a few times now, and the service and job they do is fantastic!
Thanks."   Keith L.   Google   (a month ago)
3. "Top notch service, highly recommend. Had a dead 40’ oak tree in my backyard quite close to a sunroom and neighbouring pine , they came and took it down to the roofline as requested quickly and without any issues at all, then cleaned up the debris amazingly. Speed was excellent, service was excellent and customer service, excellent again. Very happy I used them."   Matthew G.   Google   (10 months ago)
4. "We hired Cody and Dan for extensive work: tree removal, stump grinding, shrub removal and tree pruning/trimming. This all came with an immaculate clean up at an affordable price. They were skilled professionals and were a pleasure to work with!
I will only hire this company in the future and highly recommend Southwood Tree Service to anyone needing this service.
Thanks for all your hard work!"   J S.   Google   (Edited 2 years ago)
5. "I am a repeat customer who is totally impressed with their work again! Once a customer, they don't forget you, they try to accommodate your requests. Trimming that solved issues around a chimney, left the tree healthy and improved the shape of the tree. Removal of a large tree too close to the house was done with ease and clean up was immaculate Professional, honest and affordable pricing...the only company I will call. Thanks Dan and Cody for all your hard work!!"   Greg K.   Google   (2 years ago)
   Quote rule: when a card shows only part of a review, cut at a sentence end and keep the words exactly; do not stitch parts of different reviews. The words "affordable" / "reasonable rates" are the reviewers' words and are fine as quotes. Do not use the two "Response from the owner" replies as reviews.

PAGES
One page / home + service pages / other: The live site has no separate service pages, so do not invent them. Recommended build (a proposal, not from the site; change only if you have a reason and say why): Home (hero, the 8 services plus Animal Rescue, gallery strip, reviews, areas, call/quote), About, Gallery and Videos (can share one page), FAQ, Contact. Keep the "Free Quote / Get a Free Estimate" call to action. The Contact form is shown but DISABLED in the demo (master prompt rule).

KNOWN ISSUES
Anything on the live site that looks wrong or inconsistent:
 - Two phone numbers: Dan (204) 295-5886 and Cody (204) 510-5438. The header "Contact Us" link and the "Free Quote" button both go to Dan only (tel 204-295-5886 and mailto Dan). Show both numbers as the live site does; neither is labelled "emergency".
 - The Google listing's phone is Dan's number only.
 - "Certified Arborist" / "Licensed" claims have no number, body or certificate on the site. Quote them only as the site's own wording, flagged as "unverified" in the facts-audit. No ISA number, no WSIB.
 - Footer "© 2018" is a Wix leftover; there is no founding year anywhere. Do not state one. (A third-party directory, glonstruct.com, says "Est. 2014" and "Licensed Manitoba Arborists" and a postal prefix R3T. That is NOT from the business or its Google listing, is unverified, and must NOT be used.)
 - "Affordable Prices" appears as a badge; the master prompt bans prices, not the word. Use the phrase only as their badge wording, never with a dollar amount or "cheap", and flag it in the facts-audit.
 - Typos on the live site: "inporperally" (FAQ), "longer then 24 hours" (Animal Rescue), "Zipling" (video title). Fix them in the rebuild, listed in the facts-audit.
 - The home page tab title is "Services | southwood", the site is on a Wix free subdomain, and a Wix "create your website" banner sits above the header. Do not copy the banner.
 - Google's review count changed from 15 (2026-10-23) to 16 (2026-10-24).
 - Google review dates are relative ("3 years ago", etc.), so do not show exact dates or "recent".
 - Only 5 of 16 Google review texts were captured.
Anything we must not say: no founding year or "since"; no "ISA Certified" or any licence number; no street address, neighbourhood or town list; no prices or dollar amounts (the $2,000,000 liability figure is the one allowed number, because the live FAQ states it); no "best in Winnipeg" or ranking claims; no "family owned" (the site only says "Owner Operated"); no hours claim as the site's (Google says "Open 24 hours", the site says only that emergencies are 24/7); no invented crew size, years, job counts, awards, or guarantees beyond the live wording "Satisfaction Guaranteed".
```

## Unknown fields (summary)
1. Who the owner is (Dan, Cody, or both) and how they like to be named.
2. Founding year / years in business.
3. Street address, any town list, service radius.
4. Business hours on the live site (Google says "Open 24 hours").
5. ISA number, certifying body, licence number, WSIB.
6. A separate emergency number (none shown).
7. YouTube channel (none found), TikTok (none found). Facebook and Instagram content unread (login wall).
8. 11 of the 16 Google reviews (text not captured).
9. Photos or people not to show; colours or styles they dislike.
10. Any truck / chipper / equipment photo to trace as line art (none supplied).
11. Exact hex of the lighter footer band (derived: the primary orange at 70% opacity).
