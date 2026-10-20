Rebuild the website hippointhebathtub.ca (Hippo in the Bathtub, an Ottawa swim school) as a fast, SEO-ready marketing site. This is a MIGRATION from WordPress: every URL, every word of copy, every image and every booking link below must carry over. Do not invent content (no fake reviews, stats, staff, prices or hours). Never use em dashes anywhere.

## Rendering and URLs (critical for SEO)
- Every page must be server-rendered or prerendered so its HTML already contains its own <title>, meta description, canonical, Open Graph tags and full body copy (no client-only rendering of content).
- Keep the EXACT existing URL paths, with trailing slashes, as the canonical URLs:
  /  /about/  /services/  /services/low-ratio-group-classes/  /services/coached-lessons/  /services/birthday-parties/  /services/specialty-classes/  /promotions/  /contact/  /swim-program/  /terms-conditions/  /aquatic-centre-cancellation-policies/
  The same path without the trailing slash must also resolve (redirect to the slash version).
- Redirects: /register-online/ -> https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs ; /swimlikeahippo/ -> /swim-program/ ; /terms-and-conditions/ -> /terms-conditions/ ; /2026/01/23/hello-world/ and /category/uncategorized/ -> /
- Canonical domain: https://hippointhebathtub.ca (no www). Generate /sitemap.xml (the 12 pages) and /robots.txt pointing at it.
- Google Analytics 4 tag G-PG72L6RGW9 on every page (gtag.js, loaded without blocking render).

## Images
Download every image below into public/images/ keeping the same file name, and use them locally (do NOT hotlink). Base URL: https://raw.githubusercontent.com/AdsAstraLabs/demos/main/hippo-assets/
Files: baby.webp birthday.webp coach-abby.webp coach-bronwen.webp coach-cynthia.webp coach-daphne.webp coach-declan.webp coach-izzie.webp coach-lucas.webp coach-maria.webp coach-mia.webp coach-vincent.webp coach-vivi.webp coach-william.webp coach-zoia.webp coached-pool-area-1.webp coached-pool-area-2.webp fitness.webp hippo-logo.webp hitb-animal-levels-capybara-web.webp hitb-animal-levels-flamingo-web.webp hitb-animal-levels-hedgehog-web.webp hitb-animal-levels-hippo-web.webp hitb-animal-levels-koala-web.webp hitb-animal-levels-penguin-web.webp hitb-animal-levels-tiger-web.webp kids-help.webp low-ratio-swimming-kids.webp mermaid.webp new-swim.webp party-2.webp photo-1.webp photo-2.webp photo-3.webp photo-4.webp photo-5.webp photo-6.webp photo-7.webp photo-8.webp photo-9.webp pool-0322-9-16-14-am-1.webp pool-0322-9-16-26-am-1.webp pool-0322-9-17-21-am-1-2.webp pool-0322-9-17-21-am-1.webp pool-0322-9-17-33-am-1-1.webp pool-0322-9-17-33-am-1-2.webp pool-0610-3-27-23-pm-1.webp pool-0610-3-27-23-pm.webp pool-0610-3-27-29-pm.webp pool-0619-3-30-39-pm.webp pool-0619-3-30-51-pm.webp pool-0619-3-31-21-pm.webp pool-0619-3-31-44-pm.webp pool-0619-3-32-02-pm-1.webp pool-0619-3-32-02-pm.webp pool.webp private-lessons-1.webp private-lessons-3.webp private-pool-aquatic-centre-april-2025-1.webp private-pool-aquatic-centre-april-2025-2.webp private-pool-aquatic-centre-april-2025-3.webp private-pool-aquatic-centre-april-2025.webp swim-class.webp swim2.webp swimtop.webp
Use descriptive alt text on every image. Lazy-load everything below the fold; the hero image loads eagerly with fetchpriority high.

## Brand
- Logo: hippo-logo.webp (header left and footer). Tagline "Swim Right. Now."
- Colours: hot pink #DE2B89 (buttons, accents, small kicker lines), aqua blue #0E9ECF (headings), deep blue #0E7EAD / #0C7FA7 (hover), navy #0A4357 (body text), light sky #9FD3F3 (soft backgrounds), white.
- Fonts (Google Fonts): "Lilita One" for headings, "Sniglet" for body. Rounded, friendly, kid-and-parent feel; cards with soft rounded corners, light blue water backgrounds (pool.webp works as a faded page-hero background).
- Mobile first. Sticky header with nav: Home, About (dropdown: About Us /about/, Swim Program /swim-program/, Terms & Conditions /terms-conditions/), Services (dropdown: Coached Lessons, Low Ratio Group Classes, Birthday Parties, Specialty Classes), Promotions, Contact, and a pink "Book Online" button -> https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs . Tap-to-call (613) 695-5804 visible on mobile.
- Every page except Home starts with a hero band on pool.webp with the small kicker "Ottawa's Elite Choice for Swimming Lessons" and the page H1.

## Shared blocks (reuse as components)
1. "Our Services" block: heading "Our Services", pink sub-line "Our services are currently offered at our Aquatic Centre located conveniently in Nepean.", the paragraph "Our warm, salt-water pools are the perfect environment for all our aquatic services. Services include private coached lessons, low-ratio group classes, mermaid birthday parties, aquafit classes, facility rentals, and much more!", then 4 linked cards:
   - Low-Ratio Group Classes (low-ratio-swimming-kids.webp) -> /services/low-ratio-group-classes/ : "Enroll today in our low-ratio swim classes at our Nepean Aquatic Centre! Our children group classes are suitable for children ages 4 months - 14 years and our adult classes are suitable for ages 15+."
   - Coached Lessons (swim-class.webp) -> /services/coached-lessons/ : "Our coached lessons are the perfect option for swimmers who require one-on-one instruction, need a quieter learning environment, or have a specific area of interest to work on."
   - Birthday Parties (birthday.webp) -> /services/birthday-parties/ : "Book a pool party for your child's next birthday at our Aquatic Centre and be guaranteed a swimmingly amazing time!"
   - Specialty Classes (kids-help.webp) -> /services/specialty-classes/ : "We offer a variety of other specialty classes at our Aquatic Centre including aquafitness classes, mermaid classes, baby classes, and more."
   Shown on: Home, About, Services, Contact, Promotions, Cancellation Policy.
2. "Photo Gallery" block: heading "Photo Gallery", sub-line "Explore our bright, welcoming space where kids build confidence, learn essential water skills, and have fun every step of the way." Grid with lightbox. Home uses photo-1..6, private-pool-aquatic-centre-april-2025-1, pool-0610-3-27-23-pm, photo-7. About and Cancellation Policy use photo-1..6.
3. "Our Happy Customers!" block: embed the existing Trustindex Google reviews widget exactly as the old site did: a div containing <script defer async src="https://cdn.trustindex.io/loader.js?d92c3d16624d642bc05696e20b8"></script>. Shown on Home, About, Services, Contact, Promotions, Cancellation Policy, and the 4 service pages.
4. "Our Facility" + hours + contact form block (shown on every page, and is the main content of /contact/):
   - Aquatic Centre, 52 Antares Drive - Unit 2, Nepean, ON K2E 7Z1. Near intersection of Prince of Wales & Hunt Club. Lots of free parking on site. (613) 695-5804 (tel: link). info@hippointhebathtub.ca (mailto). Like us on Facebook -> https://www.facebook.com/hippointhebathtub/
   - Embedded Google Map of "Hippo in the Bathtub, 52 Antares Dr Unit 2, Nepean, ON K2E 7Z1" (lazy, below the fold).
   - Facility Hours: Monday 3:30 - 8:00 pm; Tuesday 9:00 am - 8:00 pm; Wednesday & Thursday 3:30 - 8:00 pm; Friday 10:00 am - 2:00 pm; Saturday 9:00 am - 5:30 pm; Sunday 9:00 am - 4:30 pm.
   - "Send us a Message" form: Name, Phone Number, Email Address (required), Message, plus a hidden honeypot input named company_website (visually hidden, tabindex -1, autocomplete off). On submit, POST JSON to https://adsastra.app/api/public/quote with body {name, phone, email, message, service: "Website contact form", company_website}. Show "Thanks! Your message was sent. We'll get back to you soon." ONLY when the response JSON has ok: true. On any other result show: "Sorry, your message didn't go through. Please call us at (613) 695-5804 or email info@hippointhebathtub.ca." Disable the button while sending. Never fake success.
5. Footer: Quick Links (Home, About, Services, Promotions, Swim Program, Register Online -> Amilia), Aquatic Centre address/phone/email (real tel: and mailto: links), logo, "(c) Hippo In The Bathtub. All rights reserved. | Terms & Conditions". No web-designer credit.

## Structured data
JSON-LD on every page: one LocalBusiness of type ["SportsActivityLocation","LocalBusiness"], name "Hippo in the Bathtub", url, logo, image, telephone +1-613-695-5804, email, address (52 Antares Drive, Unit 2, Nepean, ON, K2E 7Z1, CA), openingHoursSpecification matching the hours above, sameAs Facebook, foundingDate 2011, areaServed Ottawa. Service pages add a Service schema; pages with FAQs add FAQPage schema built from the exact FAQ text; BreadcrumbList on inner pages.

## Titles and meta descriptions
/ : "Swim Lessons in Ottawa | Hippo in the Bathtub" | "Private coached swim lessons, low-ratio group classes and birthday parties at our warm salt-water Aquatic Centre in Nepean, Ottawa. Book a free swim evaluation."
/about/ : "About Us | Hippo in the Bathtub, Ottawa" | "Since 2011 Hippo in the Bathtub has helped thousands of Ottawa swimmers. Learn our story, from backyard lessons to our Nepean Aquatic Centre."
/services/ : "Swim Services in Nepean, Ottawa | Hippo in the Bathtub" | "Coached lessons, low-ratio group classes, birthday parties and specialty classes at our warm salt-water Aquatic Centre in Nepean, Ottawa."
/services/low-ratio-group-classes/ : "Group Swim Classes Ottawa | Hippo in the Bathtub" | "Group swim classes of 2-4 swimmers for ages 4 months to adult in warm salt-water pools at our Nepean Aquatic Centre. Two-month sessions or drop-in."
/services/coached-lessons/ : "Private Swim Lessons Ottawa | Hippo in the Bathtub" | "One-on-one coached swim lessons for all ages and abilities, including swimmers with special needs, in a private warm salt-water pool in Nepean."
/services/birthday-parties/ : "Pool Birthday Parties Ottawa | Hippo in the Bathtub" | "Basic and mermaid pool parties for ages 3-10 in our warm salt-water pools in Nepean, with a decorated party room. Request your party today."
/services/specialty-classes/ : "Aquafit, Mermaid & Baby Swim Classes | Hippo in the Bathtub" | "Aquafitness classes for adults, mermaid classes for kids and Lil' Hippo baby swim times at our warm salt-water Aquatic Centre in Nepean, Ottawa."
/promotions/ : "Swim Lesson Promotions | Hippo in the Bathtub" | "Trial coached lessons, free swim evaluations, family discounts, junior coached lesson credits and the CF Appreciation military discount."
/contact/ : "Contact Us | Hippo in the Bathtub, Nepean" | "Visit our Aquatic Centre at 52 Antares Drive, Nepean. Call (613) 695-5804, email info@hippointhebathtub.ca or send us a message."
/swim-program/ : "Swim Like a Hippo Swim Program | Hippo in the Bathtub" | "Our seven-level swim program for ages 4 months to 14 years, from Koala to Hippo: the skills taught at each level and how swimmers progress."
/terms-conditions/ : "Terms & Conditions | Hippo in the Bathtub" | "Terms and conditions for Hippo in the Bathtub Aquatic Centre services: credits, refunds, make-up classes, illness and service adjustments."
/aquatic-centre-cancellation-policies/ : "Cancellation Policy | Hippo in the Bathtub" | "Cancellation, credit, refund and make-up policies for coached lessons, group swim classes and birthday parties at our Aquatic Centre."

## Page-specific layout notes
- HOME: hero on pool.webp: pink kicker "Specializing in private lessons for swimmers needing customized instruction.", H1 "Swim Right. Now." with second line "at our Aquatic Centre!", pink button "Book Complimentary Swim Evaluation" -> https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/130276?view=basicWeek&scrollToCalendar=true ; right side two rounded photos swimtop.webp and new-swim.webp. Then Services block, Gallery, Happy Customers, Facility/contact.
- LOW RATIO GROUP CLASSES: after the intro, an image strip of new-swim, swimtop, swim2; the "About the Learning Environment" section uses a slideshow of pool-0619-3-31-21-pm, pool-0322-9-16-14-am-1, pool-0322-9-16-26-am-1, pool-0619-3-32-02-pm, pool-0619-3-31-44-pm, pool-0619-3-30-39-pm, pool-0619-3-30-51-pm, pool-0322-9-17-21-am-1, pool-0322-9-17-33-am-1-1; "Swimming Pool Details" uses photo-1 and photo-2; FAQ as an accordion.
- COACHED LESSONS: learning environment slideshow: photo-9, pool-0610-3-27-23-pm, coached-pool-area-2, coached-pool-area-1; "Private Pool Details" image private-pool-aquatic-centre-april-2025-3; "Adaptive Teaching" image photo-8. "Meet Our Coaches" grid of cards (photo, name, Senior/Junior badge, bio): Abby coach-abby, Vincent coach-vincent, Maria coach-maria, Bronwen coach-bronwen, Lucas coach-lucas, Zoia coach-zoia, Daphne coach-daphne (all Senior); Cynthia coach-cynthia, Mia coach-mia, Izzie coach-izzie, William coach-william, Declan coach-declan, Vivi coach-vivi (Junior, no bio). FAQ accordion.
- BIRTHDAY PARTIES: "Request Birthday Party" button -> https://form.jotform.com/250414315716046 ; pricing section with private-lessons-1, party type section with private-lessons-3; pool environment slideshow: private-pool-aquatic-centre-april-2025, pool-0610-3-27-29-pm, pool-0610-3-27-23-pm-1, pool-0619-3-32-02-pm-1, pool-0322-9-17-21-am-1-2, pool-0322-9-17-33-am-1-2, private-pool-aquatic-centre-april-2025-2 ; party room section with party-2. FAQ accordion.
- SPECIALTY CLASSES: three sections with images fitness (Aquafitness), mermaid (Mermaid), baby (Lil' Hippo), each with its register button exactly as linked below.
- SWIM PROGRAM: seven level cards in order Koala, Hedgehog, Flamingo, Penguin, Capybara, Tiger, Hippo, each with its hitb-animal-levels-*-web image, level name, quoted subtitle, intro sentence and skills checklist.
- PROMOTIONS: one card per promotion, with the TRYSENIORCOACH code styled as a copyable code chip.

## The copy, page by page
Use it verbatim. "## " lines are headings; [text](url) are links and must keep those exact URLs; in FAQ sections each question becomes an accordion item with the following lines as its answer. Fix only obvious typos ("swimmming", "Additonal", "avaiable", "automtically", "earning environment" -> "learning environment", "Cresent" -> "Crescent").


==== PAGE /about/
## About Us
## Got a minute? Let us tell you a little more about us Hippos! 
Hippo in the Bathtub is a local, private company striving to provide the Ottawa community with the best swimming lessons possible! Since we started in 2011, Hippo in the Bathtub has helped thousands of students all over Ottawa become stronger and safer swimmers. Our focus is to promote water safety by providing our clients with quality swim instruction at their convenience.
Our first backyard season was back in Summer 2011 and for fifteen summers, Hippo in the Bathtub was a well-known backyard swimming lesson and lifeguarding provider. Summer 2025 was our final summer offering our backyard services.
In Fall 2017, we got the keys to our first indoor pool facility on Grenfell Cresent in Nepean. At the time there was no other privatized private lesson provider but from our years of backyard experience we knew that children needed a quiet, warm, and focused facility in which to become stronger and safer swimmers. Our Nepean Indoor pool facility opened to the public in Summer 2018 and quickly became a popular location for families in the surrounding neighborhoods.
In Fall 2019 we opened our second indoor facility location on Industrial Ave in Trainyards! Followed by our third indoor facility located on Cedarow Court in Stittsville in Winter 2021. Over the years each facility welcomes hundreds of swimmers of all ages and our staff loved helping each and every one meet their swimmming goals. These three indoor facilities have since closed but we opened an almost 5000 sq ft Aquatic Centre in Nepean on Antares Drive. 
Our Aquatic Centre opened its doors in March 2025 and has enabled our team to offer a wider selection of aquatic services due to the larger space. In addition to the private 1:1 lessons that we are so well known for, our team of dedicated instructors also now offer low-ratio group classes which are the perfect option for children and adults who are able to learn in a group setting. We also offer aquafit classes, Lil’ Hippo swim times, mermaid birthday parties, facility rentals, and family open swims.
We are looking forward to continuing to offer Ottawa families a comfortable environment to become stronger and safer swimmers in the coming years! 
[Book Complimentary Swim Evaluation](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/130276?view=basicWeek&scrollToCalendar=true)

==== PAGE /aquatic-centre-cancellation-policies/
## Cancellation Policy
## Coached / Private Lessons
The following cancellation policy applies when cancelling coached lessons:
100% credit if cancelled 14 days or more before the activity begins
70% credit if cancelled 7 days before the activity
50% credit if cancelled 48 hours before the activity
No credit if cancelled less than 48 hours before the activity
If cancelling more than two weeks before the scheduled date, the lesson can be cancelled online and full credit will automatically be added to the account. If cancelling later, a cancellation request must be sent by email and any applicable credit will be applied to the account.
Hippo in the Bathtub reserves the right to cancel coached lessons if staff availability changes or if a pool is unable to safely operate for a shift. We will work with affected clients to find a reasonable alternative. Cancellations for these reasons will result in a full account credit being provided. Refunds for account credit can be requested but will follow our refund policy.
## Group Swim Classes
The following cancellation policy applies when cancelling group sessions (the activity start date is the first class in the session):
100% credit if cancelled 14 days before the session start
80% credit if cancelled 7 days before the session start
60% credit if cancelled 72 hours before the session start
No credit after 72 hours before the session start
For drop-in group classes, no credit is provided for missed lessons.
## Birthday Party Bookings
100% credit until 14 days before the party
80% credit until 7 days before
60% credit until 3 days before
Cancelling less than 3 days before may not receive credit
Credits remain on the client account and can be used toward another aquatic centre service.
## Refund Policy
If a refund is requested for account credit:
Refunds are issued minus a 25% administration fee
Refunds are final and cannot be reversed
## Make-Up Credit Policy (Group Classes)
One make-up credit allowed per swimmer per session
Absence notice must be emailed before the class
Make-up classes must occur within the same session
Credits have no cash value and expire if unused.

==== PAGE /contact/
## Contact Us

==== PAGE /
## Specializing in private lessons for swimmers needing customized instruction.
## Swim Right. Now.
## at our Aquatic Centre!
[Book Complimentary Swim Evaluation](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/130276?view=basicWeek&scrollToCalendar=true)

==== PAGE /promotions/
## Promotions
## Trial Coached Lessons
Not sure if our [senior coached lessons](/services/coached-lessons/) are the right option for you or your child? Book a trial senior coached lesson for only $70 + HST. Available for new swimmers who have not swam with us before (this includes at our previous indoor locations and/or backyard lessons).
Use code TRYSENIORCOACH at checkout and the system will deduct $29 + HST from your total.
## Complimentary Swim Evaluations for Group Classes 
Not sure which of our [swim levels](/swim-program/) your child(ren) should register in for [low-ratio group classes](/services/low-ratio-group-classes/)? Stop by our Aquatic Centre for a complimentary swim evaluation and facility tour. 
[Send us a message](/contact/) to arrange a suitable time for your visit!
## Family Discount
Save 10% when you register three immediate family members on the same transaction for group swim classes! This discount does not apply to any of our other Aquatic Centre services. Immediate family members only includes parents or siblings (not cousins or other extended family members).
No coupon code is needed; simply add three group class sessions to your cart and the discount will automatically be applied.
## Junior Coached Lesson Discount for Group Class Swimmers
If a swimmer has been registered in three or more consecutive group class sessions in the same swim level, they may be eligible to receive two (2) free [junior coached lessons](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/133335?view=basicWeek&scrollToCalendar=true) to work on uncompleted skills.* Please [send us a message](/contact/) if you think your child is eligible for this discount!
*Some conditions apply.
## CF Appreciation Military Discount 
Clients with a CF One membership can sign into their CF Appreciation account to confirm the coupon code and applicable services. The respective code can be entered into our booking system at checkout.
We reserve the right to request confirmation to verify CF membership status.
[Book Complimentary Swim Evaluation](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/130276?view=basicWeek&scrollToCalendar=true)

==== PAGE /register-online/

==== PAGE /services/
## Services

==== PAGE /services/birthday-parties/
## Birthday Parties
## The Swimtastic Way to Celebrate Your Child’s Birthday! 
Book a pool party for your child’s next birthday at our Aquatic Centre and be guaranteed a swimmingly amazing time!
We offer both basic pool parties as well as a mermaid pool parties. Our parties are suitable for ages 3 - 10 years old. Parties are offered in our warm salt-water pools and can be booked on Saturday & Sunday afternoons year-round. 
[Request Birthday Party](https://form.jotform.com/250414315716046)
(image: private-lessons-1.webp)
## Birthday Party Pricing Options
Our 24-ft private salt-water pool can accommodate up to five swimmers (best suited for swimmers under the age of 7). Our 40-ft salt-water pool can accommodate up to 10 swimmers (best suited for older swimmers). 
Pricing will vary depending on pool and number of attendees. Once we have received a [completed party request form](https://form.jotform.com/250414315716046), we will be able to confirm an exact quote for your party based on the information received.
- Basic Pool Parties start at $249 + HST (for up to 5 swimmers) & at $359 + HST (for up to 10 swimmers)
- Mermaid Pool Parties start at $299 + HST (for up to five swimmers) & at $399 + HST (for up to 10 swimmers)
Party Room Rentals start at $99 + HST per 30 mins 
(image: private-lessons-3.webp)
## Birthday Party Type Options 
We offer mermaid parties as well as basic pool parties. In the pool, we have two staff members who will help the party attendees have a splashingly fun time. Pool games will vary depending on the ages and swimming ability of the swimmers.
If choosing a mermaid party, swimmers ages 3-5 years old will be wearing toddler tails (just a mermaid tail with no mono-fin) while swimmers ages 6-10 years old will be able to wear both a mermaid tail and mono-fin if their feet are large enough! We have a wide assortment of tails with lots of colour options.
Any swimmer who can’t touch the bottom of our 4-ft deep pools will be required to wear a provided puddle jumpers for safety. Unfortunately we are unable to make any exceptions for swimmers younger than 3 or older than 10 years old.
## Pool Party Environment
Birthday parties can take place in either our 24 ft or 40-ft salt-water pools, it depends on how many swimmers are participating! If a party has 5 or less swimmers, our 24-ft pool will be a great option while if a party has 6-10 swimmers, our 40-ft pool will be required in order to ensure swimmers have enough space to swim.
The main pool area (40-ft pool) has eight individual change rooms while the private pool area (24-ft pool) has two individual change rooms. Each pool area has a private washroom, hair-drying station, and seating for parents.
## Party Room Details
If the party attendees would like to continue the birthday celebration after the swim time, we do have a dedicated party room available cake and presents! The room rental includes appropriately themed table settings (plates, cups, cutlery, and napkins), balloons, and table decorations. All the party host has to provide is the food. There is a fridge and small freezer available for food if it needs to stay chilled during the swim time.
A week before your scheduled party, we will touch base to confirm the birthday child’s favourite colours as we try to incorporate them as much as possible when setting up and decorating the party room. This helps ensure that each party setup is a little unique for the birthday child!
## Birthday Party FAQs
 What are the service terms and conditions for birthday party bookings? 
Party Cancellation Policy
- 100% of credit until 14 (days) before the party date
- 80% of credit until 7 (days) before the party date
- 60% of credit until 3 (days) before the party date
- If cancelling less than 3 (days) before the party, please send us an email to discuss options. Credits are not guaranteed.
- Credits will be left on client’s account to be used towards a new booking of any Aquatic Centre service.
Party Refund Policy
- When requested, a refund for any account credit will be provided minus a 25% administration fee. Refunds are final and cannot be reversed.
Party Room Rules
- No pinatas
- No outside decorations that need to be put on walls or affixed to surfaces
- No music speakers
- The party host can have two adults present for the party while only one parent per party attendee is allowed to stay. Extra fees may be applicable for the party room time if any additional parents / adults are present.
- Additonal fees will be charged if the party room is not vacated at the end of the scheduled party time.
 Can parents participate in the pool during parties? 
Parents are not allowed in the pool during parties unless they have been included as part of the swimmer count. If a child is unable to swim, we have puddle-jumpers avaiable as well as noodles (if a child is too big for a puddle-jumper).

==== PAGE /services/coached-lessons/
## Coached Lessons
## Private, Personalized Swim Instruction for All Ages & Abilities 
Our coached lessons are the perfect option for swimmers who require one-on-one instruction, need a quieter learning environment, or have a specific area of interest to work on.
Swimmers in our coached lessons will learn in a warm, salt-water pool and will receive customized and detailed instruction for the 30 minute lesson. Senior coached lessons take place in a completely private pool while our junior coached lessons take place in our main pool area.
Our coaches have a proven track record of being able to teach swimmers of all ages and abilities. Our senior coaches have experience teaching swimmers with special needs.
[View Coach Availability Here](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs)
## Online Registration Details
Senior Coached Lessons are 30 minutes in duration and cost $99 + HST per lesson. A 2% membership fee is automatically added to all registrations due to our pool classification with the City of Ottawa. By default all senior coached lessons are private (one swimmer) but clients can add a second swimmer to the lesson for an additional $32 + HST. Once you have added a coached lesson to your online cart, the system will automatically ask you if you’d like to add a second swimmer to that specific lesson.
Junior Coached Lessons are 30 minutes in duration and cost $75 + HST per lesson. A 2% membership fee is automatically added to all registrations due to our pool classification with the City of Ottawa. There is no option to add a second swimmer to a junior coached lesson.If you are hoping to have both your children in a class, consider registering for one of our 2-swimmer [group classes](/services/low-ratio-group-classes/).
You can view coach availability online through [this link](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs). If the lesson time that you are hoping for is already booked, you can add yourself to the waitlist online. All coached lessons are considered drop-in services and are booked individually. 
## Promotions for Coached Lessons
Junior Coach Multipass:Save on our Junior Coached Lessons by purchasing this [10-lesson multipass](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/multipass)! See our booking system for more details about this service option and to confirm that our availability works for you. 
Trial Coached Lessons:  Not sure if our coached lessons are the right option for you or your child(ren)? Book a trial coached lesson for only $70 + HST. Available for new clients who have not swam with us before. Use code TRYSENIORCOACH at the checkout.
CF Appreciation Military Discount: Clients with a CF One membership can sign into their CF Appreciation account to confirm the coupon code and applicable services. The respective code can be entered into our booking system at checkout.
## About the Learning Environment
Our senior coached lessons take place in a completely separate area of our Aquatic Centre to help ensure the earning environment is as quiet and focussed as possible. The private pool area has two changerooms, a private washroom, seating options for parents as well as a toy area for children. Scroll through below gallery for pictures.
Our junior coached lessons take place in the main pool area of our Aquatic Centre.The main pool area has eight individual change rooms, a private washroom, and hair-drying station. There is also a play area for children who may have to wait while their sibling has their lesson or just arrived early for their class! [Click here](/services/low-ratio-group-classes/) for pictures and more info about our main pool area.
## Private Pool Details
Senior coached lessons take place in our 24-foot above-ground salt-water pool. The water is kept at a warm temperature (88F-91F) so that lessons can take place without any shivering! Our patented pool design has foam-lined walls which help ensure the pool is as learner friendly as possible and the wide set of stairs provide easy access into the pool. An on-deck shower is available for brief rinse-offs before and after lessons as needed.
There is only ever one lesson scheduled at a time so there is lots of space for our senior coaches to teach and help their students become stronger and safer swimmers!
## Adaptive Teaching & Coach Experience 
Our senior coaches for private lessons are our most experienced instructors who have a proven record of being able to adapt their teaching style to perfectly match all swimmers; regardless of their age, ability, and learning style.
Our senior coaches have experience working with children with special needs such as those on the autism spectrum (ASD), Down Syndrome, Cerebral Palsy, and other disabilities that require an adaptive teaching style and learning environment. Detailed receipts are available for those who require them for funding purposes.
As our senior coached lessons take place in a private pool, it is the perfect match for swimmers who need such an environment and experienced instructor in order to improve their swimming skills and water safety awareness.
## Meet Our Coaches
## Coach Abby 
## Senior
Prior to joining the Hippo team back in 2022, Abby was a competitive swimmer for many years and taught for the City of Ottawa. She loves helping her students improve each lesson and is fantastic at structuring lessons in a way that keeps her swimmers engaged.Abby’s teaching style is positive, approachable and outgoing.
## Coach Vincent
## Senior
Since joining the Hippo team almost five years ago, Vincent has a lot of fun teaching his students and helping them progress through the swim levels. His enthusiasm for teaching swimming paired with his easy-going nature, allows even the most shy of swimmers to warm up to him and enjoy their lessons!
## Coach Maria
## Senior
Through years of competitive swimming with her school team, Maria has a vast amount of knowledge when it comes to swimming strokes. For newer swimmers, Maria keeps lessons positive and simple to help her student become comfortable and to gain trust before attempting skills unassisted.
## Coach Bronwen
## Senior
Bronwen has many years of swim instructor experience working with children and adults at Davina’s Swim House in Toronto and for the City of Vaughan.
Her lessons are filled with positive encouragement and purposeful drills.
## Coach Lucas
## Senior
 If you are looking for a coach whose teaching style is light-hearted, engaging, and adaptive, then you will love swimming with Lucas! Through his extensive experience in the swimming world, Lucas excels at adapting his classes to ensure his students have a blast while mastering new skills. 
## Coach Zoia
## Senior
Zoia is a friendly and dedicated instructor who enjoys helping her students grow more confident in the water. Her patient and encouraging approach allows swimmers to feel comfortable trying new skills while progressing at a pace that works best for them. Zoia brings a positive energy to every lesson, making learning both fun and rewarding!
## Coach Daphne
## Senior
 Since joining the Hippo team last year, Daphne quickly became one of our most popular group class instructors and junior coaches. Her endless enthusiasm for working with swimmers paired with her ability to quickly adapt throughout a lesson, makes her an amazing coach option to help both new swimmers, as well as more advanced swimmers, take their swimming skills to the next level (literally)! 
## Coach Cynthia
## Junior
## Coach Mia
## Junior
## Coach Izzie
## Junior
## Coach William
## Junior
## Coach Declan
## Junior
## Coach Vivi
## Junior
## Group Class FAQs
 What is the cancellation / rescheduling policy for coached lessons? 
The following policy will apply when cancelling coached lessons:
100% of credit until 14 day(s) before the beginning of the activity
70% of credit until 7 day(s) before the beginning of the activity
50% of credit until 48 hours(s) before the beginning of the activity
No credit if cancelling less than 48 hours before the beginning of the activity.
If you need to adjust a booked coached lesson more than two weeks before the scheduled date, you can cancel the lesson online through your Amilia account and the full credit will be added automtically onto your account. You can then use the credit towards a new lesson date/time.
If you need to cancel a booked coached lesson after two weeks for the scheduled date, you will need to send our office an email. When we receive your cancellation request by email, we will cancel the lesson and apply any applicable credit (see above) to your account. Please note that all cancellations are final and can’t be reversed.
 What are your service terms and conditions? 
You can view all service terms and conditions online here: [/terms-conditions/](/terms-conditions/)
 What ages can register for coached lessons? 
Our experienced coaches have the required swimming expertise to teach all ages and abilities during coached lessons. The youngest we are able to teach is 4 months old and there is no upper age cap! Whether you have a baby looking to be introduced to the water or you are an adult who has never had the chance to learn strokes, we are there to help.
 Do coached lessons follow a swim program? 
By default, our coached lessons for children ages 4 months - 14 years old will follow our “Swim Like a Hippo” swim program. More details about our company’s swim program can be found [online here](/swim-program/). Report cards are given once the child has successfully demonstrated all skills for their respective levels. There are minimum learning times for each swim level. The only exception is for our lowest level, Koala. Koala is an age-based swim level so swimmers remain in this level until they turn 2 years old.
- Hedgehog & Flamingo: minimum of 3 hours of instruction
- Penguin & Capybara: minimum of 4 hours of instruction
- Tiger: minimum of 5 hours of instruction
- Hippo: minimum of 6 hours of instruction
If an adult registers for our coached lessons or if a parent has specific goals for their child that don’t fit within our swim program, our coaches will be happy to create a customized lesson plan that only focuses on the swimmer’s specific goals.

==== PAGE /services/low-ratio-group-classes/
## Low Ratio Group Classes
##  Aquatic Centre - Group Swim Classes 
Become a stronger and safer swimmer today by enrolling in our low-ratio swim classes at our Nepean Aquatic Centre! 
Our children group classes are suitable for children ages 4 months - 14 years and our beginner & intermediate adult classes are suitable for ages 15+. Swimmers in our group classes will learn in one of our three warm, salt-water pools.
If you are wanting 1:1 coached lessons instead, please [click here](/services/coached-lessons/).
[Book Complimentary Swim Evaluation](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/130276?view=basicWeek&scrollToCalendar=true)
## Two-Month Session Information 
Register your child along with their friends or siblings for a session of group classes! Our cost-effective group classes run in two month sessions (July/August, September/October, and so forth). 
Koala - Capybara sessions start at only $34 + HST per class and Tiger/ Hippo, and Adult sessions start at just $42+ HST per class. Total price for two month session will vary depending on the two month session (normally 7-9 classes per session).
A 2% membership fee is added to all registrations due to our pool classification with the City of Ottawa. Once in our online booking system, Amilia, you will be able to see the total cost for the session you are interested in. [Click here to register right now!](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs)
Clients can register for a pro-rated session up until two weeks past the session start date. After two weeks of a session, all remaining spots are converted for drop-in registrations (see below).
## Drop-In Class Information
Our drop-in option may be the perfect option if you are unable to commit to a full two-month session of weekly lessons.
Once a two-month session is more than two weeks started, clients can register for individual group classes Drop-in classes can be registered online up to three days prior to a class (or as little as 30 minutes before the start of a class). Drop-in classes can’t be rescheduled so once booked they are final.
Drop-in classes for levels Koala - Capybara are $36 + HST each and drop-in classes for Tiger/Hippo, and Adult are $45 + HST each.
## Group Class Promotions 
From complimentary swim evaluations to CF One discounts to family discounts, we offer an assortment of promotions for our group classes.
Head over to our [Promotions page](/promotions/) to learn more!
## About the Learning Environment
Our group swim classes take place in the main area of our Aquatic Centre. There are two 16-ft salt-water pools as well as one 40-ft salt-water pool in our main area; all used for group classes. 
The main pool area has eight individual change rooms (three of which have a change-table), a private washroom, hair-drying station as well as a convenient cubby storage area for swimmers to leave their bags during their class. There is also a play area for children who may have to wait while their sibling has their lesson or just arrived early for their class! Scroll through below gallery for pictures.
The Aquatic Centre has several seating areas for parents, with options to watch the ongoing lesson right beside the pool or wait in a quieter seating area during the class. 
## Swimming Pool Details
Koala, Hedgehog, and Flamingo classes are primarily taught in one of our 16-foot salt-water pools that are kept super warm (89-92F). Penguin, Capybara, Tiger/Hippo, and Adult classes are run in our 40-foot salt-water pool that is kept between 87-90F. All our pools are just under 4 feet deep.
Our patented pool design has foam-lined walls which help ensure the pool is as learner friendly as possible and the wide set of stairs provide easy access into the pool. On-deck showers are available for brief rinse-offs before and after classes as needed.
## Group Class Format & Level Progression
Koala, Hedgehog, Flamingo, Penguin, and Capybara group classes have a 2:1 OR 3:1 ratio. Tiger/Hippo and Adult classes have a 3:1 OR 4:1 ratio as they will have the entire 40-ft pool to themselves for the class due to the skills and distances required in their levels.
Each swimmer’s skills will be evaluated periodically throughout the session, and once a swimmer is able to correctly demonstrate a skill for two consecutive lessons, the skill will be added to their profile in Amilia (our booking system). Parents will receive an automated email every time a completed skill is added to their child’s profile. Once all skills from a swim level have been added to a swimmer’s profile, they will be able to move into the next swim level. Report cards and level badges can be requested at the front desk once a swimmer passes a level.
## Group Class FAQs
 What is the cancellation policy for group classes? 
The following policy will apply when canceling group sessions. The beginning of the activity is classified as the first class of the group session.
- 100% of credit until 14 day(s) before the beginning of the activity
- 80% of credit until 7 day(s) before the beginning of the activity
- 60% of credit until 72 hours(s) before the beginning of the activity
- No credit after 72 hours.
If registered for drop-in group classes, there is no credit provided for missed lessons as you can only register for drop-in classes 3 days before the class starts.
 What are your service terms and conditions? 
You can view all service terms and conditions online here: [/terms-conditions/](/terms-conditions/)
 Do group classes follow a swim program? 
Our group classes for children ages 4 months - 14 years old will follow our “Swim Like a Hippo” swim program. More details about our company’s swim program can be found [online here](/swim-program/). 
Beginner Swim 101 classes for adults are best suited to swimmers who do not have much swimming experience. Participants will learn floats, breathing, treading water, underwater skills, and front swim. Intermediate Swim 201 classes for adults will be available for adults wanting to learn skills such as front & back crawl, whip kick on front & back, and eggbeater.
 Can parents participate in group classes and/or be on the pool deck? 
Parent participation is only permitted in our Koala group classes (ages 4 months - 36 months).
For all other levels (Hedgehog - Hippo), the classes do not allow for any parental participation and only staff members and swimmers can be on the pool deck. As the majority of our group classes are capped at 3 swimmers, session instructors will be well equipped to help even the most timid or excited swimmer . We also have a deck monitor working during peak hours to help out as needed if a child needs a bit of reassurance, needs to use the washroom, or for any other reason needs additional help.
Parents are welcome to watch classes from one of our two viewing areas.
 How can I stay up-to-date with everything happening at the Aquatic Centre? 
If you would like to be “in the know” for all updates for the Aquatic Centre, please join our mailing list [here](https://mailchi.mp/hippointhebathtub/hippo-aquatic-centre). We send all updates for the Aquatic Centre to our mailing list, with information about when the next registration/booking opens, updates to new services, etc. 
 Do you offer makeup classes in case we miss a week? 
Each swimmer registered in a full group session is permitted one makeup credit per session. Notice must be provided by email prior to the class that the swimmer will be absent from. If advance notice is provided, we will allow the swimmer to register as a drop-in for another group class within the same session. 
Make-up credits have no face value, can only be used by the swimmer who missed the class, and expire if not used within the same session period that the missed class was in. Make-up classes cannot be rescheduled once booked and there is no make-up credit available for missed make-up classes.
If you registered for an individual drop-in class, please note that no makeup classes are available if you miss the drop-in class.
 How many classes are offered at a time? 
Classes scheduled in the PINK pool can have up to two group classes running simultaneously. Classes scheduled in the GREEN or BLUE pools will only have one class running in the pool at a time.
As we have three pools at our Aquatic centre, we are able to offer multiple class times each day for all swim levels. This helps families with multiple swimmers to find class times close together even if their children are in different levels.
 What are your group class ratios? 
For levels Koala, Hedgehog, Flamingo, Penguin, and Capybara, it will be a 2:1 OR 3:1 swimmer to instructor ratio. For Tiger, Hippo, and Adult levels, it will be a 3:1OR 4:1 swimmer to instructor ratio.

==== PAGE /services/specialty-classes/
## Specialty Classes
## Aquatic Fun for the Whole Family! 
In addition to our [low-ratio group swim classes](/services/low-ratio-group-classes/) and [coached swim lessons](/services/coached-lessons/), we offer a variety of other specialty classes at our Aquatic Centre including aquafitness classes, mermaid classes, baby classes, and more. 
Keep scrolling to learn more or click on one of the above links.
[Book Complimentary Swim Evaluation](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs)
## Aquafitness Class Information & Pricing 
If you are an adult looking to stay fit and active with aquafit classes, one of our aquafitness class options might be a great fit for you! Classes are offered in two-month sessions or as individual drop-ins. Visit our booking page to view specific class programming.
Classes take place in our warm, four-feet deep, salt-water pools and are led by experienced aquafit instructors. All class movements can be adjusted to match each participant’s level and comfort and ability.
Two-month sessions (7 classes) are $115 + HST or individual drop-in registrations are $25 + HST.
[ Register for Aquafitness Classes](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/132242)
## Mermaid Class Information & Pricing 
If your child is hoping to try swimming like a mermaid, one of the below options might be a great fit for them! Classes are offered on a drop-in registration basis and cost $35 + HST per class.
MERMAIDING 101: Come out with your friends for a group class filled with lots of mermaid fun and games. This class is suitable for both non-swimmers and beginner swimmers. The mermaid tails will be the toddler style (so no mermaid mono-fin, just a beautiful mermaid skirt that will make your little one feel like Ariel)! Puddle-jumpers will be provided. Ages 3-6 years old.
MERMAIDING 201: This unique training session will provide your child with the perfect opportunity to learn the diverse and fun skills of being a mermaid! Swimmers will have the opportunity to wear both a mermaid tail and a mono-fin while learning dolphin kick and other skills required for the full mermaid experience. Ages 7-10 years old.
[Register for a Mermaid Class](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/120755)
## Lil’ Hippo Class Information & Pricing 
Introduce your baby to the water & enjoy coffee with fellow parents! 30 minutes of guided swim time in our warm salt-water pools followed by 60 minutes of play & coffee time in our welcoming social room. These classes are suitable for ages 4 months - 35 months.
Registration for these classes are on a drop-in basis and the cost is $14 + HST per swimmer. Minimum one parent per child but if a second parent or grandparent would also like to attend, that is fine too. Make it a morning filled with splashingly fun memories!
We provide all the pool toys for the little ones, one Nespresso pod per paid adult, and an assortment of toys for the little ones to play with while their parent(s) sip & chat.
[Register for a Lil' Hippo Class](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/120755)

==== PAGE /swim-program/
## Swim Program
## “Swim Like a Hippo” Swim Program
## Helping Children Become Stronger & Safer Swimmers 
Through the seven levels in our “Swim Like a Hippo” program, swimmers will go from learning to be comfortable in the pool to being able to perform five strokes and a number of water safety, lifesaving, & survival skills. The swim program is suitable for ages 4 months - 14 years old. If you are new to our swim school, please book a complimentary swim evaluation for them [online here](https://app.amilia.com/store/en/hippo-in-the-bathtub/shop/programs/calendar/130276?view=basicWeek&scrollToCalendar=true)! 
Adult swim lessons are also available; our senior and junior coached lessons are perfect for swimmers over the age of 15. Our coaches will be able to customize these private lessons to match your goals. 
(image: hitb-animal-levels-koala-web.webp)
## Koala
## “Parented Classes to Promote Water Comfort for Babies” 
In this level, little ones will become comfortable in the water through play-based learning!
- Getting wet
- Front & back movements
- Submersion (assisted)
- Play & songs
- Techniques for holding & supporting babies in water
- Safe entries & exits
(image: hitb-animal-levels-hedgehog-web.webp)
## Hedgehog
## “Introduction to Assisted Swimming” 
In this level, swimmers will learn basic assisted skills to get them started on their swimming journey!
- Blow bubbles
- Front & back floats (assisted)
- Front & back rocketships (assisted)
- Kicking on front & back - 2 meters (assisted)
- Jumping (assisted)
- Submersion - 3 seconds
(image: hitb-animal-levels-flamingo-web.webp)
## Flamingo
## “Completing Basic Swimming Skills Unassisted”
In this level, swimmers will continue their swimming journey by learning to complete all basic swimming skills unassisted!
- Front & back floats - 3 seconds
- Front & back rocketships - 2 meters
- Front & back rocketships with kick - 5 meters
- Roll-over rocketship with kick - 5 meters
- Front swim - 5 meters
- Side glide - 2 meters (assisted)
- Jump into deep water and return
(image: hitb-animal-levels-penguin-web.webp)
## Penguin
## “Mastering Basic Skills & Introduction of Water Survival Skills” 
In this level, swimmers will increase distances in all the basic swimming skills and learn some new water survival skills.
- Front & back rocketship with kick - 12 meters
- Front swim with arms - 12 meters
- Distance swim - 25 meters
- Sculling on back - 10 meters
- Tread water - 30 seconds
- Sitting dive & return
- Retrieve item at 3-4 feet depth
(image: hitb-animal-levels-capybara-web.webp)
## Capybara
## “Introduction to Strokes”
In this level, swimmers will learn three strokes, increase their distance swim, and improve their water survival skills!
- Front & back crawl - 50 meters
- Elementary backstroke - 25 meters
- Whip kick on front - 10 meters
- Distance swim - 100 meters
- Tread water - 1 minute
- Front somersaults
- Kneeling dive
- Head-up front crawl - 5 meters
(image: hitb-animal-levels-tiger-web.webp)
## Tiger
##  “Stroke Improvement & Increased Endurance”
In this level, swimmers will improve technique for the strokes they already know, learn breaststroke, and gain endurance.
- Front & back crawl - 100 meters
- Elementary backstroke & breaststroke - 50 meters
- Distance swim - 200 meters
- Tread water - 2 minutes
- Handstands & back somersaults
- Underwater swim - 5 meters
- Head-up front crawl - 12 meters
(image: hitb-animal-levels-hippo-web.webp)
## Hippo
## “Stroke Refinement & Advanced Water Survival Skills” 
In this level, swimmers will refine their technique on four strokes, learn a new stroke, and improve their water survival skills.
- Front & back crawl - 200 meters
- Elementary backstroke & breaststroke - 100 meters
- Sidestroke - 50 meters
- Distance swim - 300 meters
- Travelling eggbeater - 3 minutes
- Dolphin kick - 10 meters
- Underwater swim - 10 meters
- Head-up front crawl - 25 meters

==== PAGE /terms-conditions/
## Terms & Conditions
## Aquatic Centre Services
All applicable terms and conditions will be clearly outlined in our booking system for acceptance prior to purchase. Below are the general terms and conditions for many of our services.
Cancellation Policies: Cancellation policies for each of our service types can be found [here](/aquatic-centre-cancellation-policies/). Exceptions to our cancellation policies will not be available after purchase.
Credit Usage: Credits from purchased services may only be used at our Aquatic Centre facility. Credits can not be transferred to another location.
Refund Policy:  When requested, a refund for any account credit will be provided minus a 25% administration fee. Refunds are final and cannot be reversed.
Discount Policy: If a client uses a discount code without meeting the discount requirements, the applicable registration will be cancelled and the purchase value will be credited to the clients’s account. Refunds for any credit amount will follow our normal refund policy.
Make-Up Credit Policy for Group Classes:  Each swimmer registered in a full group session is permitted one makeup credit per session. Notice must be provided by email prior to the class that the swimmer will be absent from. If advance notice is provided, we will allow the swimmer to register as a drop-in for a matching group class within the same session. Make-up credits have no face value, can only be used by the swimmer who missed the class, and expire if not used within the same session period that the missed class was in. Drop-in classes for make-up credits can be scheduled up to three days before the class. No make-up credits are available for missed drop-in lessons. NOTE: No price adjustment will be provided if a swimmer who is registered in one of our 2-swimmer group classes chooses a non-2-swimmer class for their makeup credit.
Illness Policy: Any adult or child who are displaying two or more symptoms are asked to not visit the facility until they are feeling better. Any service missed due to illness will be forfeited unless enough cancellation notice was provided ([see cancellation policies here](/aquatic-centre-cancellation-policies/)). Swimmer substitutions may be available on a case-by-case basis and upon request for our senior coached and junior coached lessons.
Service Adjustments: Hippo in the Bathtub reserves the right to cancel services if staff availability changes or if a pool is unable to safely operate for a shift. We will work with affected clients to find a reasonable alternative. Cancellations for these reasons will result in a full account credit being provided. Refunds for account credit can be requested but will follow our refund policy. Additional service adjustment policies for specific services are outlined below:
- Low-Ratio Group Classes
- If a group class has only one (1) swimmer registered, we reserve the right to consolidate a class and adjust your class time. If a client does not wish to swim at the adjusted time on the same day, they can receive an account credit for any unused classes within the session. Refunds for this account credit, if requested, will follow our refund policy. 
- While we do our very best to maintain consistent instructors for group class sessions, we do not guarantee any specific instructor (including gender of instructor) as their availability may change, they may become ill, or may be unable to continue with our company.
- If a group class during a session is cancelled due to instructor unavailability, pool maintenance or other unforeseen circumstances, clients will receive a make-up lesson credit for the cancelled class which can be used at any time during the current two-month session.
- Junior Coached Lessons
- If the junior coach selected at time of booking becomes unavailable for any shift, we will assign another coach to cover the shift and will notify the client of the change. Our cancellation policy will remain applicable if a client wishes to adjust a booked lesson due to a junior coach change.
- Please note that our junior coaches do not have the same experience as our senior coaches, and all junior coach lessons will be run out of a busier, shared environment. Given this, junior coach lessons are not appropriate for swimmers with additional physical or learning needs at this time.If you are interested in booking a junior coach lesson but are unsure if it will be a good fit, please email us (info@hippointhebathtub.ca) before booking. We reserve the right to cancel junior coach lessons if it is not a suitable match for the coach or the student. Any lessons cancelled for this reason will be returned to the account as account credit. If a refund is requested, it will follow our normal refund policy.
- Senior Coached Lessons
- Coached lessons will proceed with the specific coach that was selected at booking. If the coach becomes unavailable for any shift, we will secure another coach to cover the shift. We will follow client preferences noted in the intake form (i.e., prefer to swim with a female coach, prefer to cancel the lesson, prefer to hold the lesson with any swim coach) when assigning coached lessons to a replacement coach.
Service Modifications: We reserve the right to update services and prices at any time as long as we provide twenty-one (21) days notice. Notice will be provided through our website and by email.
Instructor Feedback:  For group classes, instructor feedback will be very minimal in order to keep our classes running on schedule. If you would like more detailed feedback on your child’s progress in group classes, please stop by our front desk and submit a request. For coached lessons, please notify the coach at the beginning of the lesson and they will end the lesson early in order to provide the feedback within the booked time slot. Feedback will not be provided outside of the 30 minute lesson.
Facility Rentals: A lifeguard will be present at all times during the rental. All swimmers must follow posted pool rules as well as any other rules required by the lifeguard to ensure everyone’s safety. The time slot booked for the facility rental will be exclusively reserved for your booking. To allow for the enjoyment of the rental space for the next client, please ensure that all rental particpants and their belongings have exited the rental area by the end of the rental time. To ensure the safety of all, only registered swimmers will be allowed onto any pool deck. Additionally, only Hippo in the Bathtub flotation devices (pool noodles, puddle jumpers, etc) and toys will be permitted in the pool and pool area. If you would like to bring your own toys or flotation devices, please email the office (info@hippointhebathtub.ca) to receive permission to do so. Clients and patrons of Hippo in the Bathtub are not permitted to take pictures or videos while at our facility unless they have received permission from company management. Hippo in the Bathtub is not liable for any third-party picture or video taken of you or your child(ren) without consent.